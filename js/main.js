/* ############### 유틸 버튼 관리 함수들 ############### */
const UtilButtons = {
  // 네비게이션 토글 공통 로직
  toggleNavigation: function (selector, bodyClass) {
    $(selector).stop().fadeToggle();
    $('html, body').toggleClass(bodyClass);
  },

  // 버튼 상태 초기화
  resetButtons: function () {
    $('.trigger').removeClass('active trigger--on');
    $('.fullscreen-nav').stop().fadeOut();
    $('.sidebar-nav').stop().fadeOut();
    $('.sidebar-nav-inner').removeClass('sidebar-nav-inner--active');
    $('html, body').removeClass('sidebar--on fullscreen-nav--on');
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
    customBtn.className = 'custom-close-btn';
    customBtn.textContent = '뒤로 가기';
    customBtn.type = 'button';
    customBtn.onclick = function () {
      if (originalBtn) originalBtn.click();
    };

    lightbox.appendChild(customBtn);
  }, 50);
});

UIkit.util.on(document, 'hidden', '.uk-lightbox', function (e) {
  const customBtn = e.target.querySelector('.custom-close-btn');
  if (customBtn) customBtn.remove();
});
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
        $('header').removeClass('hide');
        navElement.focus();
        // 헤더 영역에서 포커스가 완전히 벗어날 때만 헤더 숨김 처리
        $(document).one('focusin', function (e) {
          // 포커스된 요소가 헤더 내부에 있는지 확인
          const isInHeader = $(e.target).closest('header').length > 0;
          // 헤더 외부로 포커스가 이동했을 때만 헤더 숨김
          if (!isInHeader && window.scrollY >= 500) {
            $('header').addClass('hide');
          }
        });
      }
    }
  });


  /* ############### 유틸 버튼 이벤트 ############### */
  // 스크롤에 따른 header 및 버튼 표시/숨김
  $(window).scroll(function () {
    const scrolled = window.scrollY >= 500;
    // PC에서만 헤더 숨김 (태블릿/모바일에서는 항상 표시)
    const isPC = window.innerWidth > 1024;
    $('header').toggleClass('hide', scrolled && isPC);
    $('.trigger').toggleClass('trigger--on', scrolled);
    $('.top-btn').toggleClass('top-btn--on', scrolled);
  });

  // 상단 이동 버튼 클릭시
  $('.top-btn').click(function (e) {
    e.preventDefault(); // href="#" 기본 동작 방지 (iframe 내에서 부모 스크롤 방지)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    UtilButtons.resetButtons();
  });

  // 풀스크린 네비게이션 토글
  $('.trigger').click(function () {
    $(this).toggleClass('active');
    UtilButtons.toggleNavigation('.fullscreen-nav', 'fullscreen-nav--on');

    // 최상단에서 비활성 시 숨김
    if (window.scrollY <= 50 && !$(this).hasClass('active')) {
      $(this).removeClass('trigger--on');
    }
  });

  // 풀스크린 네비게이션 링크
  $('.fullscreen-nav__item').click(function (e) {
    e.stopPropagation();
    UtilButtons.resetButtons();
  });

  // 헤더 사이드바 버튼 토글
  $('.header__sidebar-btn').click(function () {
    UtilButtons.toggleNavigation('.sidebar-nav', 'sidebar--on');
    $('.sidebar-nav-inner').toggleClass('sidebar-nav-inner--active');
  });

  // 사이드바 링크
  $('.sidebar-nav__item').click(function (e) {
    e.stopPropagation();
    UtilButtons.resetButtons();
  });

  // 사이드바 닫기 버튼
  $('.sidebar-nav__close-btn').click(function () {
    UtilButtons.resetButtons();
  });


  /* ############### 모바일 목업 스크롤바 제거 ############### */
  // 라이트박스 링크 클릭시 버튼 숨김
  $('.practical-slider__item').click(function () {
    $('.trigger').removeClass('trigger--on');
    $('.top-btn').removeClass('top-btn--on');
  });

  // 라이트박스 닫힐 때 버튼 표시
  $(document).on('hidden.uk.lightbox', function () {
    $('.trigger').addClass('trigger--on');
    $('.top-btn').addClass('top-btn--on');
  });


  /* ############### 멀티 박스(목업 모음) 관련 ############### */
  const $mockupOpenBtn = $('.mockup-box__open-btn');

  // 로딩 완료 후 목업박스 버튼에 주목 애니메이션 적용 (타이밍은 CSS animation-delay로 제어)
  const startMockupAnimation = () => {
    $mockupOpenBtn.addClass('mockup-box__open-btn--initial-attention');
    setTimeout(() => $mockupOpenBtn.removeClass('mockup-box__open-btn--initial-attention'), 5000); // 4.5초 애니메이션 + 0.5초 delay
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
    $('.mockup-box').toggleClass('mockup-box--on');
    $(this).addClass('mockup-box__open-btn--disabled');
    setTimeout(() => $(this).removeClass('mockup-box__open-btn--disabled'), 600);
  });

  $('.mockup-box__action-btn').click(function () {
    $('.mockup-box').removeClass('mockup-box--on');
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
  AOS.init();


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