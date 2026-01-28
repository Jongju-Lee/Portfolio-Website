/* Skill Bento - Overlay Expansion Logic */

document.addEventListener('DOMContentLoaded', () => {
  const gridItems = document.querySelectorAll('.bento-item');
  const body = document.body;
  
  // 닫기 애니메이션을 위한 이전 활성 아이템 위치 저장
  let lastActiveRect = null;
  
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
      // 1. 원본 아이템 위치 저장
      const rect = item.getBoundingClientRect();
      lastActiveRect = rect;
      
      // 2. 콘텐츠 복제
      contentContainer.innerHTML = item.innerHTML;
      
      // 3. 초기 상태 설정 (클릭한 아이템 바로 위에 위치)
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.transform = 'none';
      
      // 원본 스타일(배경색, 테두리 등) 복사 적용
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
      
      // 4. 확장 애니메이션 실행 (다음 프레임에서 클래스 추가)
      requestAnimationFrame(() => {
        overlay.classList.add('expanded');
        // CSS 클래스(expanded)가 중앙 정렬을 제어하도록 인라인 스타일 초기화
        overlay.style.top = '';
        overlay.style.left = '';
        overlay.style.width = '';
        overlay.style.height = '';
        overlay.style.transform = '';
      });
    });
  });
  
  // Close Function
  function closeOverlay() {
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
    }, 500); // CSS transition-duration과 일치 (0.5s)
  }
  
  // Close Handlers
  closeBtn.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);
});
