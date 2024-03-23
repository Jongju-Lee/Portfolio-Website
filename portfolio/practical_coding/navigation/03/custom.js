$(function () {
  /* ##### Button - Search ##### */
  $(".btn_search").click(function () {
    $(".search_field").stop().fadeToggle();
  });
  $(".search_field img").click(function () {
    $(".search_field").stop().fadeOut();
  });
  /* ##### Button - Dark ##### */
  $(".btn_dark").click(function () {
    $("header, section").toggleClass("active");
  });
});
