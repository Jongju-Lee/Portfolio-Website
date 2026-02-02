/* ############### 유틸 버튼 관리 함수들 ############### */
const UtilButtons = {
  // 네비게이션 토글 공통 로직
  toggleNavigation: function (selector, bodyClass) {
    const el = document.querySelector(selector);
    if (el) el.classList.toggle('fade-in');
    document.documentElement.classList.toggle(bodyClass);
    document.body.classList.toggle(bodyClass);
  },

  // 버튼 상태 초기화
  resetButtons: function () {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
      sidebarNav.classList.remove('fade-in');
      sidebarNav.classList.add('fade-out');
    }

    const sidebarInner = document.querySelector('.sidebar-nav__inner');
    if (sidebarInner) sidebarInner.classList.remove('sidebar-nav__inner--active');

    document.documentElement.classList.remove('sidebar--on');
    document.body.classList.remove('sidebar--on');
  }
};


/* ############### UIKit Lightbox 버튼 커스터마이징 ############### */
UIkit.util.on(document, 'show', '.uk-lightbox', function (e) {
  const lightbox = e.target;

  // 기존 커스텀 버튼 제거 (중복 방지)
  const existingBtn = lightbox.querySelector('.custom-close-btn');
  if (existingBtn) existingBtn.remove();

  setTimeout(function () {
    // 기존 닫기 버튼 숨기기 (클릭 트리거용으로 보관)
    const originalBtn = lightbox.querySelector('.uk-lightbox-toolbar-icon.uk-close-large');
    if (originalBtn) {
      originalBtn.style.opacity = '0';
      originalBtn.style.pointerEvents = 'none';
    }

    // 커스텀 닫기 버튼 생성
    const customBtn = document.createElement('button');
    customBtn.className = 'custom-close-btn custom-close-btn--attention';
    customBtn.textContent = '뒤로 가기';
    customBtn.type = 'button';
    customBtn.onclick = function () {
      if (originalBtn) originalBtn.click();
    };

    // 애니메이션 종료 후 attention 클래스 제거
    setTimeout(function () {
      customBtn.classList.remove('custom-close-btn--attention');
    }, 2300);

    lightbox.appendChild(customBtn);
  }, 50);
});

UIkit.util.on(document, 'hidden', '.uk-lightbox', function (e) {
  const customBtn = e.target.querySelector('.custom-close-btn');
  if (customBtn) customBtn.remove();
});


/* ############### 웰라이프 목업 Lightbox 동적 제어 ############### */
const MockupLightbox = {
  // 기본 href 저장 (초기값)
  originalHrefs: {
    pc: './portfolio/well-life/index.html',
    tablet: './portfolio/well-life/mockup/tablet.html',
    mobile: './portfolio/well-life/mockup/mobile.html'
  },

  // PC 버전 lightbox용 href
  lightboxHref: './portfolio/well-life/index.html',

  // 요소 선택
  getElements: function () {
    return {
      pcMockup: document.querySelector('.web-mockup__total--pc'),
      tabletMockup: document.querySelector('.web-mockup__total--tablet'),
      mobileMockup: document.querySelector('.web-mockup__total--mobile')
    };
  },

  // lightbox 속성 적용
  applyLightbox: function (element) {
    if (element && !element.hasAttribute('uk-lightbox')) {
      element.setAttribute('uk-lightbox', '');
      // href를 PC 버전으로 변경 (iframe)
      const link = element.querySelector('a');
      if (link) {
        link.href = this.lightboxHref;
        link.setAttribute('data-type', 'iframe');
      }
    }
  },

  // lightbox 속성 제거 및 원래 href 복원
  removeLightbox: function (element, type) {
    if (element && element.hasAttribute('uk-lightbox')) {
      element.removeAttribute('uk-lightbox');
      // 원래 href 복원
      const link = element.querySelector('a');
      if (link) {
        link.href = this.originalHrefs[type];
        link.removeAttribute('data-type');
      }
    }
  },

  // 비활성화 클래스 적용
  setDisabled: function (element, disabled, shrink = false) {
    if (!element) return;
    if (disabled) {
      element.classList.add('web-mockup__total-item--disabled');
      if (shrink) {
        element.classList.add('web-mockup__total-item--shrink');
      } else {
        element.classList.remove('web-mockup__total-item--shrink');
      }
    } else {
      element.classList.remove('web-mockup__total-item--disabled');
      element.classList.remove('web-mockup__total-item--shrink');
    }
  },

  // 화면 크기에 따라 lightbox 동적 적용
  update: function () {
    const elements = this.getElements();
    if (!elements.pcMockup) return; // 요소가 없으면 종료

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) {
      // 모바일: Mobile만 활성화
      this.removeLightbox(elements.pcMockup, 'pc');
      this.removeLightbox(elements.tabletMockup, 'tablet');
      this.applyLightbox(elements.mobileMockup);
      // 비활성화 클래스 관리
      this.setDisabled(elements.pcMockup, true, false); // 화면 키워서
      this.setDisabled(elements.tabletMockup, true, false); // 화면 키워서
      this.setDisabled(elements.mobileMockup, false);
    } else if (isTablet) {
      // 태블릿: Tablet만 활성화
      this.removeLightbox(elements.pcMockup, 'pc');
      this.applyLightbox(elements.tabletMockup);
      this.removeLightbox(elements.mobileMockup, 'mobile');
      // 비활성화 클래스 관리
      this.setDisabled(elements.pcMockup, true, false); // 화면 키워서
      this.setDisabled(elements.tabletMockup, false);
      this.setDisabled(elements.mobileMockup, true, true); // 화면 줄여서
    } else {
      // PC: 모두 활성화 (PC만 lightbox)
      this.applyLightbox(elements.pcMockup);
      this.removeLightbox(elements.tabletMockup, 'tablet');
      this.removeLightbox(elements.mobileMockup, 'mobile');
      // 비활성화 클래스 제거
      this.setDisabled(elements.pcMockup, false);
      this.setDisabled(elements.tabletMockup, false);
      this.setDisabled(elements.mobileMockup, false);
    }
  },

  // 초기화
  init: function () {
    this.update();
    // 리사이즈 이벤트에 debounce 적용
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.update(), 100);
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  /* ########## 공통 요소 캐싱 ########## */
  const header = document.querySelector('header');
  const topBtn = document.querySelector('.top-btn');
  const mockupBox = document.querySelector('.mockup-box');

  // 유틸리티 버튼 표시/숨김 함수
  function setUtilButtonsVisible(visible) {
    if (topBtn) topBtn.classList.toggle('top-btn--on', visible);
  }

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
      window.addEventListener('load', () => window.loadingManager.hide());
    }
  }

  /* ########## 헤더 Reveal 애니메이션 ########## */
  if (header) {
    header.classList.add('header--reveal');
    // 애니메이션 완료 후 클래스 제거 (다음 프레임에서 transition 적용되도록)
    header.addEventListener('animationend', function () {
      requestAnimationFrame(function () {
        header.classList.remove('header--reveal');
      });
    });
  }

  /* ########## 웰라이프 목업 Lightbox 초기화 ########## */
  MockupLightbox.init();

  /* ########## ALT + N 단축키 사용시 GNB로 포커스 ########## */
  document.addEventListener('keydown', function (event) {
    // ALT + N 키 조합 감지 (키코드 78은 'N'에 해당)
    if (event.altKey && event.which === 78) {
      // 브라우저의 기본 동작 방지
      event.preventDefault();
      // GNB 요소
      const navElement = document.querySelector('.header__gnb');
      // 네비게이션에 포커스 설정
      if (navElement) {
        navElement.focus();
      }
    }
  });


  /* ############### 유틸 버튼 이벤트 ############### */
  // 스크롤에 따른 top-btn 버튼 표시/숨김
  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY >= 500;

    // header reveal 애니메이션 중에는 버튼 표시 건너뛰기
    const isRevealing = header && header.classList.contains('header--reveal');

    if (!isRevealing) {
      setUtilButtonsVisible(scrolled);
    }
  });

  // 상단 이동 버튼 클릭시
  if (topBtn) {
    topBtn.addEventListener('click', function (e) {
      e.preventDefault(); // href="#" 기본 동작 방지 (iframe 내에서 부모 스크롤 방지)
      window.scrollTo({ top: 0, behavior: 'smooth' });
      UtilButtons.resetButtons();
    });
  }

  // 헤더 사이드바 버튼 토글
  const sidebarBtn = document.querySelector('.header__sidebar-btn');
  const sidebarNav = document.querySelector('.sidebar-nav');
  const sidebarInner = document.querySelector('.sidebar-nav__inner');
  const sidebarCloseBtn = document.querySelector('.sidebar-nav__close-btn');

  // 사이드바 열기/닫기 함수
  function openSidebar() {
    UtilButtons.toggleNavigation('.sidebar-nav', 'sidebar--on');
    if (sidebarInner) sidebarInner.classList.toggle('sidebar-nav__inner--active');

    // 포커스 트랩: 열릴 때 첫 번째 메뉴로 포커스 이동
    setTimeout(function () {
      if (!sidebarNav) return;
      const firstLink = sidebarNav.querySelector('.sidebar-nav__item');
      if (firstLink) firstLink.focus();
    }, 100);
  }

  function closeSidebar() {
    UtilButtons.resetButtons();
    // 포커스 복귀: 닫힐 때 사이드바 버튼으로 포커스 이동
    if (sidebarBtn) sidebarBtn.focus();
  }

  if (sidebarBtn) {
    sidebarBtn.addEventListener('click', openSidebar);
  }

  // 사이드바 딤 영역 클릭 시 닫기
  if (sidebarNav) {
    sidebarNav.addEventListener('click', function (e) {
      if (e.target === sidebarNav) closeSidebar();
    });

    // 포커스 트랩: Tab 키로 사이드바 내에서만 순환
    sidebarNav.addEventListener('keydown', function (e) {
      if (!document.body.classList.contains('sidebar--on')) return;

      // ESC 키로 닫기
      if (e.key === 'Escape') {
        closeSidebar();
        return;
      }

      // Tab 키 처리
      if (e.key !== 'Tab') return;

      const focusableElements = sidebarNav.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        // Shift+Tab: 첫 번째 → 마지막
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        // Tab: 마지막 → 첫 번째
        e.preventDefault();
        firstEl.focus();
      }
    });
  }

  // 사이드바 링크
  document.querySelectorAll('.sidebar-nav__item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      closeSidebar();
    });
  });

  // 사이드바 닫기 버튼
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  // 사이드바 로고 클릭 시 닫기
  const sidebarLogo = document.querySelector('.sidebar-nav__logo');
  if (sidebarLogo) {
    sidebarLogo.addEventListener('click', closeSidebar);
  }


  /* ############### 모바일 목업 스크롤바 제거 ############### */
  // 라이트박스 링크 클릭시 버튼 숨김
  document.querySelectorAll('.practical-slider__item').forEach(function (item) {
    item.addEventListener('click', function () {
      setUtilButtonsVisible(false);
    });
  });

  // 라이트박스 닫힐 때 버튼 표시
  document.addEventListener('hidden.uk.lightbox', function () {
    setUtilButtonsVisible(true);
  });


  /* ############### 멀티 박스(목업 모음) 관련 ############### */
  const mockupOpenBtn = document.querySelector('.mockup-box__open-btn');

  // 로딩 완료 후 목업박스 버튼에 주목 애니메이션 적용 (타이밍은 CSS animation-delay로 제어)
  const startMockupAnimation = () => {
    if (mockupOpenBtn) {
      mockupOpenBtn.classList.add('mockup-box__open-btn--initial-attention');
      setTimeout(() => mockupOpenBtn.classList.remove('mockup-box__open-btn--initial-attention'), 5500); // 4.5초 애니메이션 + 1초 delay
    }
  };

  // 로딩이 완료된 후 애니메이션 시작
  if (window.loadingManager) {
    window.addEventListener('load', startMockupAnimation);
  } else {
    // loadingManager가 없으면 즉시 시작
    startMockupAnimation();
  }

  // 목업박스 열기/닫기 기능
  if (mockupOpenBtn) {
    mockupOpenBtn.addEventListener('click', function () {
      if (mockupBox) mockupBox.classList.toggle('mockup-box--on');
      this.classList.add('mockup-box__open-btn--disabled');
      setTimeout(() => this.classList.remove('mockup-box__open-btn--disabled'), 600);
    });
  }

  document.querySelectorAll('.mockup-box__action-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (mockupBox) mockupBox.classList.remove('mockup-box--on');
    });
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


  /* ############### Swiper Slider 관련 함수 ############### */
  // Practical Coding - 각 슬라이더에 Swiper 초기화
  document.querySelectorAll('.practical-slider__box').forEach(function (el) {
    new Swiper(el, {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 24,
      loop: true,
      speed: 300,
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true
      },
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev')
      },
      breakpoints: {
        // 모바일: 0~768px
        0: {
          slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 16
        },
        // 태블릿: 769px~1024px
        769: {
          slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 20
        },
        // PC: 1025px~
        1025: {
          slidesPerView: 4,
          slidesPerGroup: 1,
          spaceBetween: 24
        }
      }
    });
  });


  /* ############### AOS.js ############### */
  AOS.init({
    duration: 1500,
    once: true,
  });
});