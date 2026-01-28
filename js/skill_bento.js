/* Skill Bento - Overlay Expansion Logic */

document.addEventListener('DOMContentLoaded', () => {
  const gridItems = document.querySelectorAll('.bento-item');
  const body = document.body;
  
  // 닫기 애니메이션을 위한 이전 활성 아이템 위치 저장
  let lastActiveRect = null;
  
  // 애니메이션 진행 중 플래그 (클릭 방지용)
  let isAnimating = false;
  
  // 공통 오버레이 요소 생성 (없는 경우에만)
  let overlay = document.querySelector('.bento-overlay');
  let backdrop = document.querySelector('.bento-backdrop');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'bento-overlay';
    // 닫기 버튼 및 콘텐츠 복제 영역 추가
    overlay.innerHTML = '<div class="bento-close-btn">&times;</div><div class="bento-content-clone"></div>';
    document.body.appendChild(overlay);
  }
  
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'bento-backdrop';
    document.body.appendChild(backdrop);
  }
  
  const contentContainer = overlay.querySelector('.bento-content-clone');
  const closeBtn = overlay.querySelector('.bento-close-btn');

  // 스크롤바 너비 계산 (Layout Shift 방지용)
  const getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth;
  };

  // Open Handler
  gridItems.forEach(item => {
    item.addEventListener('click', () => {
      // 애니메이션 진행 중이면 클릭 무시
      if (isAnimating) return;
      
      isAnimating = true;
      
      // 1. 콘텐츠 복제
      contentContainer.innerHTML = item.innerHTML;
      
      // 2. 원본 스타일(배경색, 테두리 등) 복사 적용
      const computedStyle = window.getComputedStyle(item);
      overlay.style.backgroundColor = computedStyle.backgroundColor;
      overlay.style.borderColor = computedStyle.borderColor;
      overlay.style.borderRadius = computedStyle.borderRadius;
      
      // 스크롤바가 사라지면서 화면이 밀리는 현상 방지
      const scrollbarWidth = getScrollbarWidth();
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // 오버레이 및 배경 표시
      overlay.classList.add('visible');
      backdrop.classList.add('visible');
      body.style.overflow = 'hidden';
      
      // 3. 확장 애니메이션 실행 (다음 프레임에서 클래스 추가)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('expanded');
          
          // 애니메이션 완료 후 플래그 해제
          setTimeout(() => {
            isAnimating = false;
          }, 700);
        });
      });
    });
  });
  
  // Close Function
  function closeOverlay() {
    // 이미 애니메이션 중이면 무시
    if (isAnimating) return;
    
    isAnimating = true;
    
    // 1. 투명도 0으로 변경 (Fade Out)
    overlay.classList.remove('visible');
    backdrop.classList.remove('visible');
    
    // 2. CSS Transition(0.5s) 후 상태 초기화
    setTimeout(() => {
        overlay.classList.remove('expanded');
        
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
});
