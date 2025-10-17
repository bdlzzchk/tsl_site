setTimeout(function() {
    $(document).ready(function(){
        var observer = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting) {
                $('.widget-banner').removeClass('active');
            } else {
              $('.widget-banner').addClass('active');
            }
          });
        }, {threshold: 0.1});
        $('.calc').each(function(){
          observer.observe(this);
        });
    });
}, 10000)
$(function() {

    // Открытие опросника
    $(document).find('.widget-banner').on('click', function(e){
        e.preventDefault;
        $('.widget').toggleClass('active');
        $('.widget-banner').toggleClass('active');

    });

    // Закрытие опросника
    $(document).find('.widget__close').on('click', function(e){
        e.preventDefault;
        $('.widget').toggleClass('active');
        $('.widget-banner').toggleClass('active');

    });
    

    $(document).find('.widget__item').on('click', function(e){
        var $this = $(this).closest('.widget__item');
        var $list = $this.closest('.widget__wrap');
        
        // Активировать чекбокс
        $list.find('.widget__item.active').removeClass('active');
        $this.addClass('active');

        if($list.hasClass('widget-end')){
            
        }  else {
            // После выбора скрыть
            $list.removeClass('active');
            $list.next('.widget__wrap').addClass('active');
        }
        
      
    });

    // Кнопка далее
    $(document).find('.widget-btn__next').on('click', function(e){

        var $this = $(this).closest('.widget__content');
        var select = $this.find('.widget__wrap.active');
        var next = select.next('.widget__wrap');
        if( select.hasClass('widget-end')){
 
        } else {
            select.removeClass('active');
            next.addClass('active');
        }
       
 
        
    });
    // Кнопка назад
    $(document).find('.widget-btn__prev').on('click', function(e){

        var $this = $(this).closest('.widget__content');
        var select = $this.find('.widget__wrap.active');
        var prev = select.prev('.widget__wrap');

        if( select.hasClass('widget-start')){
  
        } else {
            select.removeClass('active');
            prev.addClass('active');
        }
    });


    // Брать значение из input (площадь)
    $(document).find('#widget-input__text').on('change', function(e){
        var dataInput = $(document).find('#widget-input__text').val();
        $(document).find('.fade-info__two').html(dataInput);
    });

    $(document).find('.widget__item_one').on('click', function(e){
        var message = $(this).find('.widget-service__text').text();
        console.log(message);
        $(document).find('.fade-info__one').text(message);
        $(document).find('.text-input__value').val( 'Вид работ:' + $(document).find('.fade-info__one').text() + ' ' + 'Укажите площадь(м2):' + $(document).find('.fade-info__two').text() + ' ' + 'У вас уже есть рассчитанная смета или проект:' +  $(document).find('.fade-info__three').text());
        
    });
    $(document).find('.widget__item_two').on('click', function(e){
        var message2 = $(this).find('.widget-service__text').text();
        $(document).find('.fade-info__two').text(message2);
        $(document).find('.text-input__value').val( 'Вид работ:' + $(document).find('.fade-info__one').text() + ' ' + 'Укажите площадь:' + $(document).find('.fade-info__two').text() + ' ' + 'У вас уже есть рассчитанная смета или проект:' +  $(document).find('.fade-info__three').text());
    });
    $(document).find('.widget__item_three').on('click', function(e){
        var message3 = $(this).find('.widget-service__text').text();
        $(document).find('.fade-info__three').text(message3);
        $(document).find('.text-input__value').val( 'Вид работ:' + $(document).find('.fade-info__one').text() + ' ' + 'Укажите площадь:' + $(document).find('.fade-info__two').text() + ' ' + 'У вас уже есть рассчитанная смета или проект:' +  $(document).find('.fade-info__three').text());
    });




    // Блокировка фона
    $(document).find('.widget-banner').on('click', function(e){
        $('.bg-fade').toggleClass('active');
        $('body').addClass('active');
    })
    $(document).find('.widget__close').on('click', function(e){
        $('.bg-fade').removeClass('active');
        $('body').removeClass('active');
    })




});




