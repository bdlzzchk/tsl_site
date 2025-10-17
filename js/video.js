/**
 * A lightweight youtube embed. Still should feel the same to the user, just MUCH faster to initialize and paint.
 *
 * Thx to these as the inspiration
 *   https://storage.googleapis.com/amp-vs-non-amp/youtube-lazy.html
 *   https://autoplay-youtube-player.glitch.me/
 *
 * Once built it, I also found these:
 *   https://github.com/ampproject/amphtml/blob/master/extensions/amp-youtube (👍👍)
 *   https://github.com/Daugilas/lazyYT
 *   https://github.com/vb/lazyframe
 */
class LiteYTEmbed extends HTMLElement {
    connectedCallback() {
        this.videoId = this.getAttribute('videoid');
  
        let playBtnEl = this.querySelector('.lty-playbtn');
        // A label for the button takes priority over a [playlabel] attribute on the custom-element
        this.playLabel = (playBtnEl && playBtnEl.textContent.trim()) || this.getAttribute('playlabel') || 'Play';
  
        /**
         * Lo, the youtube placeholder image!  (aka the thumbnail, poster image, etc)
         *
         * See https://github.com/paulirish/lite-youtube-embed/blob/master/youtube-thumbnail-urls.md
         *
         * TODO: Do the sddefault->hqdefault fallback
         *       - When doing this, apply referrerpolicy (https://github.com/ampproject/amphtml/pull/3940)
         * TODO: Consider using webp if supported, falling back to jpg
         */
        if (!this.style.backgroundImage) {
          this.style.backgroundImage = `url("https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg")`;
        }
  
        // Set up play button, and its visually hidden label
        if (!playBtnEl) {
            playBtnEl = document.createElement('button');
            playBtnEl.type = 'button';
            playBtnEl.classList.add('lty-playbtn');
            this.append(playBtnEl);
        }
        if (!playBtnEl.textContent) {
            const playBtnLabelEl = document.createElement('span');
            playBtnLabelEl.className = 'lyt-visually-hidden';
            playBtnLabelEl.textContent = this.playLabel;
            playBtnEl.append(playBtnLabelEl);
        }
        playBtnEl.removeAttribute('href');
  
        // On hover (or tap), warm up the TCP connections we're (likely) about to use.
        this.addEventListener('pointerover', LiteYTEmbed.warmConnections, {once: true});
  
        // Once the user clicks, add the real iframe and drop our play button
        // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
        //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003
        this.addEventListener('click', this.addIframe);
  
        // Chrome & Edge desktop have no problem with the basic YouTube Embed with ?autoplay=1
        // However Safari desktop and most/all mobile browsers do not successfully track the user gesture of clicking through the creation/loading of the iframe,
        // so they don't autoplay automatically. Instead we must load an additional 2 sequential JS files (1KB + 165KB) (un-br) for the YT Player API
        // TODO: Try loading the the YT API in parallel with our iframe and then attaching/playing it. #82
        this.needsYTApiForAutoplay = navigator.vendor.includes('Apple') || navigator.userAgent.includes('Mobi');
    }
  
    /**
     * Add a <link rel={preload | preconnect} ...> to the head
     */
    static addPrefetch(kind, url, as) {
        const linkEl = document.createElement('link');
        linkEl.rel = kind;
        linkEl.href = url;
        if (as) {
            linkEl.as = as;
        }
        document.head.append(linkEl);
    }
  
    /**
     * Begin pre-connecting to warm up the iframe load
     * Since the embed's network requests load within its iframe,
     *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
     * So, the best we can do is warm up a few connections to origins that are in the critical path.
     *
     * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
     * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
     */
    static warmConnections() {
        if (LiteYTEmbed.preconnected) return;
  
        // The iframe document and most of its subresources come right off youtube.com
        LiteYTEmbed.addPrefetch('preconnect', 'https://www.youtube-nocookie.com');
        // The botguard script is fetched off from google.com
        LiteYTEmbed.addPrefetch('preconnect', 'https://www.google.com');
  
        // Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling.
        LiteYTEmbed.addPrefetch('preconnect', 'https://googleads.g.doubleclick.net');
        LiteYTEmbed.addPrefetch('preconnect', 'https://static.doubleclick.net');
  
        LiteYTEmbed.preconnected = true;
    }
  
    fetchYTPlayerApi() {
        if (window.YT || (window.YT && window.YT.Player)) return;
  
        this.ytApiPromise = new Promise((res, rej) => {
            var el = document.createElement('script');
            el.src = 'https://www.youtube.com/iframe_api';
            el.async = true;
            el.onload = _ => {
                YT.ready(res);
            };
            el.onerror = rej;
            this.append(el);
        });
    }
  
    async addYTPlayerIframe(params) {
        this.fetchYTPlayerApi();
        await this.ytApiPromise;
  
        const videoPlaceholderEl = document.createElement('div')
        this.append(videoPlaceholderEl);
  
        const paramsObj = Object.fromEntries(params.entries());
  
        new YT.Player(videoPlaceholderEl, {
            width: '100%',
            videoId: this.videoId,
            playerVars: paramsObj,
            events: {
                'onReady': event => {
                    event.target.playVideo();
                }
            }
        });
    }
  
    async addIframe(){
        if (this.classList.contains('lyt-activated')) return;
        this.classList.add('lyt-activated');
  
        const params = new URLSearchParams(this.getAttribute('params') || []);
        params.append('autoplay', '1');
        params.append('playsinline', '1');
  
        if (this.needsYTApiForAutoplay) {
            return this.addYTPlayerIframe(params);
        }
  
        const iframeEl = document.createElement('iframe');
        iframeEl.width = 560;
        iframeEl.height = 315;
        // No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
        iframeEl.title = this.playLabel;
        iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframeEl.allowFullscreen = true;
        // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
        // https://stackoverflow.com/q/64959723/89484
        iframeEl.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${params.toString()}`;
        this.append(iframeEl);
  
        // Set focus for a11y
        iframeEl.focus();
    }
  }
  // Register custom element
  customElements.define('lite-youtube', LiteYTEmbed);

  !function(e){"use strict";e.fn.accordionjs=function(n){if(this.length>1)return this.each(function(){e(this).accordionjs(n)}),this;var c=this,t={isInteger:function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},isObject:function(e){return"[object Object]"===Object.prototype.toString.call(e)},sectionIsOpen:function(e){return e.hasClass("acc_active")},getHash:function(){return window.location.hash?window.location.hash.substring(1):!1}},o=e.extend({closeAble:!1,closeOther:!0,slideSpeed:150,activeIndex:1,openSection:!1,beforeOpenSection:!1},n);e.each(o,function(e){var n=e.replace(/([A-Z])/g,"-$1").toLowerCase().toString(),t=c.data(n);(t||!1===t)&&(o[e]=t)}),(o.activeIndex===!1||o.closeOther===!1)&&(o.closeAble=!0);var i=function(){c.create(),c.openOnClick(),e(window).on("load",function(){c.openOnHash()}),e(window).on("hashchange",function(){c.openOnHash()})};return this.openSection=function(n,c){e(document).trigger("accjs_before_open_section",[n]),"function"==typeof o.beforeOpenSection&&o.beforeOpenSection.call(this,n),c=c>=0?c:o.slideSpeed;var t=n.children().eq(1);t.slideDown(c,function(){e(document).trigger("accjs_open_section",[n]),"function"==typeof o.openSection&&o.openSection.call(this,n)}),n.addClass("acc_active")},this.closeSection=function(n,c){e(document).trigger("accjs_before_close_section",[n]),"function"==typeof o.beforeCloseSection&&o.beforeCloseSection.call(this,n),c=c>=0?c:o.slideSpeed;var t=n.children().eq(1);t.slideUp(c,function(){e(document).trigger("accjs_close_section",[n]),"function"==typeof o.closeSection&&o.closeSection.call(this,n)}),n.removeClass("acc_active")},this.closeOtherSections=function(n,t){var o=n.closest(".accordionjs").children();e(o).each(function(){c.closeSection(e(this).not(n),t)})},this.create=function(){c.addClass("accordionjs");var n=c.children();if(e.each(n,function(n,t){c.createSingleSection(e(t))}),t.isArray(o.activeIndex))for(var i=o.activeIndex,s=0;s<i.length;s++)c.openSection(n.eq(i[s]-1),0);else o.activeIndex>1?c.openSection(n.eq(o.activeIndex-1),0):!1!==o.activeIndex&&c.openSection(n.eq(0),0)},this.createSingleSection=function(n){var c=n.children();n.addClass("acc_section"),e(c[0]).addClass("acc_head"),e(c[1]).addClass("acc_content"),n.hasClass("acc_active")||n.children(".acc_content").hide()},this.openOnClick=function(){c.on("click",".acc_head",function(n){n.stopImmediatePropagation();var i=e(this).closest(".acc_section");t.sectionIsOpen(i)?o.closeAble?c.closeSection(i):1===c.children().length&&c.closeSection(i):o.closeOther?(c.closeOtherSections(i),c.openSection(i)):c.openSection(i)})},this.openOnHash=function(){if(t.getHash()){var n=e("#"+t.getHash());n.hasClass("acc_section")&&(c.openSection(n),o.closeOther&&c.closeOtherSections(n),e("html, body").animate({scrollTop:parseInt(n.offset().top)-50},150))}},i(),this}}(jQuery);