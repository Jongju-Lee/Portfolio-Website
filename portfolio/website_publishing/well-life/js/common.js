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

  /* ---------- 사이드 바 닫기버튼 클릭 시 ---------- */
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
  /* ########## END - 사이드 바 기능 ########## */


  /* ########## Slick.js ########## */
  /* ----- SECTION - SUBJECT ----- */
  $(".subject-department__slick-wrap").slick({
    // autoplay: true,
    // autoplaySpeed: 3000,
    slidesToShow: 2,
    slidesToScroll: 2,
    dots: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  /* ----- SECTION - GALLERY ----- */
  $(".gallery-content__box").slick({
    centerMode: true,
    centerPadding: '25%',
    infinite: true,
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
});

