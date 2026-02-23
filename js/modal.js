/* ############### Modal - Overlay Expansion Logic ############### */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // 애니메이션 진행 중 플래그 (클릭 방지용)
  let isAnimating = false;

  // 현재 활성 modifier 추적
  let activeModifier = '';

  // 내비게이션 상태
  let currentItems = [];
  let currentIndex = 0;

  // 공통 오버레이 요소 생성
  let overlay = document.querySelector('.modal');
  let backdrop = document.querySelector('.modal__backdrop');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal';
    overlay.innerHTML =
      '<div class="modal__close-btn"></div>' +
      '<div class="modal__content"></div>';
    document.body.appendChild(overlay);
  }

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'modal__backdrop';
    document.body.appendChild(backdrop);
  }

  const contentContainer = overlay.querySelector('.modal__content');
  const closeBtn = overlay.querySelector('.modal__close-btn');

  // 스크롤바 너비 계산 (Layout Shift 방지용)
  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  // 내비게이션 바 HTML 생성
  function createNavBar() {
    const nav = document.createElement('div');
    nav.className = 'slider-nav';
    nav.innerHTML =
      '<button class="slider-nav__btn slider-nav__btn--prev" type="button" aria-label="이전"></button>' +
      '<div class="slider-nav__dots"></div>' +
      '<span class="slider-nav__counter"></span>' +
      '<button class="slider-nav__btn slider-nav__btn--next" type="button" aria-label="다음"></button>';

    // 이벤트 바인딩
    nav.querySelector('.slider-nav__btn--prev').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo(currentIndex - 1);
    });
    nav.querySelector('.slider-nav__btn--next').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo(currentIndex + 1);
    });

    return nav;
  }

  // Detail panel에 내비게이션 바 삽입
  function appendNavToDetail() {
    const detailPanel = contentContainer.querySelector('.modal__detail-panel');
    if (!detailPanel) return;

    const nav = createNavBar();
    detailPanel.appendChild(nav);

    // Dot 생성
    renderDots(nav, currentItems.length, currentIndex);
    // Counter 갱신
    updateCounter(nav, currentIndex, currentItems.length);
  }

  // Dot 생성
  function renderDots(navEl, total, activeIndex) {
    const dotsContainer = navEl.querySelector('.slider-nav__dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-nav__dot' + (i === activeIndex ? ' slider-nav__dot--active' : '');
      dot.type = 'button';
      dot.ariaLabel = `${i + 1}번째 항목`;
      dot.addEventListener('click', () => navigateTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Dot 갱신
  function updateDots(activeIndex) {
    const dots = contentContainer.querySelectorAll('.slider-nav__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('slider-nav__dot--active', i === activeIndex);
    });
  }

  // Counter 갱신
  function updateCounter(navEl, current, total) {
    const counter = navEl.querySelector('.slider-nav__counter');
    if (counter) {
      counter.textContent = `${current + 1} / ${total}`;
    }
  }

  // 콘텐츠 교체 (fade 애니메이션)
  function updateContent(item) {
    contentContainer.style.opacity = '0';

    setTimeout(() => {
      contentContainer.innerHTML = item.innerHTML;
      appendNavToDetail();
      contentContainer.style.opacity = '1';
    }, 200);
  }

  // 내비게이션 이동
  function navigateTo(index) {
    if (isAnimating) return;

    // 무한 루프
    if (index < 0) {
      index = currentItems.length - 1;
    } else if (index >= currentItems.length) {
      index = 0;
    }

    currentIndex = index;
    updateContent(currentItems[currentIndex]);
  }

  // Open Handler (공통)
  function openModal(item, modifier, items) {
    // 애니메이션 진행 중이면 클릭 무시
    if (isAnimating) return;

    isAnimating = true;
    activeModifier = modifier;

    // 카드 그룹 및 인덱스 설정
    currentItems = Array.from(items);
    currentIndex = currentItems.indexOf(item);

    // 1. 콘텐츠 복제
    contentContainer.innerHTML = item.innerHTML;
    contentContainer.style.opacity = '1';

    // 2. 내비게이션 바 삽입
    appendNavToDetail();

    // 스크롤바가 사라지면서 화면이 밀리는 현상 방지
    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // modifier 적용
    overlay.classList.add(modifier);

    // 오버레이 및 배경 표시
    overlay.classList.add('modal--visible');
    backdrop.classList.add('modal__backdrop--visible');
    body.style.overflow = 'hidden';

    // 3. 확장 애니메이션 실행 (다음 프레임에서 클래스 추가)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('modal--expanded');

        // 애니메이션 완료 후 플래그 해제
        setTimeout(() => {
          isAnimating = false;
        }, 700);
      });
    });
  }

  // Close Function
  function closeOverlay() {
    // 이미 애니메이션 중이면 무시
    if (isAnimating) return;

    isAnimating = true;

    // 1. 투명도 0으로 변경 (Fade Out)
    overlay.classList.remove('modal--visible');
    backdrop.classList.remove('modal__backdrop--visible');

    // 2. CSS Transition(0.7s) 후 상태 초기화
    setTimeout(() => {
        overlay.classList.remove('modal--expanded');

        // modifier 제거
        if (activeModifier) {
          overlay.classList.remove(activeModifier);
          activeModifier = '';
        }

        // 스크롤 및 패딩 원상복구
        body.style.overflow = '';
        body.style.paddingRight = '';

        // 내용 초기화 및 스타일 리셋
        contentContainer.innerHTML = '';
        overlay.style.top = '';
        overlay.style.left = '';
        overlay.style.width = '';
        overlay.style.height = '';
        overlay.style.transform = '';

        // 내비게이션 상태 초기화
        currentItems = [];
        currentIndex = 0;

        // 애니메이션 완료 후 플래그 해제
        isAnimating = false;
    }, 700); // CSS transition-duration과 일치 (0.7s)
  }

  // Close Handlers
  closeBtn.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);

  // 키보드 좌우 화살표
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('modal--expanded')) return;

    if (e.key === 'ArrowLeft') {
      navigateTo(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      navigateTo(currentIndex + 1);
    } else if (e.key === 'Escape') {
      closeOverlay();
    }
  });

  /* ----- Skill Section ----- */
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('click', () => {
      openModal(item, 'modal--skill', skillItems);
    });
  });

  /* ----- Core Section ----- */
  const coreCards = document.querySelectorAll('.core-card');
  coreCards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card, 'modal--core', coreCards);
    });
  });
});
