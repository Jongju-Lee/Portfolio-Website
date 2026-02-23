document.addEventListener("DOMContentLoaded", () => {
  /* ########## 상수 정의 ########## */
  const TOP_BTN_SHOW_THRESHOLD = 300; // Top 버튼 표시 스크롤 위치(px)
  const COUNT_UP_DURATION = 1500; // 카운트업 애니메이션 지속 시간(ms)
  const SWIPER_AUTOPLAY_DELAY = 4000; // Swiper 자동재생 딜레이(ms)
  const SWIPER_SPEED = 400; // Swiper 슬라이드 전환 속도(ms)


  /* ########## 다크모드 기능 ########## */
  const root = document.documentElement;
  const darkModeBtn = document.querySelector(".dark-mode-btn");

  if (darkModeBtn) {
    /**
     * 현재 테마와 버튼 클래스 동기화 함수
     * @param {string} theme 'dark' | 'light'
     * theme이 'dark'면 버튼은 'light'아이콘, 반대도 마찬가지
     */
    function setTheme(theme) {
      if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
        darkModeBtn.classList.remove("dark-mode-btn--dark");
        darkModeBtn.classList.add("dark-mode-btn--light"); // 라이트모드로 전환하는 버튼
        localStorage.setItem("theme", "dark");
      } else {
        root.removeAttribute("data-theme");
        darkModeBtn.classList.remove("dark-mode-btn--light");
        darkModeBtn.classList.add("dark-mode-btn--dark"); // 다크모드로 전환하는 버튼
        localStorage.setItem("theme", "light");
      }
    }

    // 페이지 로드 시 localStorage 기준으로 버튼/테마 동기화. 값이 없으면 light(기본)
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // 버튼 클릭 시 테마 및 버튼 상태 모두 토글
    darkModeBtn.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "light" : "dark");
    });
  }
  /* ########## END - 다크모드 기능 ########## */


  /* ########## 사이드 바 기능 ########## */
  // 사이드 바 DOM
  const $sideBar = document.querySelector(".sidebar");

  /* ---------- 사이드 바 이벤트 위임 ---------- */
  document.addEventListener("click", (e) => {
    const hamburgerBtn = e.target.closest(".header-right__hamburger-btn");
    const closeBtn = e.target.closest(".sidebar-header__close-btn");
    const linkBtn = e.target.closest(".sidebar-gnb__item a");
    const sidebar = e.target.closest(".sidebar");
    const sidebarContainer = e.target.closest(".sidebar-container");

    // 햄버거 버튼 클릭 시 사이드바 열기
    if (hamburgerBtn && $sideBar) {
      $sideBar.classList.add("sidebar--active");
      return;
    }

    // 닫기 버튼 또는 링크 클릭 시 사이드바 닫기
    if ((closeBtn || linkBtn) && $sideBar) {
      $sideBar.classList.remove("sidebar--active");
      return;
    }

    // 사이드바 배경(dim) 클릭 시 닫기
    if (sidebar && !sidebarContainer && $sideBar) {
      $sideBar.classList.remove("sidebar--active");
    }
  });
  /* ########## END - 사이드 바 기능 ########## */


  /* ########## Swiper.js ########## */
  if (typeof Swiper !== 'undefined') {
    // Progress Bar 업데이트 함수 (선언을 사용 전에 배치)
    function updateGalleryProgress(swiper) {
      const progressBar = document.querySelector('.gallery-swiper__progress-bar');
      if (progressBar && swiper) {
        const progress = (swiper.realIndex + 1) / swiper.slides.length;
        progressBar.style.width = (progress * 100) + '%';
      }
    }

    // Fraction Counter 업데이트 함수 (선언을 사용 전에 배치)
    const subjectSlides = document.querySelectorAll('.subject-swiper .swiper-slide:not(.swiper-slide-duplicate)');
    const SUBJECT_TOTAL_SLIDES = subjectSlides.length;

    function updateSubjectCounter(swiper) {
      const currentEl = document.querySelector('.subject-swiper__counter .swiper-pagination-current');
      const totalEl = document.querySelector('.subject-swiper__counter .swiper-pagination-total');
      if (currentEl && totalEl) {
        const slidesPerGroup = swiper.params.slidesPerGroup || 1;
        const totalPages = Math.ceil(SUBJECT_TOTAL_SLIDES / slidesPerGroup);
        // loop 모드에서는 realIndex 사용
        const currentPage = Math.floor(swiper.realIndex / slidesPerGroup) + 1;
        currentEl.textContent = currentPage;
        totalEl.textContent = totalPages;
      }
    }

    // Swiper hover 시 자동재생 일시정지 공통 함수 (선언을 사용 전에 배치)
    function addHoverPause(selector, swiperInstance) {
      const el = document.querySelector(selector);
      if (el && swiperInstance) {
        el.addEventListener('mouseenter', () => {
          swiperInstance.autoplay.stop();
        });
        el.addEventListener('mouseleave', () => {
          swiperInstance.autoplay.start();
        });
      }
    }

    /* ----- Gallery Slider (둘러보기) ----- */
    const gallerySwiper = new Swiper('.gallery-swiper', {
      centeredSlides: true,
      slidesPerView: 1.5,
      spaceBetween: 20,
      loop: true,
      speed: SWIPER_SPEED,
      autoplay: {
        delay: SWIPER_AUTOPLAY_DELAY,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.gallery-swiper .swiper-button-next',
        prevEl: '.gallery-swiper .swiper-button-prev',
      },
      breakpoints: {
        // Mobile
        0: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 16,
        },
        // Tablet
        768: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 20,
        },
        // PC
        1280: {
          slidesPerView: 'auto',
          centeredSlides: true,
          spaceBetween: 24,
        },
      },
      on: {
        init: updateGalleryProgress,
        slideChange: updateGalleryProgress,
      },
    });

    /* ----- Subject Slider (진료과목 - Tablet/Mobile 전용) ----- */
    const subjectSwiper = new Swiper('.subject-swiper', {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 0,
      loop: true,
      speed: SWIPER_SPEED,
      autoplay: {
        delay: SWIPER_AUTOPLAY_DELAY,
        disableOnInteraction: false,
      },
      breakpoints: {
        // Mobile
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1,
        },
        // Tablet
        600: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
      },
      on: {
        init: updateSubjectCounter,
        slideChange: updateSubjectCounter,
      },
    });

    addHoverPause('.gallery-swiper', gallerySwiper);
    addHoverPause('.subject-swiper', subjectSwiper);
  }
  /* ########## END - Swiper.js ########## */


  /* ########## 스크롤 애니메이션 ########## */
  // 1. IntersectionObserver 지원 여부 확인 (구형 브라우저 방어 코드)
  if (!('IntersectionObserver' in window)) {
    const animElements = document.querySelectorAll('[data-anim]');
    animElements.forEach((el) => {
      el.classList.add('is-animated');
    });
  } else {
    // 2. Observer 옵션 설정
    const animOptions = {
      root: null, // 브라우저 뷰포트를 기준
      rootMargin: '0px',
      threshold: 0.1 // 요소가 10% 정도 뷰포트에 들어왔을 때 콜백 실행
    };

    // 3. Observer 인스턴스 생성
    const animObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // data-anim-duration 속성이 있다면 인라인 스타일에 덮어쓰기 적용
          const duration = el.getAttribute('data-anim-duration');
          if (duration) {
            el.style.transitionDuration = duration + 'ms';
          }

          // data-anim-delay 속성이 있다면 인라인 스타일에 딜레이 적용
          const delay = el.getAttribute('data-anim-delay');
          if (delay) {
            el.style.transitionDelay = delay + 'ms';
          }

          // 애니메이션 활성화 클래스 추가
          el.classList.add('is-animated');

          // 1회 실행 후 관찰 종료
          observer.unobserve(el);
        }
      });
    }, animOptions);

    // 4. 감시할 대상 요소들 수집 및 관찰 시작
    const animElements = document.querySelectorAll('[data-anim]');
    animElements.forEach((el) => {
      animObserver.observe(el);
    });
  }
  /* ########## END - 스크롤 애니메이션 ########## */


  /* ########## Top Button ########## */
  const topBtn = document.querySelector(".top-btn");

  if (topBtn) {
    // 스크롤 시 버튼 표시/숨김 (passive: true로 스크롤 성능 최적화)
    window.addEventListener("scroll", () => {
      if (window.scrollY > TOP_BTN_SHOW_THRESHOLD) {
        topBtn.classList.add("top-btn--active");
      } else {
        topBtn.classList.remove("top-btn--active");
      }
    }, { passive: true });

    // 클릭 시 부드럽게 최상단으로 이동
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  /* ########## END - Top Button ########## */


  /* ########## Count Up Animation ########## */
  const countUpElements = document.querySelectorAll(
    ".doctor-info__stats-number, .hero-stats__number"
  );

  if (countUpElements.length > 0) {
    // 숫자 포맷팅 함수 (천 단위 콤마)
    function formatNumber(num) {
      return num.toLocaleString('ko-KR');
    }

    // 카운트업 애니메이션 함수
    function animateCountUp(el) {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / COUNT_UP_DURATION, 1);

        // easeOutQuad 이징 함수
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(easeProgress * target);

        el.textContent = formatNumber(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = formatNumber(target);
        }
      }

      requestAnimationFrame(updateCount);
    }

    // Intersection Observer로 화면에 보일 때 실행
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // hero-stats는 스크롤 애니메이션 완료 후 시작
          const isHeroStats = entry.target.closest('.hero-stats');
          let delay = 0;
          
          if (isHeroStats) {
            const animDuration = parseInt(isHeroStats.getAttribute('data-anim-duration')) || 1000;
            const animDelay = parseInt(isHeroStats.getAttribute('data-anim-delay')) || 0;
            delay = animDuration + animDelay;
          }

          setTimeout(() => {
            animateCountUp(entry.target);
          }, delay);

          observer.unobserve(entry.target); // 한 번만 실행
        }
      });
    }, { threshold: 0.5 });

    countUpElements.forEach((el) => observer.observe(el));
  }
  /* ########## END - Count Up Animation ########## */
});
