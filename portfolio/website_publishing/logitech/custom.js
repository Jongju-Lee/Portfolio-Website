$(function () {
  $(".gnb > li").mouseenter(function () {
    $(".mega_box").stop().fadeOut();
    $(this).children(".mega_box").stop().fadeIn();
  });
  $("nav").mouseleave(function () {
    $(".mega_box").stop().fadeOut();
  });
  $(".btn_close").click(function () {
    $(this).parent().parent().stop().fadeOut();
  });
  /* ##### Slick.js - Main Product Slider ##### */
  $(".product_slider").slick({
    dots: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
  /* ##### Slick.js - Environment ##### */
  $(".envi_slider").slick({
    dots: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
});
