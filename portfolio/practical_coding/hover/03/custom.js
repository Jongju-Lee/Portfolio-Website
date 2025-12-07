$(function () {
  $(".gnb li").mouseenter(function () {
    const imagePath = $(this).attr("data-images");
    $(".photo").css({
      "background-image": "url(" + imagePath + ")",
    });
  });
  $(".gnb li").mouseleave(function () {
    $(".photo").css({
      "background-image": "url(./images/initial.jpg)",
    });
  });
});
