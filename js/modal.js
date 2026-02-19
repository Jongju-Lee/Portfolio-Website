/* ############### Modal - Overlay Expansion Logic ############### */

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // 애니메이션 진행 중 플래그 (클릭 방지용)
  let isAnimating = false;

  // 공통 오버레이 요소 생성
  let overlay = document.querySelector('.modal');
  let backdrop = document.querySelector('.modal__backdrop');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal';
    // 닫기 버튼 및 콘텐츠 복제 영역 추가
    overlay.innerHTML = '<div class="modal__close-btn"></div><div class="modal__content"></div>';
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

  // 현재 활성 modifier 추적
  let activeModifier = '';

  // Open Handler (공통)
  function openModal(item, modifier) {
    // 애니메이션 진행 중이면 클릭 무시
    if (isAnimating) return;

    isAnimating = true;
    activeModifier = modifier;

    // 1. 콘텐츠 복제
    contentContainer.innerHTML = item.innerHTML;


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

        // 애니메이션 완료 후 플래그 해제
        isAnimating = false;
    }, 700); // CSS transition-duration과 일치 (0.7s)
  }

  // Close Handlers
  closeBtn.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);

  /* ----- Skill Section ----- */
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('click', () => {
      openModal(item, 'modal--skill');
    });
  });

  /* ----- Core Section ----- */
  const coreCards = document.querySelectorAll('.core-card');
  coreCards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card, 'modal--core');
    });
  });
});
