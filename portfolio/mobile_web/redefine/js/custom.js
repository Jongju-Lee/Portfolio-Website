$(function () {
  /* Entire - Header Back Button */
  $(".btn_back").click(function () {
    // 헤더 뒤로가기 버튼 클릭시 뒤로가기
    window.history.back();
  });
  /* ##### GNB Include ##### */
  $("footer").load("../include/gnb.html");
  /* ##### Register - Terms CheckBox ##### */
  $("input[id=agree_all]").click(function () {
    // 전체선택 체크박스 체크시
    if ($("input[id=agree_all]").prop("checked")) {
      // 전체 체크
      $("input[name=agree]").prop("checked", true);
    } else {
      // 전체 체크 해제
      $("input[name=agree]").prop("checked", false);
    }
  });
  /* ##### Cart - Check Function ##### */
  $(".cart .check_all").click(function () {
    // 장바구니에서 전체선택 클릭 했을때
    $(this).toggleClass("active");
    $(".cart .cart_item").toggleClass("active");
  });
  $(".cart .btn_all_clear").click(function () {
    // 장바구니에서 선택삭제 버튼 클릭했을때
    $(".cart .cart_item.active").remove();
    $(".cart .check_all").removeClass("active");
    const itemLength = $(".cart_item").length;
    if (itemLength === 0) {
      // 결제금액란 없어짐
      $(".calculate_outer").remove();
      $(".empty_message").show();
    }
  });
  $(".cart .cart_item_thum").click(function () {
    // 카트아이템을 클릭했을때 체크
    $(this).parent().toggleClass("active");
  });
  $(".cart .btn_close_cart_item").click(function () {
    $(this).parent().remove();
    const itemLength = $(".cart_item").length;
    if (itemLength === 0) {
      // 카트아이템의 갯수가 0개가 되면 전체선택 체크 해제
      $(".cart .check_all").removeClass("active");
      // 결제금액란 없어짐
      $(".calculate_outer").remove();
      $(".empty_message").show();
    }
  });
  /* ##### Details - Wish Check Function ##### */
  $(".details .heart").click(function () {
    $(this).toggleClass("active");
  });
  /* ##### Details - Modal ##### */
  $(".btn_add_cart").click(function () {
    $(".details_modal_overlay").addClass("active");
    $(".details_modal").addClass("active");
  });
  $(".details_modal_overlay, .btn_continue").click(function () {
    $(".details_modal_overlay").removeClass("active");
    $(".details_modal").removeClass("active");
  });
  /* ##### Main - Tab Menu ##### */
  $(".tab_menu li a").click(function () {
    $(".tab_menu li a").removeClass("active");
    $(this).addClass("active");
  });
  /* ########## Slick.js ########## */
  $(".product_slider").slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 2,
  });
  $(".banner_slider").slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
  });
});
