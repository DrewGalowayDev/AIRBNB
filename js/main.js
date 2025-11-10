(function ($) {
    "use strict";
    
    // Initiate the wowjs animation library
    new WOW().init();
    
    // Initiate menu
    $('#header').after('<div class="mobile-menu d-xl-none">');
    $('.top-menu').clone().appendTo('.mobile-menu');
    $('.mobile-menu-btn').click(function () {
        $('.mobile-menu').stop().slideToggle();
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    //Portfolio modal slider
    $('.port-slider').delay(10000);
    $('.port-slider').slick({
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.port-slider-nav'
    });
    $('.port-slider-nav').slick({
        autoplay: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.port-slider',
        arrows: false,
        dots: false,
        centerMode: true,
        focusOnSelect: true
    });
    
    $('#popover-content-download').hide();
    $("[data-toggle=popover]").each(function (e) {
        $(this).popover({
            html: true,
            content: function () {
                var id = $(this).attr('id')
                return $('#popover-content-' + id).html();
            }
        });

    });
    
    // Date and time picker - only for non-booking forms
    // Booking form dates are handled by booking-handler.js using HTML5 date inputs
    // to prevent refresh issues and provide better mobile support
    if ($('#date-1').length && !$('#bookingForm').length) {
        $('#date-1, #date-2').datetimepicker({
            format: 'L'
        });
    }
    
    // Time pickers (if they exist)
    if ($('#time-1').length) {
        $('#time-1, #time-2').datetimepicker({
            format: 'LT'
        });
    }
    
    // Search section date pickers on index page (if not handled by booking-handler)
    if ($('#date-5, #date-6').length) {
        $('#date-5, #date-6').datetimepicker({
            format: 'L'
        });
    }
})(jQuery);

