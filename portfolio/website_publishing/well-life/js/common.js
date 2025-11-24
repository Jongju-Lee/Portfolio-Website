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

  /* ---------- 햄버거 버튼 클릭 시 ---------- */
  document.addEventListener("click", (e) => {
    // 햄버거 버튼
    const hamburgerBtn = e.target.closest(".header-right__hamburger-btn");
    if (!hamburgerBtn) return;
    $sideBar.classList.add("sidebar--active");
  });

  /* ---------- 사이드 바 닫기 버튼 클릭 시 ---------- */
  document.addEventListener("click", (e) => {
    const sideBarCloseBtn = e.target.closest(".sidebar-header__close-btn");
    if (!sideBarCloseBtn) return;
    $sideBar.classList.remove("sidebar--active");
  });

  /* ---------- 사이드 바 배경 클릭 시 ---------- */
  document.addEventListener("click", (e) => {
    const sideBar = e.target.closest(".sidebar");
    if (!sideBar) return;

    // sidebar-container 외부(dim 배경)를 클릭했는지 확인
    const sideBarContainer = e.target.closest(".sidebar-container");
    // sidebar-container 내부를 클릭했다면 무시
    if (sideBarContainer) return;
    sideBar.classList.remove("sidebar--active");
  });

  /* ---------- 사이드 바 링크 버튼 클릭 시 ---------- */
  document.addEventListener("click", (e) => {
    const sideBarLinkBtn = e.target.closest(".sidebar-gnb__item a");
    if (!sideBarLinkBtn) return;
    $sideBar.classList.remove("sidebar--active");
  });
  // const sideBarLinkBtn = document.querySelector(".sidebar-gnb__item");
  // sideBarLinkBtn.addEventListener("click", () => {
  //   console.log("link 버튼 클릭")
  //   $sideBar.classList.remove("sidebar--active");
  // });
  /* ########## END - 사이드 바 기능 ########## */


  /* ########## Slick.js ########## */
  /* ----- 슬라이드 카운터 함수 (반응형 지원) ----- */
  function updateCounter(event, slick, currentSlide) {
    // 현재 슬라이드 인덱스
    const current = currentSlide !== undefined ? currentSlide : slick.currentSlide;
    // 한 번에 스크롤되는 슬라이드 개수 (반응형에 따라 변경)
    const slidesToScroll = slick.options.slidesToScroll;
    // 전체 슬라이드 개수
    const totalSlides = slick.slideCount;

    // 전체 페이지 수 계산 (전체 슬라이드 / 스크롤 개수, 올림 처리)
    const totalPages = Math.ceil(totalSlides / slidesToScroll);
    // 현재 페이지 계산 ((현재 슬라이드 인덱스 + 1) / 스크롤 개수, 올림 처리)
    const currentPage = Math.ceil((current + 1) / slidesToScroll);

    // 카운터 텍스트 업데이트
    const $container = $(slick.$slider).parent();
    $container.find(".current").text(currentPage);
    $container.find(".total").text(totalPages);
  }
  // 초기화(init), 재초기화(reInit - 반응형), 슬라이드 변경(afterChange) 시 카운터 업데이트
  $(".subject-department__slick-box").on("init reInit afterChange", updateCounter);

  /* ----- SECTION - SUBJECT ----- */
  $(".subject-department__slick-box").slick({
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  /* ----- SECTION - GALLERY ----- */
  // 초기화(init), 재초기화(reInit - 반응형), 슬라이드 변경(afterChange) 시 카운터 업데이트
  $(".gallery-content__box").on("init reInit afterChange", updateCounter);

  $(".gallery-content__box").slick({
    centerMode: true,
    centerPadding: '25%',
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          centerPadding: '20%',
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: '6%',
        },
      },
    ],
  });
  /* ########## END - Slick.js ########## */

  /* ########## AOS.js ########## */
  AOS.init();
});

