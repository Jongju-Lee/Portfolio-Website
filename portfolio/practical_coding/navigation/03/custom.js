$(function () {
  /* ##### Button - Search ##### */
  $(".btn_search").click(function () {
    $(this).css('animation', 'none'); // 클릭 시 애니메이션 제거
    $(".search_field").stop().fadeToggle();
    // 검색창이 열릴 때 인풋에 포커스
    if ($(".search_field").is(':visible')) {
      $("#search_input").focus();
    }
  });
  $(".search_field img").click(function () {
    $(".search_field").stop().fadeOut();
    // 0.5초 후 인풋 내용 삭제
    setTimeout(function () {
      $("#search_input").val("");
    }, 500);
  });
  /* ##### Search Input - Enter Key ##### */
  $("#search_input").on("keypress", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      $(".search_field").stop().fadeOut();
      // 0.5초 후 인풋 내용 삭제
      setTimeout(function () {
        $("#search_input").val("");
      }, 500);
    }
  });
  /* ##### Button - Dark ##### */
  $(".btn_dark").click(function () {
    $(this).css('animation', 'none'); // 클릭 시 애니메이션 제거
    $("header, section").toggleClass("active");
  });
});
