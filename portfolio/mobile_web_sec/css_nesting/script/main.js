$(document).ready(function () {
  // ########## GNB 컴포넌트 ##########
  $('.include_gnb').load('../include/gnb.html');

  // ########## 공통 버튼 이벤트 ##########
  // 뒤로가기 버튼
  $('.top_bar .btn_back').on('click', function () {
    history.go(-1);
  });
  $('.btn_alarm').on('click', function () {
    location.href = "./my_page.html"
  });

  // ########## Home.html ##########
  // 회사 정보 버튼 이벤트
  $('.home .company_info button').on('click', function () {
    $(this).toggleClass('on');
    $(this).siblings().slideToggle();
    $('html, body').animate({scrollTop:document.body.scrollHeight}, '500');
  });
  $('.home .slider_cont .desc .btn_secondary').on('click', function () {
    location.href = "./cart.html"
  });

  // ########## Detail.html ##########
  // 탭 메뉴 이벤트
  $('.detail .tab_btn_box label').on('click', function () {
    $(this).addClass('on');
    $(this).siblings().removeClass('on');
  });
  // 하트 아이콘 이벤트
  $('.detail .heart_icon, .detail .icon.wish span').on('click', function () {
    $(this).toggleClass('on');
  });
  // 위로 이동 버튼 이벤트
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 200) {
      $('.btn_top').addClass('on');
    } else if ($(window).scrollTop() <= 200) {
      $('.btn_top').removeClass('on');
    };
  });
  
  // ########## Cart.html ##########
  // 수량 버튼 이벤트
  $('.cart .count_box .btn_minus, .cart .count_box .btn_plus').on('click', function () {
    const $currentNum = $(this).siblings('.current_num');
    const currentNum = parseInt($currentNum.text());
    
    if ($(this).hasClass('btn_minus')) {
      if (currentNum > 1) {
        $currentNum.text(currentNum - 1);
      }
    } else if ($(this).hasClass('btn_plus')) {
      $currentNum.text(currentNum + 1);
    }
  });
  // 전체 동의하기 버튼 이벤트
  $('.cart input[name="check_all"]').on('click', function () {
    if ($(this).is(':checked') === true) {
      $('input[name="chk_cart"]').prop('checked', true)
    } else if ($(this).is(':checked') === false) {
      $('input[name="chk_cart"]').prop('checked', false)
    };
  });

  // ########## Register.html ##########
  // 전체 동의하기 버튼 이벤트
  $('.register input[name="agree_all"]').on('click', function () {
    if ($(this).is(':checked') === true) {
      $('input[name="agree"]').prop('checked', true)
    } else if ($(this).is(':checked') === false) {
      $('input[name="agree"]').prop('checked', false)
    };
  });
  // 회원가입 버튼
  $('.register .btn_register').on('click', function () {
    location.href = './login.html';
  });

  // ########## MyFresh.html ##########
  $('.my_fresh .thum').on('click', function () {
    location.href = './my_page.html';
  });

  // ########## MyPage.html ##########
  $('.my_page .btn_edit_info').on('click', function () {
    location.href = './edit_user_info.html';
  });

  $('.my_page .btn_edit_address').on('click', function () {
    location.href = './address_manage.html';
  });

  // ########## Search.html ##########
  $('.search .list_box .item').on('click', function () {
    let word = $(this).text();
    console.log(word);
    $('.search .search_box input').val(word);
  });

  // ########## Slick Slider ##########
  // Slick slider - INTRO
  $('.intro_slider_items').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  });

  // Overlay Close
  $('.intro_toast .btn_box label, .intro_toast .btn_box button').click(function () {
    $('.intro_toast_overlay').fadeOut(300);
  });

  // Slick slider - HOME
  const bannerLength = $('.main_banner_box .img_box').length;
  
  $('.total_count').text(bannerLength);
  $('.home .main_banner_box').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  });
  $('.home .main_banner_box').on('afterChange', function (event, slick, currentSlide) {
    $('.current_count').text(slick.currentSlide + 1);
  });

  $('.home .slider_cont').slick({
    slidesToShow: 3,
    slidesToScroll: 2,
    dots: false,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: false,
  });
});