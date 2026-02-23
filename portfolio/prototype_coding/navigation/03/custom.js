$(function () {
  /* ##### Button - Search ##### */
  $(".dark-nav__btn--search").click(function () {
    $(this).css('animation', 'none'); // 클릭 시 애니메이션 제거
    $(".dark-nav__search-box").stop().fadeToggle();
    // 검색창이 열릴 때 인풋에 포커스
    if ($(".dark-nav__search-box").is(':visible')) {
      $("#search_input").focus();
    }
  });
  $(".dark-nav__search-icon").click(function () {
    $(".dark-nav__search-box").stop().fadeOut();
    // 0.5초 후 인풋 내용 삭제
    setTimeout(function () {
      $("#search_input").val("");
    }, 500);
  });
  /* ##### Search Input - Enter Key ##### */
  $("#search_input").on("keypress", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      $(".dark-nav__search-box").stop().fadeOut();
      // 0.5초 후 인풋 내용 삭제
      setTimeout(function () {
        $("#search_input").val("");
      }, 500);
    }
  });
  /* ##### Button - Dark ##### */
  $(".dark-nav__btn--dark").click(function () {
    $(this).css('animation', 'none'); // 클릭 시 애니메이션 제거
    $(".dark-header, .dark-section").toggleClass("active");
  });
});
