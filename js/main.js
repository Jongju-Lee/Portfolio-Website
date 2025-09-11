$(function () {
  /* 스크롤 위치에 따른 모달 버튼 생성 */
  $(window).scroll(function () {
    // 스크롤이 내려오면 버튼 생성
    if (window.scrollY >= 50) {
      $(".trigger, .btn_top").addClass("on");
    } else {
      // 스크롤이 최상단일때 버튼 숨김
      $(".btn_top").removeClass("on");
      if ($(".trigger").hasClass("active")) {
        return;
      }
      $(".trigger").removeClass("on");
    }
  });
  
  /* trigger - 풀스크린 네비게이션 버튼 */
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    $(".fullscreen_navi").stop().fadeToggle();
    // 스크롤이 최상단 이면서 active 클래스가 없으면
    if (window.scrollY <= 50 && !$(this).hasClass("active")) {
      // 버튼을 숨김
      $(this).removeClass("on");
    }
  });

  /* ---------- 풀스크린 네비게이션 ---------- */
  $(".fullscreen_navi_inner a").click(function () {
    $(".fullscreen_navi").stop().fadeOut();
    $(".trigger").removeClass("active");
  });

  /* btn_top - 위로 이동하기 버튼 */
  $(".btn_top").click(function () {
    $(".trigger").removeClass("active");
    $(".fullscreen_navi").stop().fadeOut();
  });

  /* Lightbox 링크 클릭시 trigger, btn_top 숨김 */
  $(".lightbox_slider a").click(function () {
    $(".trigger, .btn_top").removeClass("on");
  });

  /* ---------- Slick Slider ---------- */
  // Practical Coding
  $(".practical_slider").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
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