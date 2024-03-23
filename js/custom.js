$(function () {
  /* ##### Fullscreen Modal Trigger Button ##### */
  $(window).scroll(function () {
    // 스크롤이 내려오면
    if (window.scrollY >= 50) {
      // trigger 버튼을 생성
      $(".trigger, .btn_top").addClass("scroll");
    } else {
      // 스크롤이 최상단일때
      $(".btn_top").removeClass("scroll");
      if ($(".trigger").hasClass("active")) {
        // 만약 버튼에 active클래스가 있는데(모달이 켜져있는데) 스크롤이 최상단이면
        // 버튼숨김 취소
        return;
      }
      // 버튼숨김
      $(".trigger").removeClass("scroll");
    }
  });
  /* ##### Fullscreen Navigation ##### */
  $(".fullscreen_navi_inner a").click(function () {
    // Fullscreen Navigation 숨김
    $(".fullscreen_navi").stop().fadeOut();
    $(".trigger").removeClass("active");
  });
  /* ##### Trigger Button ##### */
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    $(".fullscreen_navi").stop().fadeToggle();
    // 스크롤이 최상단 이면서 active 클래스가 없으면
    if (window.scrollY <= 50 && !$(this).hasClass("active")) {
      // 버튼을 숨김
      $(this).removeClass("scroll");
    }
  });
  /* ##### Slick. JS ##### */
  $(".practical_slider").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });
});
