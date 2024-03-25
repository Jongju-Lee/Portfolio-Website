$(function () {
  $(".sitemap").hide();
  /* ##### Header - Trigger ##### */
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    $(".sitemap").stop().fadeToggle();
    $("header").removeClass("active");
    $(".header_drop_down").stop().slideUp("fast");
  });
  // Section 클릭시 Sitemap 종료
  $("section").click(function () {
    $(".sitemap").stop().fadeOut();
    $(".trigger").removeClass("active");
  });
  /* ##### Header - GNB ##### */
  $(".gnb").mouseenter(function () {
    $(this).addClass("active");
    $(".header_drop_down").stop().slideDown("fast");
  });
  $(".gnb").mouseleave(function () {
    $(this).removeClass("active");
  });
  $("section").mouseenter(function () {
    $("header").removeClass("active");
    $(".header_drop_down").stop().slideUp("fast");
  });
  // GNB - Product
  $(".gnb_product").mouseenter(function () {
    $(this).parent().removeClass("smegazine product collection");
    $(this).parent().addClass("product");
    $("header").addClass("active");
    $(".header_drop_down").removeClass("active");
    $(".product_drop_down").addClass("active");
  });
  // GNB - Collection
  $(".gnb_collection").mouseenter(function () {
    $(this).parent().removeClass("smegazine product collection");
    $(this).parent().addClass("collection");
    $("header").addClass("active");
    $(".header_drop_down").removeClass("active");
    $(".collection_drop_down").addClass("active");
  });
  // GNB - SMEGazine
  $(".gnb_smegazine").mouseenter(function () {
    $(this).parent().removeClass("smegazine product collection");
    $(this).parent().addClass("smegazine");
    $("header").addClass("active");
    $(".header_drop_down").removeClass("active");
    $(".smegazine_drop_down").addClass("active");
  });
  /* ##### Window Scroll Event - btn_top ##### */
  $(window).scroll(function () {
    if (window.scrollY >= 50) {
      // 스크롤을 조금이라도 내렸을때
      $(".btn_top").addClass("active");
    } else if (window.scrollY <= 50) {
      // 스크롤을 아예 내리지 않았을때(최상단)
      $(".btn_top").removeClass("active");
    }
  });
  /* ##### Mobile Sitemap ##### */
  $("span.mobile_accordion_title").click(function () {
    $(this)
      .parent()
      .siblings()
      .children("span.mobile_accordion_title")
      .removeClass("active");
    $(this).toggleClass("active");
    $(".mobile_accordion_content").stop().slideUp();
    $(this).next().stop().slideToggle();
  });
  /* ##### Event Modal ##### */
  // Close Button
  $(".btn_close_event").click(function () {
    $(".event_modal, .overlay").fadeOut();
  });
  /* ##### WOW.js ##### */
  wow = new WOW({
    boxClass: "wow", // default
    animateClass: "animated", // default
    offset: 150,
    mobile: true, // default
    live: true, // default
    // offset 기본값은 0, 숫자가 높을수록 애니메이션 늦게 반응
  });
  wow.init();
});
