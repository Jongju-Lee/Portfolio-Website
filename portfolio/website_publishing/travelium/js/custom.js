$(function () {
  /* ##### Header Scroll Events ##### */
  $(window).scroll(function () {
    if (window.scrollY > 50) {
      // 스크롤 하면
      $("header").addClass("active");
    } else if (window.scrollY < 50) {
      $("header").removeClass("active");
    }
  });
  /* ##### Header - Trigger ##### */
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    $("ul.gnb").toggleClass("active");
    $(".overlay").stop().fadeToggle();
  });
  /* ##### Header - GNB(Mobile Sidebar) ##### */
  $("ul.gnb li a").click(function () {
    $(".trigger").removeClass("active");
    $("ul.gnb").removeClass("active");
    $(".overlay").stop().fadeOut();
  });
  /* ##### Slick.js ##### */
  $(".popular_slider").slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1366,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          autoplay: true,
          autoplaySpeed: 5000,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  $(".special_slider").slick({
    centerMode: true,
    centerPadding: "200px",
    arrows: true,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          centerMode: false,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
