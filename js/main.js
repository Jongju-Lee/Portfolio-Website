/* ############### 유틸 버튼 관리 함수들 ############### */
const UtilButtons = {
  // 네비게이션 토글 공통 로직
  toggleNavigation: function (selector, bodyClass) {
    $(selector).stop().fadeToggle();
    $("body").toggleClass(bodyClass);
  },

  // 버튼 상태 초기화
  resetButtons: function () {
    $(".trigger").removeClass("active trigger--on");
    $(".fullscreen-nav").stop().fadeOut();
    $(".sidebar-nav").stop().fadeOut();
    $(".sidebar-btn").removeClass("sidebar-btn--active sidebar-btn--on");
    $(".sidebar-nav-inner").removeClass("sidebar-nav-inner--active");
    $("body").removeClass("sidebar--on fullscreen-nav--on");
  }
};

$(function () {
  /* ########## 페이지 진입시 로딩 화면 표시 ########## */
  if (window.loadingManager) {
    window.loadingManager.show({
      text: '페이지 로딩 중...',
      variant: 'light',
      timeout: 0
    });
    // 이미 로딩이 완료된 경우 즉시 숨김 (Race Condition 방지)
    if (document.readyState === 'complete') {
      window.loadingManager.hide();
    } else {
      // 아직 로딩 중이면 이벤트 리스너 등록
      $(window).on('load', () => window.loadingManager.hide());
    }
  }

  /* ########## ALT + N 단축키 사용시 GNB로 포커스 ########## */
  $(document).on('keydown', function (event) {
    // ALT + N 키 조합 감지 (키코드 78은 'N'에 해당)
    if (event.altKey && event.which === 78) {
      // 브라우저의 기본 동작 방지
      event.preventDefault();
      // GNB 요소
      const navElement = $('.header__gnb');
      // 네비게이션에 포커스 설정
      if (navElement.length) {
        $("header").removeClass("hide");
        navElement.focus();
        // 헤더 영역에서 포커스가 완전히 벗어날 때만 헤더 숨김 처리
        $(document).one('focusin', function (e) {
          // 포커스된 요소가 헤더 내부에 있는지 확인
          const isInHeader = $(e.target).closest('header').length > 0;
          // 헤더 외부로 포커스가 이동했을 때만 헤더 숨김
          if (!isInHeader && window.scrollY >= 500) {
            $("header").addClass("hide");
          }
        });
      }
    }
  });


  /* ############### 유틸 버튼 이벤트 ############### */
  // 스크롤에 따른 header 및 버튼 표시/숨김
  $(window).scroll(function () {
    const scrolled = window.scrollY >= 500;
    $("header").toggleClass("hide", scrolled);
    $(".trigger").toggleClass("trigger--on", scrolled);
    $(".top-btn").toggleClass("top-btn--on", scrolled);
    $(".sidebar-btn").toggleClass("sidebar-btn--on", scrolled);
  });

  // 상단 이동 버튼 클릭시
  $(".top-btn").click(UtilButtons.resetButtons);

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


  /* ############### 모바일 목업 스크롤바 제거 ############### */
  // 라이트박스 링크 클릭시 버튼 숨김
  $(".practical-slider__item").click(function () {
    $(".trigger").removeClass("trigger--on");
    $(".top-btn").removeClass("top-btn--on");
    $(".sidebar-btn").addClass("sidebar-btn--hide");
  });

  // 라이트박스 닫힐 때 sidebar-btn 숨김 해제
  $(document).on('hidden.uk.lightbox', function () {
    $('.sidebar-btn').removeClass('sidebar-btn--hide');
    $(".trigger").addClass("trigger--on");
    $(".top-btn").addClass("top-btn--on");
  });


  /* ############### 멀티 박스(목업 모음) 관련 ############### */
  const $mockupOpenBtn = $(".mockup-box__open-btn");

  // 로딩 완료 후 목업박스 버튼에 주목 애니메이션 적용 (타이밍은 CSS animation-delay로 제어)
  const startMockupAnimation = () => {
    $mockupOpenBtn.addClass("mockup-box__open-btn--initial-attention");
    setTimeout(() => $mockupOpenBtn.removeClass("mockup-box__open-btn--initial-attention"), 5000); // 4.5초 애니메이션 + 0.5초 delay
  };

  // 로딩이 완료된 후 애니메이션 시작
  if (window.loadingManager) {
    $(window).on('load', startMockupAnimation);
  } else {
    // loadingManager가 없으면 즉시 시작
    startMockupAnimation();
  }

  // 목업박스 열기/닫기 기능
  $mockupOpenBtn.click(function () {
    $(".mockup-box").toggleClass("mockup-box--on");
    $(this).addClass("mockup-box__open-btn--disabled");
    setTimeout(() => $(this).removeClass("mockup-box__open-btn--disabled"), 600);
  });

  $(".mockup-box__action-btn").click(function () {
    $(".mockup-box").removeClass("mockup-box--on");
  });

  // 모바일 목업 스크롤바 제거
  if (window.location.search.includes('mobileMockup=true')) {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { display: none; }
      html { scrollbar-width: none; -ms-overflow-style: none; }
      body { -webkit-overflow-scrolling: touch; }
    `;
    document.head.appendChild(style);
  }


  /* ############### Web section 키보드 TAB key 접근성 개선 ############### */
  // 웹 탭 버튼: 키보드 접근성 + 클릭 시 패널 포커스 이동
  $(".web-tab__btn").on({
    keydown: function (e) {
      // Enter 또는 Space 누르면 클릭 트리거
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        $(this).click();
      }
    },
    // 클릭된 버튼과 같은 인덱스의 패널로 포커스 이동 (지연 처리)
    click: function () {
      const idx = $(".web-tab__btn").index(this);
      setTimeout(() => {
        $(".web-tab__item").eq(idx).focus();
      }, 50);
    }
  });


  /* ############### Web section Arrow 버튼 로직 ############### */
  (function () {
    // 요소 캐시
    const $inner = $(".web-year__wrap-inner");
    const $items = $inner.find(".web-year__item");
    const $yearNumBox = $(".web-year__arrow-num-box");
    const $prevBtn = $(".web-year__arrow-btn--prev");
    const $nextBtn = $(".web-year__arrow-btn--next");

    // 현재 활성화 인덱스 반환
    const getActiveIndex = function () {
      return $items.index($items.filter(".web-year__item--active"));
    };

    // 활성화 인덱스 설정 (경계 체크 포함)
    const setActiveIndex = function (nextIndex) {
      if (nextIndex < 0 || nextIndex >= $items.length) return; // 범위 밖이면 무시
      $items.removeClass("web-year__item--active").eq(nextIndex).addClass("web-year__item--active");
    };

    // UI 상태 업데이트 (활성 인덱스, 연도 박스 모디파이어, 버튼 비활성화)
    const updateUI = function (nextIndex) {
      setActiveIndex(nextIndex);
      // 연도 박스 클래스 토글: --first <-> --second
      if ($yearNumBox.length) {
        $yearNumBox
          .removeClass("web-year__arrow-num-box--first web-year__arrow-num-box--second")
          .addClass(nextIndex === 0 ? "web-year__arrow-num-box--first" : "web-year__arrow-num-box--second");
      }
      // 버튼 비활성화 클래스 토글
      const isFirst = nextIndex === 0;
      const isLast = nextIndex === $items.length - 1;
      $prevBtn.toggleClass("web-year__arrow-btn--disabled", isFirst);
      $nextBtn.toggleClass("web-year__arrow-btn--disabled", isLast);
    };

    // 초기 상태 동기화
    updateUI(getActiveIndex());

    // 이전 버튼 클릭
    $prevBtn.on("click", function (e) {
      e.preventDefault();
      const current = getActiveIndex();
      if (current <= 0) return; // 이미 처음이면 무시
      updateUI(current - 1);
    });

    // 다음 버튼 클릭
    $nextBtn.on("click", function (e) {
      e.preventDefault();
      const current = getActiveIndex();
      if (current >= $items.length - 1) return; // 이미 끝이면 무시
      updateUI(current + 1);
    });
  })();


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

  /* ############### AOS.js ############### */
  AOS.init();

  /* ############### Featherlight 커스텀 클래스 ############### */
  let lastClickedLink = null;

  $(document).on('click', 'a[data-featherlight]', function () {
    lastClickedLink = this;
  });

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === Node.ELEMENT_NODE && $(node).hasClass('featherlight')) {
          setTimeout(function () {
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


  /* ############### SKILL 섹션 SKILL-ITEM 클릭 기능 ############### */
  const skillItems = document.querySelectorAll('.skill-item');

  skillItems.forEach(function (item) {
    item.addEventListener('click', function () {
      // 다른 아이템의 활성화 클래스 제거
      skillItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('skill-item--on');
        }
      });
      this.classList.toggle('skill-item--on');
    });
  });
});