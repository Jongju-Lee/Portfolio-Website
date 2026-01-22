document.addEventListener("DOMContentLoaded", () => {
  /* ########## 다크모드 기능 ########## */
  const root = document.documentElement;
  const darkModeBtn = document.querySelector(".dark-mode-btn");

  if (!darkModeBtn) return; // 버튼 없으면 바로 종료

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
    if (hamburgerBtn) {
      $sideBar.classList.add("sidebar--active");
      return;
    }

    // 닫기 버튼 또는 링크 클릭 시 사이드바 닫기
    if (closeBtn || linkBtn) {
      $sideBar.classList.remove("sidebar--active");
      return;
    }

    // 사이드바 배경(dim) 클릭 시 닫기
    if (sidebar && !sidebarContainer) {
      $sideBar.classList.remove("sidebar--active");
    }
  });
  /* ########## END - 사이드 바 기능 ########## */


  /* ########## Swiper.js ########## */

  /* ----- Gallery Slider (둘러보기) ----- */
  const gallerySwiper = new Swiper('.gallery-swiper', {
    centeredSlides: true,
    slidesPerView: 1.5,
    spaceBetween: 20,
    loop: true,
    speed: 400,
    autoplay: {
      delay: 4000,
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

  // Progress Bar 업데이트 함수
  function updateGalleryProgress(swiper) {
    if (!swiper) swiper = gallerySwiper;
    const progressBar = document.querySelector('.gallery-swiper__progress-bar');
    if (progressBar) {
      const progress = (swiper.realIndex + 1) / swiper.slides.length;
      progressBar.style.width = (progress * 100) + '%';
    }
  }

  /* ----- Subject Slider (진료과목 - Tablet/Mobile 전용) ----- */
  // HTML 기준으로 실제 슬라이드 수 자동 계산 (loop 모드 복제 슬라이드 제외)
  const subjectSlides = document.querySelectorAll('.subject-swiper .swiper-slide:not(.swiper-slide-duplicate)');
  const SUBJECT_TOTAL_SLIDES = subjectSlides.length;

  // Fraction Counter 업데이트 함수
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

  const subjectSwiper = new Swiper('.subject-swiper', {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 0,
    loop: true,
    speed: 400,
    autoplay: {
      delay: 4000,
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

  // Swiper hover 시 자동재생 일시정지 공통 함수
  function addHoverPause(selector, swiperInstance) {
    var el = document.querySelector(selector);
    if (el && swiperInstance) {
      el.addEventListener('mouseenter', function () {
        swiperInstance.autoplay.stop();
      });
      el.addEventListener('mouseleave', function () {
        swiperInstance.autoplay.start();
      });
    }
  }

  addHoverPause('.gallery-swiper', gallerySwiper);
  addHoverPause('.subject-swiper', subjectSwiper);

  /* ########## END - Swiper.js ########## */

  /* ########## AOS.js ########## */
  AOS.init({
    duration: 600,
    // once: true,
    easing: 'ease-out-cubic'
  });

  // 이미지 로드 완료 후 AOS 위치 재계산 (새로고침 타이밍 일관성 확보)
  window.addEventListener('load', () => {
    AOS.refresh();
  });


  /* ########## Top Button ########## */
  const topBtn = document.querySelector(".top-btn");

  if (topBtn) {
    // 스크롤 시 버튼 표시/숨김
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        topBtn.classList.add("top-btn--active");
      } else {
        topBtn.classList.remove("top-btn--active");
      }
    });

    // 클릭 시 부드럽게 최상단으로 이동
    topBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  /* ########## END - Top Button ########## */


  /* ########## Count Up Animation ########## */
  const countUpElements = document.querySelectorAll(".doctor-info__stats-number");

  if (countUpElements.length > 0) {
    // 카운트업 애니메이션 함수
    function animateCountUp(el) {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const duration = 1500; // 1.5초
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuad 이징 함수
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(easeProgress * target);

        el.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateCount);
    }

    // Intersection Observer로 화면에 보일 때 실행
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCountUp(entry.target);
          observer.unobserve(entry.target); // 한 번만 실행
        }
      });
    }, { threshold: 0.5 });

    countUpElements.forEach((el) => observer.observe(el));
  }
  /* ########## END - Count Up Animation ########## */
});

