// 유틸 버튼 관리 함수들
const UtilButtons = {
  // 네비게이션 토글 공통 로직
  toggleNavigation: function(selector, bodyClass) {
    $(selector).stop().fadeToggle();
    $("body").toggleClass(bodyClass);
  },

  // 버튼 상태 초기화
  resetButtons: function() {
    $(".trigger").removeClass("active trigger--on");
    $(".fullscreen-nav").stop().fadeOut();
    $(".sidebar-nav").stop().fadeOut();
    $(".sidebar-btn").removeClass("sidebar-btn--active sidebar-btn--on");
    $(".sidebar-nav-inner").removeClass("sidebar-nav-inner--active");
    $("body").removeClass("sidebar--on fullscreen-nav--on");
  }
};

$(function () {
  // 페이지 진입 즉시 전체화면 로딩 표시
  if (window.loadingManager) {
    window.loadingManager.show({
      text: '페이지 로딩 중...',
      variant: 'light',
      timeout: 0
    });
    $(window).on('load', () => window.loadingManager.hide());
  }

  /* ############### 유틸 버튼 이벤트 ############### */
  // 스크롤에 따른 버튼 표시/숨김
  $(window).scroll(function () {
    const scrolled = window.scrollY >= 500;
    $("header").toggleClass("hide", scrolled);
    $(".trigger").toggleClass("trigger--on", scrolled);
    $(".top-btn").toggleClass("top-btn--on", scrolled);
    $(".sidebar-btn").toggleClass("sidebar-btn--on", scrolled);
  });

  // 상단 이동 버튼
  $(".top-btn").click(UtilButtons.resetButtons);

  // 라이트박스 링크 클릭시 버튼 숨김
  $(".practical-slider__item").click(function () {
    $(".trigger").removeClass("trigger--on");
    $(".top-btn").removeClass("top-btn--on");
    $(".sidebar-btn").addClass("sidebar-btn--hide");
  });

  // 풀스크린 네비게이션 토글
  $(".trigger").click(function () {
    $(this).toggleClass("active");
    UtilButtons.toggleNavigation(".fullscreen-nav", "fullscreen-nav--on");

    // 최상단에서 비활성 시 숨김
    if (window.scrollY <= 50 && !$(this).hasClass("active")) {
      $(this).removeClass("trigger--on");
    }
  });

  // 풀스크린 네비게이션 링크
  $(".fullscreen-nav__item").click(function (e) {
    e.stopPropagation();
    UtilButtons.resetButtons();
  });

  // 사이드바 토글
  $(".sidebar-btn").click(function () {
    const isActive = $(this).toggleClass("sidebar-btn--active").hasClass("sidebar-btn--active");
    UtilButtons.toggleNavigation(".sidebar-nav", "sidebar--on");
    $(".sidebar-nav-inner").toggleClass("sidebar-nav-inner--active", isActive);

    if (isActive) {
      $(this).removeClass("sidebar-btn--on");
    }
  });

  // 사이드바 링크
  $(".sidebar-nav__item").click(function (e) {
    e.stopPropagation();
    UtilButtons.resetButtons();
  });

  // 목업 박스 토글
  $(".mockup-box__open-btn").click(function () {
    $(".mockup-box").toggleClass("mockup-box--on");
    $(this).addClass("mockup-box__open-btn--disabled");
    setTimeout(() => $(this).removeClass("mockup-box__open-btn--disabled"), 600);
  });

  $(".mockup-box__action-btn").click(function () {
    $(".mockup-box").removeClass("mockup-box--on");
  });

  /* ############### 접근성 알림 토스트 ############### */
  // 접근성 모달 표시 여부 초기 검사
  let hideUntil = null;
  try {
    hideUntil = localStorage.getItem('accessibilityModalHideUntil');
  } catch (e) {
    console.error('로컬스토리지 읽기 오류', e);
  }
  if (hideUntil && new Date(hideUntil) > new Date()) {
    // $('.accessibility-modal').hide();
    $('.accessibility-modal').hide();
  }
  // 확인 버튼 클릭 시 모달 닫기
  $('.accessibility-modal__btn.ok-btn').click(function () {
    $('.accessibility-modal').addClass("accessibility-modal--close");
  });
  // 오늘 다시 보지 않기 버튼 클릭 시 자정까지 숨김 처리
  $('.accessibility-modal__btn.dismiss-btn').click(function () {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    try {
      localStorage.setItem('accessibilityModalHideUntil', tomorrow.toISOString());
    } catch (e) {
      console.error('로컬스토리지 쓰기 에러', e);
    }
    $('.accessibility-modal').addClass("accessibility-modal--close");
  });

  // 접근성 토스트 애니메이션 종료 후 포커스 이동
  const $accessibilityModal = $('.accessibility-modal');
  $accessibilityModal.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
    if (e.originalEvent.animationName === 'reveal-toast') {
      $(this).focus(); // 모달 포커스 이동
    }
  });

  // 헤더 접근성 버튼 클릭 시 모달 표시 및 포커스 이동
  $('.header-accessibility-btn').click(function() {
    $accessibilityModal
      .removeClass('accessibility-modal--close') // 닫힘 클래스 제거
      .show() // 모달 보이기
      .focus(); // 포커스 이동
  });

  /* ############### 모바일 목업 스크롤바 제거 ############### */
  if (window.location.search.includes('mobileMockup=true')) {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { display: none; }
      html { scrollbar-width: none; -ms-overflow-style: none; }
      body { -webkit-overflow-scrolling: touch; }
    `;
    document.head.appendChild(style);
  }

  /* ############### Slick Slider 관련 함수 ############### */
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
        breakpoint: 560,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  });

  /* ############### Web section 탭 키 접근성 개선 ############### */
  // 웹 탭 버튼: 키보드 접근성 + 클릭 시 패널 포커스 이동
  $(".web-tab__btn").on({
    keydown: function(e) {
      // Enter 또는 Space 누르면 클릭 트리거
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        $(this).click();
      }
    },
    click: function() {
      // 클릭된 버튼과 같은 인덱스의 패널로 포커스 이동 (지연 처리)
      const idx = $(".web-tab__btn").index(this);
      setTimeout(() => {
        $(".web-tab__item").eq(idx).focus();
      }, 50);
    }
  });
  
  /* ############### Featherlight 커스텀 클래스 ############### */
  let lastClickedLink = null;

  $(document).on('click', 'a[data-featherlight]', function() {
    lastClickedLink = this;
  });

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE && $(node).hasClass('featherlight')) {
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

  // 라이트박스 닫힐 때 sidebar-btn 숨김 해제
  $(document).on('hidden.uk.lightbox', function() {
    $('.sidebar-btn').removeClass('sidebar-btn--hide');
    $(".trigger").addClass("trigger--on");
    $(".top-btn").addClass("top-btn--on");
  });
});