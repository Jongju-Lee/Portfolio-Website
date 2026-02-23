$(function () {
  $(".hover-nav__item").mouseenter(function () {
    const imagePath = $(this).attr("data-images");
    $(".hover-nav__bg").css({
      "background-image": "url(" + imagePath + ")",
    });
  });
  $(".hover-nav__item").mouseleave(function () {
    $(".hover-nav__bg").css({
      "background-image": "url(./images/initial.jpg)",
    });
  });
});
