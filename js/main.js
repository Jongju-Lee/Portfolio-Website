$(function () {
  /* ---------- 네비게이션 모달 버튼 ---------- */
  $(window).scroll(function () {
    // 스크롤이 내려오면 버튼 생성
    if (window.scrollY >= 50) {
      $(".trigger, .btn_top").addClass("on");
    } else {
      // 스크롤이 최상단일때 버튼 숨김
      $(".btn_top").removeClass("on");
      if ($(".trigger").hasClass("active")) {
        return;
      }
      $(".trigger").removeClass("on");
    }
  });
  /* ---------- 네비게이션 모달 ---------- */
  $(".fullscreen_navi_inner a").click(function () {
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
  /* ##### Top Button ##### */
  $(".btn_top").click(function () {
    $(".trigger").removeClass("active");
    $(".fullscreen_navi").stop().fadeOut();
  });
  /* ##### Practical Coding - Light Box ##### */
  $(".practical_slider a img").click(function () {
    // 슬라이더 아이템 클릭(LightBox 열림)
    $(".trigger, .btn_top").removeClass("scroll");
    // Trigger, Top 버튼 숨김
  });
  /* ##### Company Project - Light Box ##### */
  $(".project_slider a img").click(function () {
    // 슬라이더 아이템 클릭(LightBox 열림)
    $(".trigger, .btn_top").removeClass("scroll");
    // Trigger, Top 버튼 숨김
  });
  /* ##### Slick. JS ##### */
  // Practical Coding
  $(".practical_slider").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
  // Project
  $(".project_slider").slick({
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: false,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 2000,
          speed: 300,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});
