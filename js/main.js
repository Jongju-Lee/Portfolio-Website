$(function () {
  /* 스크롤 위치에 따른 모달 버튼 생성 */
  $(window).scroll(function () {
    // 스크롤이 내려오면 버튼 생성
    if (window.scrollY >= 500) {
      $("header").addClass("hide");
      $(".trigger, .top-btn").addClass("on");
    } else {
      // 스크롤이 최상단일때 버튼 숨김
      $("header").removeClass("hide")
      $(".top-btn").removeClass("on");
      if ($(".trigger").hasClass("active")) {
        return;
      }
      $(".trigger").removeClass("on");
    }
  });
  
  /* trigger - 풀스크린 네비게이션 버튼 */
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    $(".fullscreen-nav").stop().fadeToggle();
    // 스크롤이 최상단 이면서 active 클래스가 없으면
    if (window.scrollY <= 50 && !$(this).hasClass("active")) {
      // 버튼을 숨김
      $(this).removeClass("on");
    }
  });

  /* ---------- 풀스크린 네비게이션 ---------- */
  $(".fullscreen-nav__item").click(function () {
    $(".fullscreen-nav").stop().fadeOut();
    $(".trigger").removeClass("active");
  });

  /* top-btn - 위로 이동하기 버튼 */
  $(".top-btn").click(function () {
    $(".trigger").removeClass("active");
    $(".fullscreen-nav").stop().fadeOut();
  });

  /* Lightbox 링크 클릭시 trigger, top-btn 숨김 */
  $(".practical-slider__item").click(function () {
    $(".trigger, .top-btn").removeClass("on");
  });

  /* ---------- Slick Slider ---------- */
  // Practical Coding
  $(".practical-slider__box").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
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
});

/* ---------- Featherlight 커스텀 클래스 ---------- */
$(document).ready(function() {
  // 클릭된 링크 저장용 변수
  let lastClickedLink = null;

  // 클릭 이벤트 - 링크 정보 저장
  $(document).on('click', 'a[data-featherlight]', function() {
    lastClickedLink = this;
  });

  // DOM 변화 감시 - 모달 생성 시 클래스 적용
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE && $(node).hasClass('featherlight')) {
          // 모달 로딩 완료 대기 후 클래스 적용
          setTimeout(function() {
            const $content = $(node).find('.featherlight-content');

            if (lastClickedLink && $content.length) {
              const customClass = $(lastClickedLink).data('custom');
              if (customClass) {
                $content.addClass(customClass);
              }
            }
          }, 500);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});