/**
 * 범용 로딩 시스템
 * - 전체 화면 로딩
 * - 인라인 로딩
 * - iframe 자동 로딩
 */

class LoadingManager {
  constructor() {
    this.currentOverlay = null;
    this.timeoutId = null;
  }

  // 전체 화면 로딩 표시
  show(options = {}) {
    const { text = '로딩 중...', variant = 'dark', timeout = 10000 } = options;
    this.hide(); // 기존 로딩 제거

    const overlay = this.createOverlay(text, variant, false);
    document.body.appendChild(overlay);
    document.body.setAttribute('aria-busy', 'true');

    this.currentOverlay = overlay;

    // 타임아웃 설정
    if (timeout > 0) {
      this.timeoutId = setTimeout(() => this.hide(), timeout);
    }

    return overlay;
  }

  // 인라인 로딩 표시 (특정 요소에)
  showInline(targetElement, options = {}) {
    const { text = '콘텐츠 로딩 중...', variant = 'light' } = options;
    this.hide();

    targetElement.style.position = 'relative';
    const overlay = this.createOverlay(text, variant, true);
    targetElement.appendChild(overlay);

    this.currentOverlay = overlay;
    return overlay;
  }

  // 로딩 숨김
  hide() {
    if (this.currentOverlay) {
      this.currentOverlay.style.opacity = '0';
      setTimeout(() => {
        if (this.currentOverlay?.parentNode) {
          this.currentOverlay.parentNode.removeChild(this.currentOverlay);
        }
        this.currentOverlay = null;
      }, 300);
    }

    document.body.removeAttribute('aria-busy');

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  // 오버레이 생성 헬퍼
  createOverlay(text, variant, isInline) {
    const overlay = document.createElement('div');
    overlay.className = 'loading';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');

    overlay.innerHTML = `
      <div class="loading__overlay loading__overlay--${variant}${isInline ? ' loading__overlay--inline' : ''}">
        <div class="loading__spinner" aria-hidden="true"></div>
        <div class="loading__text">${text}</div>
        <div class="loading__sr-text">${text}</div>
      </div>
    `;

    return overlay;
  }
}

// 전역 인스턴스 생성
const loadingManager = new LoadingManager();
window.loadingManager = loadingManager;
