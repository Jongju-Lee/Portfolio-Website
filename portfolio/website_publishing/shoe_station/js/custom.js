$(function () {
  /* ##### Header - Trigger(Mobile) ##### */
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    $(".gnb").toggleClass("active");
  });
  /* ##### GNB - Mega Menu ##### */
  $(".gnb_title").hover(function () {
    $(".gnb_content").removeClass("active");
    $(this).next().addClass("active");
  });
  $(".gnb_content").mouseleave(function () {
    $(this).removeClass("active");
    $(".sneakers").addClass("active");
  });
  $(".tab_menu li").mouseleave(function () {
    $(this).removeClass("active");
  });
  $(".tab_menu li").click(function () {
    $(".tab_menu li").removeClass("active");
    $(this).addClass("active");
  });
  $(".btn_close").click(function () {
    $(".gnb_content").removeClass("active");
  });
  $(".tab_content .title").click(function () {
    $(this).parent().toggleClass("active");
    $(this).parent().siblings().removeClass("active");
    $(this).toggleClass("active");
  });
  /* ########## Slick.js ########## */
  /* ##### Section - Intro(Banner Slider) ##### */
  $(".intro_slider").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  });
  /* ##### Section - Best Seller, New ##### */
  $(".product_slider").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    infinite: false,
    dots: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  });
  /* ##### Section - Best Brand(Sub Slider) ##### */
  $(".best_brand_sub_slider").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    infinite: true,
    dots: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  });
  /* ##### Section - Magazine ##### */
  $(".magazine_slider").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  });
});
