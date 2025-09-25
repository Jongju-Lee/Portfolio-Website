// accessibility-modal.js
$(function() {
  /* 접근성 알림 토스트 */
  const $accessibilityModal = $('.accessibility-modal');

  // 모달 표시 여부 초기 검사
  let hideUntil = null;
  try {
    hideUntil = localStorage.getItem('accessibilityModalHideUntil');
  } catch (e) {
    console.error('로컬스토리지 읽기 오류', e);
  }
  if (hideUntil && new Date(hideUntil) > new Date()) {
    $accessibilityModal.hide();
  }

  // 애니메이션 종료 시 포커스 트랩/해제
  $accessibilityModal.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
    const anim = e.originalEvent.animationName;
    if (anim === 'reveal-toast') {
      initFocusTrap(this);
    } else if (anim === 'close-toast') {
      removeFocusTrap();
      $(this).hide();
    }
  });

  // 버튼 클릭 이벤트
  $('.accessibility-modal__btn.ok-btn').click(function() {
    $accessibilityModal.addClass('accessibility-modal--close');
  });
  $('.accessibility-modal__btn.dismiss-btn').click(function() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    try {
      localStorage.setItem('accessibilityModalHideUntil', tomorrow.toISOString());
    } catch (e) {
      console.error('로컬스토리지 쓰기 에러', e);
    }
    $accessibilityModal.addClass('accessibility-modal--close');
  });

  // 헤더 접근성 버튼 클릭 시 모달 표시 및 포커스 트랩
  $('.header-accessibility-btn').click(function() {
    $accessibilityModal
      .removeClass('accessibility-modal--close')
      .show();
    initFocusTrap($accessibilityModal.get(0));
  });

  // 포커스 가능한 요소 수집
  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ));
  }

  // 포커스 트랩 초기화
  let previousFocus;
  let focusableEls = [], firstFocusableEl, lastFocusableEl;
  function initFocusTrap(container) {
    previousFocus = document.activeElement; // 이전 포커스 저장
    focusableEls = [container, ...getFocusableElements(container)];
    firstFocusableEl = focusableEls[0];
    lastFocusableEl = focusableEls[focusableEls.length - 1];
    firstFocusableEl && firstFocusableEl.focus();
    document.addEventListener('keydown', trapFocus);
  }

  // 포커스 트랩 해제
  function removeFocusTrap() {
    document.removeEventListener('keydown', trapFocus);
    previousFocus && previousFocus.focus();
  }

  // 포커스 순환 제어
  function trapFocus(e) {
    if (e.key !== 'Tab' || focusableEls.length === 0) return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        e.preventDefault();
        lastFocusableEl.focus();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        e.preventDefault();
        firstFocusableEl.focus();
      }
    }
  }
});

