'use strict';

var Project = function Project() {

   
    this.sliderDocument = '[data-slider="document"]'; // Слайдер документы
    this.sliderPortfolio = '[data-slider="portfolio"]'; // Слайдер Портфолио
    this.sliderWorks = '[data-slider="works"]'; // Слайдер Портфолио
    this.sliderPartner = '[data-slider="partner"]'; // Слайдер Портфолио
    this.modal = '[data-modal]';  // Модальные окна
    this.modalOpen = '[data-modal-open]'; // Открытие модалок
    this.modalClose = '[data-modal-close]'; // Закрытие модалок
    this.menu = '.js-open-menu'; // Открытие и закрытие меню

    this.init();
};

Project.prototype = {
    init: function init() {

        this.initModal();   // Модальные окна
        this.initSliderDocument(); // Слайдер документы
        this.initSliderPortfolio(); // Слайдер Спецпредложения
        this.initSliderWorks(); // Слайдер Спецпредложения
        this.initSliderPartner(); // Слайдер партнёры

        $(document).on('click', this.menu, $.proxy(this.eventMenu, this)); // Открытие и закрытие меню
        $(document).on('click', this.modalOpen, $.proxy(this.eventModalOpen, this)); // Открытие модалтных окон
        $(document).on('click', this.modalClose, $.proxy(this.eventModalClose, this)); // Закрытие модалтных окон



    },


    // Модалки
    initModal: function initModal() {
        if ($(document).find(this.modal).length > 0) {
            $(document).find(this.modal).iziModal();
        }
    }, 

    // Открытие модальых окон
    eventModalOpen: function eventModalOpen(e) {
        e.preventDefault();
        var $this = $(e.target).closest('[data-modal-open]'),
            id = $this.attr('data-modal-open'),
            modal = $('[data-modal="' + id + '"]');

        modal.iziModal('open');
    },

    // Закрытие модальных окон
    eventModalClose: function eventModalClose(e) {
        e.preventDefault();
        var $this = $(e.target).closest('[data-modal]'),
            id = $this.attr('data-modal'),
            modal = $('[data-modal="' + id + '"]');

        modal.iziModal('close');
    },

    // Меню в шапке сайта
    eventMenu: function eventMenu(e) {
        // e.preventDefault();
        var $this = $(e.target).closest('.header');
        $this.find('.header__nav').toggleClass('active');
        $this.find('.header__menu').toggleClass('active');
    },

    // Слайдер Документы
    initSliderDocument: function initSliderDocument() {
        var $this =  this.sliderDocument;
        if ($(document).find($this).length > 0) {

            $(document).find($this).each(function () {
                $(this).slick({
                    dots: false,
                    infinite: false,
                    speed: 300,
                    nextArrow: $(this).closest('.slider-wrap').find('.arrow__next'),
                    prevArrow: $(this).closest('.slider-wrap').find('.arrow__prev'),
                    slidesToShow:4,
                    responsive: [ {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        }
                    }, {
                        breakpoint: 900,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                        }
                    }, {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }]
                });
            });
        }
    },

    // Слайдер портфолио
    initSliderPortfolio: function initSliderPortfolio() {
        var $this =  this.sliderPortfolio;
        if ($(document).find($this).length > 0) {

            $(document).find($this).each(function () {
                $(this).slick({
                    dots: true,
                    infinite: false,
                    speed: 300,
                    nextArrow: $(this).closest('.portfolio-slider').find('.arrow__next'),
                    prevArrow: $(this).closest('.portfolio-slider').find('.arrow__prev'),
                    slidesToShow:1,
                });
            });
        }
    },
    // Слайдер партнёры
    initSliderPartner: function initSliderPartner() {
        var $this =  this.sliderPartner;
        if ($(document).find($this).length > 0) {

            $(document).find($this).each(function () {
                $(this).slick({
                    infinite: false,
                    speed: 400,
                    nextArrow: $(this).closest('.slider-wrap').find('.arrow__next'),
                    prevArrow: $(this).closest('.slider-wrap').find('.arrow__prev'),
                    slidesToShow:5,
                    responsive: [ {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1,
                        }
                    }, {
                        breakpoint: 900,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        }
                    }, {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                        }
                    }]
                });
            });
        }
    },

    // Слайдер наши работы
    initSliderWorks: function initSliderWorks() {
        var $this =  this.sliderWorks;
        if ($(document).find($this).length > 0) {

            $(document).find($this).each(function () {
                $(this).slick({
                    dots: false,
                    infinite: true,
                    speed: 300,
                    nextArrow: $(document).find('.slider-document__arrow_portfol').find('.arrow__next'),
                    prevArrow: $(document).find('.slider-document__arrow_portfol').find('.arrow__prev'),
                    slidesToShow:1,
                    swipe: false,
                    adaptiveHeight: true

                });
            });
        }
    },
};

var project = null;
$(document).ready(function () {

    project = new Project();


    $(document).find('.messagers-block').on('click', function(e){
        $(document).find('.messagers-block').toggleClass('active')
    });


   
    $(".faq__wrap").accordionjs();




    $(document).find('.main-btn').on('click', function(e) {
        $(document).find('.widget-banner').toggleClass('fade');
    });



    // Калькулятор с главной страницы
    $(document).find('.estimate__btn').on('click', function(e){
       var paramOne = $(document).find('#asphalting_type').val();
       var paramTwo = $(document).find('#asphalting_variant').val();
       var paramThree = $(document).find('#calc-square').val();

       
        $(document).find('.form-pdf').find('.text-input__value').val(paramOne + ' ' + paramTwo + ' ' + paramThree);

    });
    // Переключение табов
    $('.js-tab-trigger').click(function() {
        var id = $(this).attr('data-tab'),
            content = $('.js-tab-content[data-tab="'+ id +'"]');
        
        $('.js-tab-trigger.active').removeClass('active'); // 1
        $(this).addClass('active'); // 2
        
        $('.js-tab-content.active').removeClass('active'); // 3
        content.addClass('active'); // 4
    });
    $(document).find('.estimate__btn').on('click', function(e){
        if($(document).find('#calc-square').val() <= 0) {
            console.log('нельзя')
        } else{
            $(document).find('.tab-header__item_pointer').removeClass('tab-header__item_pointer');
            $(document).find('.js-tab-trigger[data-tab="2"]').click();
        }
        
    })




    //  Защита от спама для форм
    $('body').on('input', '[name="name"]', function(){
        this.value = this.value.replace(/[^а-яё\s]/gi, '');
        this.value = this.value.substr(0, 15);
    });
    $('body').on('input', '#whatsapp-link__fade', function(){
        this.value = this.value.replace(/[^0-9]/g, '');
        this.value = this.value.substr(0, 10);
    });
    $('body').on('input', '#telegram-link__fade', function(){
        this.value = this.value.replace(/[^a-z\s]/gi, '');
        this.value = this.value.substr(0, 15);
    });
    $('body').on('input', '[name="text"]', function(){
        this.value = this.value.replace(/[^а-яё\s]/gi, '');
        this.value = this.value.substr(0, 15);
    });

    $.mask.definitions['9'] = false;
    $.mask.definitions['5'] = "[0-9]";
    $("[name='phone']").mask("+7 (955) 555-5555");

    $("[name='phone']").click(function(){
        $(this).setCursorPosition(5);
    }).mask("+7 (955) 555-5555");
    $.fn.setCursorPosition = function(pos) {
        if ($(this).get(0).setSelectionRange) {
          $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
          var range = $(this).get(0).createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
        }
      };
});


// Анимацияя шестерёнок
var $animation_elements = $('.steps-section');
var $window = $(window);

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);
 
  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);
 
    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
        (element_top_position <= window_bottom_position)) {
      $element.addClass('is-visible');
    } else {
      $element.removeClass('is-visible');
    }
  });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');