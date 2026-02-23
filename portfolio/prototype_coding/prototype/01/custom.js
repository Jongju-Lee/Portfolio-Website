$(function () {
  /* ##### Trigger ##### */
  $(".hero__trigger").click(function () {
    $(this).toggleClass("active");
    $(".hero__modal").stop().fadeToggle();
  });
  $(".hero__gnb-link, .hero").click(function () {
    $(".hero__trigger").removeClass("active");
    $(".hero__modal").stop().fadeOut();
  });
  /* ##### Audio Volume ##### */
  const $audio = document.querySelector("#my_audio");
  $audio.volume = 0.3; // Volume 0 ~ 1
});
