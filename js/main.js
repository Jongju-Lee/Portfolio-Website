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


/* ############### 스크롤 애니메이션 제어 ############### */
const ScrollAnimation = {
  observer: null,

  init: function () {
    // 1. IntersectionObserver 지원 여부 확인 (구형 브라우저 방어 코드)
    if (!('IntersectionObserver' in window)) {
      const elements = document.querySelectorAll('[data-anim]');
      elements.forEach(function (el) {
        el.classList.add('is-animated');
      });
      return;
    }

    // 2. Observer 옵션 설정
    const options = {
      root: null, // 브라우저 뷰포트를 기준
      rootMargin: '0px',
      threshold: 0.1 // 요소가 10% 정도 뷰포트에 들어왔을 때 콜백 실행
    };

    // 3. Observer 인스턴스 생성
    this.observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // data-anim-delay 속성이 있다면 트랜지션 딜레이 적용
          const delay = el.getAttribute('data-anim-delay');
          const delayTime = delay ? parseInt(delay, 10) : 0;
          const durationTime = 1500; // CSS 기본 transition duration (1.5s)

          if (delay) {
            el.style.transitionDelay = delay + 'ms';
          }

          // 애니메이션 활성화 클래스 추가
          el.classList.add('is-animated');

          // AOS의 once: true 옵션과 동일한 효과를 위해 관찰 종료
          observer.unobserve(el);

          // 애니메이션 완료 후 인라인 스타일 초기화 (Hover/Click 등 인터랙션 시 CSS Transition 충돌 방지)
          if (delay) {
            setTimeout(function () {
              el.style.transitionDelay = '';
            }, durationTime + delayTime);
          }
        }
      });
    }, options);

    // 4. 감시할 대상 요소들 수집 및 관찰 시작
    const targetElements = document.querySelectorAll('[data-anim]');
    const self = this;
    targetElements.forEach(function (el) {
      self.observer.observe(el);
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

  /* ########## ALT + N 단축키 사용시 GNB로 포커스 ########## */
  document.addEventListener('keydown', function (event) {
    // ALT + N 키 조합 감지 (키코드 78은 'N'에 해당)
    if (event.altKey && event.which === 78) {
      // 브라우저의 기본 동작 방지
      event.preventDefault();
      // GNB 요소
      const navElement = document.querySelector('.header-gnb');
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

  // 헤더 스크롤 감지 (배경 및 테두리 표시)
  window.addEventListener('scroll', function () {
    if (header) {
      if (window.scrollY > 0) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
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
  const sidebarBtn = document.querySelector('.header-sidebar__btn');
  const sidebarNav = document.querySelector('.sidebar-nav');
  const sidebarInner = document.querySelector('.sidebar-nav__inner');
  const sidebarCloseBtn = document.querySelector('.sidebar-nav__close-btn');

  // 사이드바 열기/닫기 함수
  function openSidebar() {
    UtilButtons.toggleNavigation('.sidebar-nav', 'sidebar--on');
    if (sidebarInner) sidebarInner.classList.toggle('sidebar-nav__inner--active');
    
    // 사이드바 열릴 때 헤더 숨김
    if (header) header.classList.add('header--hide');

    // 포커스 트랩: 열릴 때 첫 번째 메뉴로 포커스 이동
    setTimeout(function () {
      if (!sidebarNav) return;
      const firstLink = sidebarNav.querySelector('.sidebar-nav__item');
      if (firstLink) firstLink.focus();
    }, 100);
  }

  function closeSidebar() {
    UtilButtons.resetButtons();
    
    // 사이드바 닫힐 때 헤더 보임
    if (header) header.classList.remove('header--hide');

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
  document.querySelectorAll('.prototype-slider__item').forEach(function (item) {
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

  // 목업박스 열기/닫기 기능
  if (mockupOpenBtn) {
    mockupOpenBtn.addEventListener('click', function () {
      if (mockupBox) mockupBox.classList.toggle('mockup-box--on');
      this.classList.add('mockup-box__open-btn--disabled');
      this.style.animation = 'none';
      setTimeout(() => this.classList.remove('mockup-box__open-btn--disabled'), 600);
    });
  }

  document.querySelectorAll('.mockup-box__action-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (mockupBox) mockupBox.classList.remove('mockup-box--on');
    });
  });

  // util-btn 등장 전환 완료 후 transition 속도 변경 (0.5s → 0.3s)
  document.querySelectorAll('.util-btn').forEach(function (btn) {
    btn.addEventListener('transitionend', function () {
      this.style.transition = 'all 0.3s';
    }, { once: true });
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


  /* ############### About Tag Toggle ############### */
  const aboutTags = document.querySelectorAll('.about-tag');
  
  // 480px 미만에서 기본적으로 닫힌 상태로 설정
  function initAboutTags() {
    const isMobile = window.innerWidth < 480;
    aboutTags.forEach(function (tag) {
      if (isMobile) {
        tag.classList.add('about-tag--collapsed');
      } else {
        tag.classList.remove('about-tag--collapsed');
      }
    });
  }
  
  // 초기화
  initAboutTags();
  
  // 클릭 이벤트
  aboutTags.forEach(function (tag) {
    tag.addEventListener('click', function () {
      this.classList.toggle('about-tag--collapsed');
    });
  });
  
  // 리사이즈 이벤트
  let aboutTagResizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(aboutTagResizeTimeout);
    aboutTagResizeTimeout = setTimeout(initAboutTags, 300);
  });


  /* ############### Resume Exclamation 툴팁 토글 ############### */
  var exclamationBtn = document.querySelector('.resume-exclamation__btn');
  var exclamationTooltip = document.querySelector('.resume-exclamation__tool-tip');
  var exclamationClicked = false;

  if (exclamationBtn && exclamationTooltip) {
    // 버튼 클릭 토글
    exclamationBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      exclamationTooltip.classList.toggle('resume-exclamation__tool-tip--active');

      // 클릭 후 바운스 애니메이션 영구 중지
      if (!exclamationClicked) {
        exclamationClicked = true;
        exclamationBtn.classList.remove('resume-exclamation__btn--animated');
        resumeObserver.unobserve(exclamationBtn);
      }
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', function (e) {
      if (!exclamationTooltip.contains(e.target) && !exclamationBtn.contains(e.target)) {
        exclamationTooltip.classList.remove('resume-exclamation__tool-tip--active');
      }
    });

    // 화면 진입/이탈 시 바운스 애니메이션 실행/리셋
    var resumeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (exclamationClicked) return;

        if (entry.isIntersecting) {
          exclamationBtn.classList.add('resume-exclamation__btn--animated');
        } else {
          exclamationBtn.classList.remove('resume-exclamation__btn--animated');
        }
      });
    }, { threshold: 0.5 });

    resumeObserver.observe(exclamationBtn);
  }


  /* ############### 스크롤 애니메이션 (AOS 대체) 초기화 ############### */
  ScrollAnimation.init();
});