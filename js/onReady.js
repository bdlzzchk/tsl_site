// ============= PRELOADER SCRIPT ===================

// ============= END PRELOADER SCRIPT ===================
/*closestchild*/
 
 ;(function($){
  $.fn.closestChild = function(selector) {
    var $children, $results;
    
    $children = this.children();
    
    if ($children.length === 0)
      return $();
  
    $results = $children.filter(selector);
    
    if ($results.length > 0)
      return $results;
    else
      return $children.closestChild(selector);
  };
})(window.jQuery);

/* /. closestchild*/







$(function(){
    //var hPanelHide = 36; // В каком положении полосы прокрутки прятать верхнюю панель
    var top_show = 280; // В каком положении полосы прокрутки начинать показ кнопки "Наверх"
    var speed = 500; // Скорость прокрутки
    var $backButton = $('#up');
    
    var tempScrollTop, currentScrollTop = 0;

    $(window).scroll(function () { // При прокрутке попадаем в эту функцию
        /* В зависимости от положения полосы прокрукти и значения top_show, скрываем или открываем кнопку "Наверх" */
        if ($(this).scrollTop() > top_show) {
            $backButton.fadeIn();
        }
        else {
            $backButton.fadeOut();
        }
        

        currentScrollTop = jQuery(window).scrollTop();
        
        /*
        if (tempScrollTop < currentScrollTop ){
            if ($(this).scrollTop() > hPanelHide) {
                $('.header-wrapper').addClass('hPanelHide');
            }
            else {
                $('.header-wrapper').removeClass('hPanelHide');
            }
        }
        
        
        else if (tempScrollTop > currentScrollTop ){
            $('.header-wrapper').removeClass('hPanelHide');
        }
        */
        
        tempScrollTop = currentScrollTop;

        
    });
    
    
    $backButton.click(function () { // При клике по кнопке "Наверх" попадаем в эту функцию
        /* Плавная прокрутка наверх */
        scrollto(0, speed);
    });

    // scrollto
    window.scrollto = function(destination, speed) {
        if (typeof speed == 'undefined') {
            speed = 800;
        }
        jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination-60}, speed);
    };
    $("a.scrollto").click(function () {
        var elementClick = $(this).attr("href")
        var destination = $(elementClick).offset().top;
        scrollto(destination);
        return false;
    });
    // end scrollto 

    // fancybox
    // $('.fancybox').fancybox({
    //     padding: 0,
    //     openEffect  : 'fade',
    //     closeEffect : 'fade',
    //     nextEffect  : 'none',
    //     prevEffect  : 'none',
    //     helpers: {
    //     overlay: {
    //       locked: false
    //     }
    //     }
    // });
    
    // $('.fancyboxModal').fancybox({
    //     autoResize:true,            
    //     padding: 0,
    //     openEffect  : 'fade',
    //     closeEffect : 'fade',
    //     nextEffect  : 'none',
    //     prevEffect  : 'none',
    //     fitToView : false, 
    //     maxWidth: '100%',
    //     scrolling : "no",
    //     helpers: {
    //     overlay: {
    //       locked: false
    //     }
    //     }
    // });

    // if(response.success){
    //     $.fancybox.open([{ href : '#responseMessage', padding : 0 }] );
    //     $('#responseMessageTitle').text('Сообщение успешно отправлено!');
    //     $('#responseMessageText').html('<p>'+response.message+'</p>');
    //     $('.fancyClose').click(function(){
    //         $.fancybox.close('#responseMessage');
    //         return false;
    //     });
    // }else{
    //     $.fancybox.open([{ href : '#responseMessage', padding : 0 }] );
    //     $('#responseMessageTitle').text('Сообщение не отправлено!');
    //     $('#responseMessageText').html('<p>'+response.message+'</p>');
    //     $('.fancyClose').click(function(){
    //         $.fancybox.close('#responseMessage');
    //         return false;
    //     });
    // } 
    // end fancybox
    
    

    
    // validation
    
    $('.rf').each(function(){
        var item = $(this),
        btn = item.find('.btn');
        function checkInput(){
            item.find('select.required').each(function(){
                if($(this).val() == '0'){
                    $(this).parents('.form-group').addClass('error');
                    $(this).parents('.form-group').find('.error-message').show();

                } else {
                    $(this).parents('.form-group').removeClass('error');
                }
            });
            
            
            item.find('input[type=text].required').each(function(){
                if($(this).val() != ''){
                    $(this).removeClass('error');
                } else {
                    $(this).addClass('error');
                    $(this).parent('.form-group').find('.error-message').show();
                    
                }
            });
            
            
            item.find('textarea.required').each(function(){
                if($(this).val() != ''){
                    $(this).removeClass('error');
                } else {
                    $(this).addClass('error');
                    $(this).parent('.form-group').find('.error-message').show();
                    
                }
            });
            
            item.find('input[type=email]').each(function(){
                var regexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
                var $this = $(this);
                if($this.hasClass('required')){
                    
                    if (regexp.test($this.val())) {
                        $this.removeClass('error');
                    }else {
                        $this.addClass('error');
                        $(this).parent('.form-group').find('.error-message').show();
                    }
                }else{
                    
                    if($this.val() != ''){
                        if (regexp.test($this.val())) {
                            $this.removeClass('error');
                        }else {
                        
                        $this.addClass('error');
                        $(this).parent('.form-group').find('.error-message').show();
                        }
                    }else{
                        $this.removeClass('error');
                    }
                }
                
                
            });
            
            
            item.find('input[type=checkbox].required').each(function(){
                if($(this).is(':checked')){
                    $(this).removeClass('error');
                } else {
                    $(this).addClass('error');
                    $(this).parent('.form-group').find('.error-message').show();
                }
            });
            
        
        }

        btn.click(function(){
            checkInput();
            var sizeEmpty = item.find('.error:visible').size();
            if(sizeEmpty > 0){
                return false;
            } else {
                item.submit();
                $.fancybox.close();
            }
        });

    });
    
    
    $('.required').change(function(){
        if($(this).val() != ''){
            $(this).removeClass('error');
            $(this).parents('.form-group').find('.error-message').hide();
        }
        
    });
    
    
    $('select').change(function(){
        if($(this).val() == ''){     
            // Если значение empty
            $(this).parents('.form-group').removeClass('selected');

        } else {
            // Если значение не empty
            $(this).parents('.form-group').addClass('selected');
            $(this).parents('.form-group').removeClass('error');
        }
    });
    
    // end validation
    
    
    
    

     // tabs

      $('ul.tabs').on('click', 'li:not(.current)', function() {
        
        
        $(this)
          .addClass('current').siblings().removeClass('current')
          .closest('div.section').closestChild('div.box').removeClass('visible').eq($(this).index()).addClass('visible');
      });
      
      
      
        $('ul.tabs.mobile li').click(function(){
            $(this).parent().hide().siblings('.mobile-tab-header').html($(this).html());
            $('.mobile-tab-header').removeClass('active');
        });
      
        $('.mobile-tab-header').click(function(e){
            $(this).toggleClass('active');
            $(this).siblings('.tabs.mobile').toggle();
            e.stopPropagation();
        });
    
        
        $('body').click(function(){
            if($('.mobile-tab-header').is(':visible')){
                $('.tabs.mobile').hide();
                $('.mobile-tab-header').removeClass('active');
            }
        });

    // end tabs   
    

    
 
// Mobile menu

    $('.mob-menu-btn').click(function(){
        $('.mobile-menu').toggleClass('open');
    });
    $('.mob-menu-btn').click(function(){
        $('.header-wrapper').toggleClass('active');
    });
    $('.mobile-menu-close').click(function(){
        $('.mobile-menu').removeClass('open');
    });
    
    $('.mobile-menu ul a').click(function(){
        $('.mobile-menu').removeClass('open');
    });
    
    $('.mob-menu-btn').click(function(){
        $('.mob-menu-btn').toggleClass('active');
    });
    
    $('.mobile-menu, .mob-menu-btn').click(function(e){
        if ($(event.target).hasClass('fancyboxModal') == false) {
            e.stopPropagation();
        }
    });
    $('body').click(function(){
        $('.mobile-menu').removeClass('open');
        $('.header-wrapper').removeClass('active');
        $('.mob-menu-btn').removeClass('active')
    });
    
    
    $('.mobile-menu ul > li').has('ul').addClass('down');
    $('.mobile-menu .down > ul').before('<span class="dropdown-button"></span>');
    

    
    $('.mobile-menu .dropdown-button').click(function(){
        $(this).toggleClass('active');
        if($(this).siblings('ul').is(':visible')){
            $(this).siblings('ul').slideUp();
        }else{
            $(this).siblings('ul').slideDown();
        }
        
    });

// End mobile menu
   
    


// Carousels
    
    
    // $('.top-slider').slick({
    //     infinite: true,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 6000,
    //     speed: 800,
    //     draggable: false,
    //     fade: true,
    //     arrows: true,
    //     dots: false,
    //     prevArrow: '<span class="slick-prev"><i class="material-icons">navigate_before</i></span>',
    //     nextArrow: '<span class="slick-next"><i class="material-icons">navigate_next</i></span>',
    //     responsive: [
    //         {
    //           breakpoint: 767,
    //           settings: {
    //             arrows: false,
    //             dots: true,
    //           }
    //         }
    //     ] 
    // }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
    //     $('.top-slider .table').removeClass('active');
    // }).on('afterChange', function(event, slick, currentSlide, nextSlide){
    //     $('.top-slider .table').addClass('active');
    // });
    
    
    $('.page-slider').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        speed: 700,
        fade: true,
        arrows: true,
        dots: false,
        nextArrow: '<a href="#" class="slick-next"></a>',
        prevArrow: '<a href="#" class="slick-prev"></a>',
        draggable: false,
        asNavFor: '.page-thumbs-slider',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                }
            }
        ]
    });
    
    
    $('.page-thumbs-slider').slick({
        infinite: false,
        slidesToShow: 6,
        slidesToScroll: 1,
        speed: 700,
        fade: false,
        arrows: false,
        dots: false,
        draggable: false,
        asNavFor: '.page-slider',
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 7,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                }
            }
        ]
    });
    
    
    $('.portfolio-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        autoplaySpeed: 4000,
        speed: 800,
        arrows: true,
        prevArrow: '<a href="#" class="slick-prev"></a>',
        nextArrow: '<a href="#" class="slick-next"></a>',
        responsive:[
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            },
        ]
    });
    
    
// End Carousels
    
    
    // проверка на Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(isIE){
        $('body').addClass('ie');
    }
    // end
    
    
    // accordeon
    var $thisElement, 
        $thisElementContent,
        $elements,
        $elementsContent;
        
    $('.accordeon .title').click(function(){
        $thisElement = $(this).parent();
        $thisElementContent = $thisElement.find('.element-content');
        $elements = $thisElement.siblings();
        $elementsContent = $elements.find('.element-content');
        
        $elements.removeClass('active');
        $elementsContent.slideUp();
        if(!$thisElement.hasClass('active')){
            $thisElement.addClass('active');
            $thisElementContent.slideDown();
        }else{
            $thisElement.removeClass('active');
            $thisElementContent.slideUp();
        }
        
    });
    
    
    $('.aside-menu-title-xs').click(function(){
        $('.aside-menu').toggleClass('active');
    });
            
    
    var onlinesrvicetheme;
    $('a[href="#onlineservice"]').click(function(){
        onlinesrvicetheme = $(this).data('theme');
        $('#onlineservicethemeinput').val(onlinesrvicetheme);
    });
    
    // if ( !$("html").hasClass("touch") ){
    //     if ($(window).width() > 991) var s = skrollr.init({
    //         smoothScrolling: !0,
    //         smoothScrollingDuration: 1e3
    //     });
    // }
    
    
});// end ready




    