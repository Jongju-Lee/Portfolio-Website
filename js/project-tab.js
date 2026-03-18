/* ==========================================================================
 * PROJECT-TAB.JS
 * 탭 메뉴 전환 로직 — WAI-ARIA 표준 tablist 패턴 구현
 * - 탭 전환 (aria-selected, hidden, tabindex, opacity transition)
 * - 키보드 내비게이션 (← →, Home, End, Enter, Space)
 * - 첫 활성화 시 1회 애니메이션 트리거 (data-tab-animated 속성으로 재발동 방지)
 * ==========================================================================*/

const ProjectTab = {

  /* 상태 관리 */
  tabBtns: [],
  tabPanels: [],

  /* 마우스 드래그 스크롤 상태 */
  isDragging: false,   /* 드래그 중 여부 (클릭 억제용) */
  dragIsDown: false,   /* 마우스 버튼 눌림 여부 */
  dragStartX: 0,
  dragScrollLeft: 0,

  /* prev/next 탭 네비게이션 엘리먼트 */
  navEl: null,
  prevBtn: null,
  nextBtn: null,


  /* ------
   * 탭 전환
   * ------ */
  switchTab: function (targetBtn) {
    const targetPanelId = targetBtn.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);
    if (!targetPanel) return;

    const currentBtn = this.tabBtns.find(function (btn) {
      return btn.getAttribute('aria-selected') === 'true';
    });
    const currentPanel = currentBtn
      ? document.getElementById(currentBtn.getAttribute('aria-controls'))
      : null;

    /* 같은 탭 클릭 시 무시 */
    if (targetBtn === currentBtn) return;

    /* 1. 현재 활성 탭 비활성화 */
    if (currentBtn) {
      currentBtn.setAttribute('aria-selected', 'false');
      currentBtn.setAttribute('tabindex', '-1');
      currentBtn.classList.remove('project-tab__btn--active');
    }

    /* 2. 현재 패널 숨김 (opacity → 0 후 hidden 추가) */
    if (currentPanel) {
      currentPanel.classList.remove('project-tab__panel--visible');
      /* opacity transition 완료 후 hidden 처리 (0.3s = CSS transition duration) */
      const panelToHide = currentPanel;
      setTimeout(function () {
        panelToHide.setAttribute('hidden', '');
      }, 300);
    }

    /* 3. 새 탭 활성화 */
    targetBtn.setAttribute('aria-selected', 'true');
    targetBtn.setAttribute('tabindex', '0');
    targetBtn.classList.add('project-tab__btn--active');

    /* 4. section#project 배경색 클래스 토글 (컨데이너에 캐싱된 참조 사용) */
    if (this.section) {
      if (targetPanelId === 'panel-soniczero') {
        this.section.classList.add('panel-soniczero-active');
        this.section.classList.remove('panel-taskflow-active');
      } else if (targetPanelId === 'panel-taskflow') {
        this.section.classList.add('panel-taskflow-active');
        this.section.classList.remove('panel-soniczero-active');
      } else {
        /* Well Life 등 기본 상태일 때 둘 다 지움 */
        this.section.classList.remove('panel-taskflow-active', 'panel-soniczero-active');
      }
    }

    /* 5. 새 패널 표시 (hidden 제거 → requestAnimationFrame → opacity: 1) */
    targetPanel.removeAttribute('hidden');
    /* eslint-disable no-unused-expressions */
    targetPanel.offsetHeight; /* reflow 강제 (GPU 트랜지션 보장) */
    requestAnimationFrame(function () {
      targetPanel.classList.add('project-tab__panel--visible');
    });

    /* 6. 탭 버튼이 보이도록 가로 스크롤 (키보드 접근성) */
    targetBtn.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    /* 7. 첫 활성화 시 내부 애니메이션 트리거 */
    ProjectTab.triggerPanelAnimation(targetPanel);

    /* 8. prev/next 네비게이션 상태 업데이트 */
    ProjectTab.updateTabNav();
  },


  /* --------------------------------
   * 첫 활성화 시 1회 애니메이션 트리거
   * -------------------------------- */
  triggerPanelAnimation: function (panel) {
    /* data-tab-animated 속성이 이미 있으면 재발동 안 함 */
    if (panel.hasAttribute('data-tab-animated')) return;

    /* 해당 패널의 [data-anim] 요소에 is-animated 클래스 추가 */
    const animEls = panel.querySelectorAll('[data-anim]:not(.is-animated)');
    animEls.forEach(function (el) {
      /* data-anim-delay 속성 처리 */
      const delay = el.getAttribute('data-anim-delay');
      if (delay) {
        el.style.transitionDelay = delay + 'ms';
        const delayNum = parseInt(delay, 10);
        const duration = 1500; /* CSS transition duration (1.5s) */
        setTimeout(function () {
          el.style.transitionDelay = '';
        }, duration + delayNum);
      }
      el.classList.add('is-animated');

      /* ScrollAnimation observer에서 이미 관찰 중인 요소라면 unobserve */
      if (ScrollAnimation && ScrollAnimation.observer) {
        ScrollAnimation.observer.unobserve(el);
      }
    });

    /* 완료 표시 */
    panel.setAttribute('data-tab-animated', '');
  },


  /* -------------------------
   * 키보드 내비게이션 처리
   * WAI-ARIA tablist 표준 패턴
   * -------------------------*/
  handleKeydown: function (e) {
    const currentIndex = ProjectTab.tabBtns.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    const total = ProjectTab.tabBtns.length;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % total;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + total) % total;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = total - 1;
        break;
      case 'Enter':
      case ' ':
        /* 현재 포커스된 탭 활성화 */
        e.preventDefault();
        ProjectTab.switchTab(ProjectTab.tabBtns[currentIndex]);
        return;
      default:
        return;
    }

    e.preventDefault();

    /* 포커스 이동 (roving tabindex 패턴) */
    ProjectTab.tabBtns[currentIndex].setAttribute('tabindex', '-1');
    ProjectTab.tabBtns[newIndex].setAttribute('tabindex', '0');
    ProjectTab.tabBtns[newIndex].focus();

    /* 포커스 이동 시 즉시 탭 전환 (tablist 표준 동작) */
    ProjectTab.switchTab(ProjectTab.tabBtns[newIndex]);
  },


  /* --------------------------------------------------------------
   * 마우스 드래그 스크롤
   * 모바일 목업(iframe) 환경 대응 — 터치 불가 상황에서 클릭 드래그로 탭 바 스크롤
   * 5px 임계값으로 드래그 vs 클릭 구분, 드래그 중 탭 전환 억제
   * -------------------------------------------------------------- */
  initDragScroll: function (tablist) {
    const self = this;
    const DRAG_THRESHOLD = 5; /* px — 이 이상 움직여야 드래그로 판정 */

    tablist.addEventListener('mousedown', function (e) {
      self.dragIsDown = true;
      self.isDragging = false;
      self.dragStartX = e.pageX - tablist.getBoundingClientRect().left;
      self.dragScrollLeft = tablist.scrollLeft;
    });

    /* mousemove: 탭 바 내 + 탭 바 밖 모두 감지하기 위해 document에 등록 */
    document.addEventListener('mousemove', function (e) {
      if (!self.dragIsDown) return;
      const x = e.pageX - tablist.getBoundingClientRect().left;
      const walk = x - self.dragStartX;

      if (Math.abs(walk) > DRAG_THRESHOLD) {
        self.isDragging = true;
        tablist.classList.add('is-dragging');
        tablist.scrollLeft = self.dragScrollLeft - walk;
      }
    });

    /* mouseup: 탭 바 밖에서 마우스를 놔도 정상 종료 */
    document.addEventListener('mouseup', function () {
      if (!self.dragIsDown) return;
      self.dragIsDown = false;
      tablist.classList.remove('is-dragging');
      /* isDragging은 click 이벤트 처리 후 리셋 (setTimeout 0으로 click 이후에 실행) */
      setTimeout(function () {
        self.isDragging = false;
      }, 0);
    });

    /* mouseleave: 탭 바 밖으로 나가면 드래그 커서 해제 */
    tablist.addEventListener('mouseleave', function () {
      if (!self.dragIsDown) return;
      tablist.classList.remove('is-dragging');
    });
  },


  /* ------------------------------------------
   * prev/next 탭 네비게이션 초기화
   * ------------------------------------------ */
  initTabNav: function () {
    const self = this;
    const tabNav = document.querySelector('.project-tab-nav');
    if (!tabNav) return;

    this.navEl   = tabNav;
    this.prevBtn = tabNav.querySelector('.project-tab-nav__btn--prev');
    this.nextBtn = tabNav.querySelector('.project-tab-nav__btn--next');

    /* 버튼 클릭 — switchTab() 직접 호웉 */
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', function () {
        const currentIndex = ProjectTab.tabBtns.findIndex(function (btn) {
          return btn.getAttribute('aria-selected') === 'true';
        });
        if (currentIndex > 0) {
          ProjectTab.switchTab(ProjectTab.tabBtns[currentIndex - 1]);
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', function () {
        const currentIndex = ProjectTab.tabBtns.findIndex(function (btn) {
          return btn.getAttribute('aria-selected') === 'true';
        });
        if (currentIndex < ProjectTab.tabBtns.length - 1) {
          ProjectTab.switchTab(ProjectTab.tabBtns[currentIndex + 1]);
        }
      });
    }

    /* 초기 버튼 상태 반영 */
    this.updateTabNav();

    /* IntersectionObserver: project 섹션 진입/이탈 시 표시/숨김 */
    if (!('IntersectionObserver' in window)) {
      /* 구형 브라우저 fallback: 항상 표시 */
      tabNav.classList.add('project-tab-nav--visible');
      return;
    }

    const projectSection = this.section; /* init()에서 이미 캐싱된 참조 */
    if (!projectSection) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tabNav.classList.add('project-tab-nav--visible');
        } else {
          tabNav.classList.remove('project-tab-nav--visible');
        }
      });
    }, { threshold: 0.05 });

    observer.observe(projectSection);
  },


  /* ------------------------------------------
   * prev/next 버튼 상태 업데이트
   * (첫/마지막 탭일 때 해당 버튼 숨김 + 탭 이름 갱신)
   * ------------------------------------------ */
  updateTabNav: function () {
    if (!this.navEl) return;

    const currentIndex = this.tabBtns.findIndex(function (btn) {
      return btn.getAttribute('aria-selected') === 'true';
    });
    if (currentIndex === -1) return;

    /* prev 버튼 */
    if (this.prevBtn) {
      if (currentIndex <= 0) {
        this.prevBtn.setAttribute('hidden', '');
      } else {
        this.prevBtn.removeAttribute('hidden');
        const prevNameEl    = this.prevBtn.querySelector('.project-tab-nav__name');
        const prevTabNameEl = this.tabBtns[currentIndex - 1].querySelector('.project-tab__name');
        const prevTabName   = prevTabNameEl ? prevTabNameEl.textContent : '';
        if (prevNameEl) prevNameEl.textContent = prevTabName;
        this.prevBtn.setAttribute('aria-label', '이전 프로젝트: ' + prevTabName);
      }
    }

    /* next 버튼 */
    if (this.nextBtn) {
      if (currentIndex >= this.tabBtns.length - 1) {
        this.nextBtn.setAttribute('hidden', '');
      } else {
        this.nextBtn.removeAttribute('hidden');
        const nextNameEl    = this.nextBtn.querySelector('.project-tab-nav__name');
        const nextTabNameEl = this.tabBtns[currentIndex + 1].querySelector('.project-tab__name');
        const nextTabName   = nextTabNameEl ? nextTabNameEl.textContent : '';
        if (nextNameEl) nextNameEl.textContent = nextTabName;
        this.nextBtn.setAttribute('aria-label', '다음 프로젝트: ' + nextTabName);
      }
    }
  },


  /* ---- 초기화 ---- */
  init: function () {
    const tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;

    /* section#project 레퍼런스 캐싱 (탭 전환 시 매번 DOM 쿼리 방지) */
    this.section = document.getElementById('project');

    this.tabBtns = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    this.tabPanels = this.tabBtns.map(function (btn) {
      return document.getElementById(btn.getAttribute('aria-controls'));
    });

    /* 이벤트 바인딩 */
    this.tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        /* 드래그 중이었다면 탭 전환 억제 */
        if (ProjectTab.isDragging) return;
        ProjectTab.switchTab(btn);
      });
    });
    tablist.addEventListener('keydown', this.handleKeydown);

    /* 기본 활성 패널(panel-welllife)에 visible 클래스 추가 */
    const defaultPanel = this.tabPanels.find(function (p) {
      return p && !p.hasAttribute('hidden');
    });
    if (defaultPanel) {
      defaultPanel.classList.add('project-tab__panel--visible');
    }

    /* overflow 감지: 탭이 넘칠 때 fade gradient 표시 */
    const wrap = document.querySelector('.project-tab-scroll-wrap');

    function checkOverflow() {
      if (!tablist || !wrap) return;
      if (tablist.scrollWidth > tablist.clientWidth) {
        wrap.classList.add('project-tab-scroll-wrap--overflow');
      } else {
        wrap.classList.remove('project-tab-scroll-wrap--overflow');
      }
    }

    /* 초기 체크 */
    checkOverflow();

    /* 화면 크기 변경 시 재계산 (ResizeObserver) */
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(function () {
        checkOverflow();
      });
      ro.observe(tablist);
    }

    /* 마우스 드래그 스크롤 초기화 */
    this.initDragScroll(tablist);

    /* prev/next 탭 네비게이션 초기화 */
    this.initTabNav();
  }
};

/* ==========================================================================
 * FLUID TYPOGRAPHY SLIDER
 * 반응형 폰트 크기를 시각적으로 표현하는 인터랙티브 슬라이더
 * - 360px → 1920px 뷰포트에서 12px → 52px로 동적 변화
 * - 마우스/터치 드래그 지원
 * - 키보드 내비게이션 (← → Home/End)
 * - 호버 시 모든 breakpoint 툴팁 표시
 * ==========================================================================*/

const FluidTypographySlider = {
  wrapper: null,
  handle: null,
  track: null,
  fillBar: null,
  sample: null,
  sampleText: null,
  sampleSize: null,
  tooltips: [],
  marksContainer: null,
  formulaEl: null,
  formulaMin: null,
  formulaFluid: null,
  formulaMax: null,

  /* ==========================================================================
   * 1. INITIALIZATION
   * ========================================================================== */
  init: function(containerSelector) {
    this.wrapper = document.querySelector(containerSelector);
    if (!this.wrapper) return;

    // DOM 캐시
    this.track = this.wrapper.querySelector('.sonic-typo-slider__track');
    this.handle = this.wrapper.querySelector('.sonic-typo-slider__handle');
    this.fillBar = this.wrapper.querySelector('.sonic-typo-slider__fill');
    // sonic-typo-slider__sample은 sonic-typo-slider__wrapper의 형제이므로 부모를 통해 찾기
    this.sample = this.wrapper.parentElement.querySelector('.sonic-typo-slider__sample');
    this.sampleText = this.sample ? this.sample.querySelector('.sonic-typo-slider__sample-text') : null;
    this.sampleSize = this.sample ? this.sample.querySelector('.sonic-typo-slider__sample-size') : null;
    this.marksContainer = this.wrapper.querySelector('.sonic-typo-slider__marks');
    this.tooltips = Array.from(this.wrapper.querySelectorAll('.sonic-typo-slider__tooltip'));

    // clamp 수식 DOM 캐시 (sonic-typo-slider__wrapper의 형제에서 찾기)
    const visualContainer = this.wrapper.parentElement;
    this.formulaEl    = visualContainer ? visualContainer.querySelector('.sonic-typo-slider__formula') : null;
    this.formulaMin   = this.formulaEl ? this.formulaEl.querySelector('.sonic-typo-slider__formula-min') : null;
    this.formulaFluid = this.formulaEl ? this.formulaEl.querySelector('.sonic-typo-slider__formula-fluid') : null;
    this.formulaMax   = this.formulaEl ? this.formulaEl.querySelector('.sonic-typo-slider__formula-max') : null;
    this.remValueEl   = visualContainer ? visualContainer.querySelector('.sonic-typo-slider__rem-value') : null;

    if (!this.track || !this.handle || !this.fillBar) return;

    // 데이터 속성 파싱
    this.minViewport = parseInt(this.wrapper.getAttribute('data-min'), 10) || 360;
    this.maxViewport = parseInt(this.wrapper.getAttribute('data-max'), 10) || 1440;
    this.minFont = parseInt(this.wrapper.getAttribute('data-min-font'), 10) || 14;
    this.maxFont = parseInt(this.wrapper.getAttribute('data-max-font'), 10) || 24;

    // Breakpoint 파싱
    const breakpointsJson = this.wrapper.getAttribute('data-breakpoints');
    this.breakpoints = [];
    if (breakpointsJson) {
      try {
        this.breakpoints = JSON.parse(breakpointsJson);
      } catch (e) {
        this.breakpoints = [480, 768, 1024, 1280];
      }
    }

    // 상태 초기화
    this.isDragging = false;
    this.currentViewport = this.minViewport;

    // 툴팁 컨테이너 호버 플래그
    this.isHoveringSlider = false;

    // 이벤트 바인딩
    this.bindEvents();

    // 틱 마크 생성
    this.generateMarks();

    // 초기 화면 렌더링: 항상 최댓값(maxViewport)으로 시작
    this.updateSlider(this.maxViewport);
  },

  /* ==========================================================================
   * 2. EVENT BINDING
   * ========================================================================== */
  bindEvents: function() {
    const self = this;

    // 한 번 조작하면 펄스 애니메이션 영구 정지하는 함수
    const setInteracted = function() {
      if (!self.wrapper.classList.contains('is-interacted')) {
        self.wrapper.classList.add('is-interacted');
      }
    };

    // Pointer 이벤트
    this.track.addEventListener('pointerdown', function(e) {
      setInteracted();
      self.isDragging = true;
      self.wrapper.classList.add('is-active'); // 드래그 시작 시 툴팁 표시
      self.onDragStart(e);
    });

    document.addEventListener('pointermove', function(e) {
      if (self.isDragging) {
        self.onDrag(e);
      }
    });

    document.addEventListener('pointerup', function() {
      self.isDragging = false;
      // 드래그 종료 시 hover 상태가 아니면 툴팁 숨김
      if (!self.isHoveringSlider) {
        self.wrapper.classList.remove('is-active');
      }
    });

    // 트랙 클릭 (클릭한 위치로 이동)
    this.track.addEventListener('click', function(e) {
      setInteracted();
      if (self.isDragging) return; // 드래그 중에는 클릭 무시
      self.onTrackClick(e);
    });

    // 핸들 키보드 내비게이션
    this.handle.addEventListener('keydown', function(e) {
      setInteracted();
      self.onKeydown(e);
    });

    // 슬라이더 hover (툴팁 표시)
    this.wrapper.addEventListener('mouseenter', function() {
      self.isHoveringSlider = true;
      self.wrapper.classList.add('is-active');
    });

    this.wrapper.addEventListener('mouseleave', function() {
      self.isHoveringSlider = false;
      // 드래그 중이 아닐 때만 툴팁 숨김
      if (!self.isDragging) {
        self.wrapper.classList.remove('is-active');
      }
    });

    // 터치 이벤트
    this.track.addEventListener('touchstart', function(e) {
      setInteracted();
      self.isDragging = true;
      self.wrapper.classList.add('is-active'); // 터치 시작 시 툴팁 표시
      self.onDragStart(e.touches[0]);
    });

    document.addEventListener('touchmove', function(e) {
      if (self.isDragging) {
        self.onDrag(e.touches[0]);
      }
    });

    document.addEventListener('touchend', function() {
      self.isDragging = false;
      // 터치 종료 시 hover 상태가 아니면 툴팁 숨김
      if (!self.isHoveringSlider) {
        self.wrapper.classList.remove('is-active');
      }
    });
  },

  /* ==========================================================================
   * 3. DRAG HANDLERS
   * ========================================================================== */
  onDragStart: function(e) {
    this.track.style.cursor = 'grabbing';
  },

  onDrag: function(e) {
    const rect = this.track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    const viewport = this.minViewport + (this.maxViewport - this.minViewport) * percentage;
    this.updateSlider(viewport);
  },

  onTrackClick: function(e) {
    const rect = this.track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));

    const viewport = this.minViewport + (this.maxViewport - this.minViewport) * percentage;
    this.updateSlider(viewport);
  },

  /* ==========================================================================
   * 4. KEYBOARD NAVIGATION
   * ========================================================================== */
  onKeydown: function(e) {
    const step = 10; // 10px 단위로 움직임

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        this.currentViewport = Math.min(this.maxViewport, this.currentViewport + step);
        this.updateSlider(this.currentViewport);
        break;

      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        this.currentViewport = Math.max(this.minViewport, this.currentViewport - step);
        this.updateSlider(this.currentViewport);
        break;

      case 'Home':
        e.preventDefault();
        this.updateSlider(this.minViewport);
        break;

      case 'End':
        e.preventDefault();
        this.updateSlider(this.maxViewport);
        break;
    }
  },

  /* ==========================================================================
   * 5. SLIDER UPDATE
   * ========================================================================== */
  updateSlider: function(viewport) {
    this.currentViewport = Math.max(this.minViewport, Math.min(this.maxViewport, viewport));

    // 폰트 크기 계산 (선형 보간)
    const percentage = (this.currentViewport - this.minViewport) / (this.maxViewport - this.minViewport);
    const fontSize = this.minFont + (this.maxFont - this.minFont) * percentage;

    // UI 업데이트
    this.renderUI(percentage, fontSize);
  },

  /* ==========================================================================
   * 6. RENDER UI
   * ========================================================================== */
  renderUI: function(percentage, fontSize) {
    // Fill bar 업데이트
    this.fillBar.style.width = (1 + percentage * 98) + '%';

    // Handle 위치 업데이트
    this.handle.style.left = (1 + percentage * 98) + '%';

    // Sample 텍스트 폰트 크기 업데이트 (null 체크)
    if (this.sampleText) {
      this.sampleText.style.fontSize = fontSize.toFixed(2) + 'px';
    }

    // Sample size 텍스트 업데이트 (null 체크)
    if (this.sampleSize) {
      this.sampleSize.textContent = fontSize.toFixed(1) + 'px';
    }

    // 1rem = Xpx 인디케이터 업데이트 (SonicZero 프로젝트 rem 기준)
    // ≤768px: 14px / ≤1280px: 15px / >1280px: 16px
    if (this.remValueEl) {
      const remPx = this.currentViewport <= 768 ? '14px' : this.currentViewport <= 1280 ? '15px' : '16px';
      this.remValueEl.textContent = remPx;
    }

    // ARIA 속성 업데이트
    this.handle.setAttribute('aria-valuenow', Math.round(this.currentViewport));
    this.handle.setAttribute('aria-valuetext', this.currentViewport.toFixed(0) + 'px viewport');

    // 툴팁 위치 업데이트
    this.updateTooltipPositions(percentage);

    // clamp 수식 하이라이트 업데이트
    this.updateFormulaHighlight(percentage, fontSize);
  },

  /* ==========================================================================
   * 7. TOOLTIP POSITIONING
   * ========================================================================== */
  updateTooltipPositions: function(percentage) {
    const self = this;
    this.tooltips.forEach(function(tooltip) {
      const breakpoint = parseInt(tooltip.getAttribute('data-breakpoint'), 10);
      const breakpointPercentage = (breakpoint - self.minViewport) / (self.maxViewport - self.minViewport);
      tooltip.style.left = (breakpointPercentage * 100) + '%';
      
      // 양 끝 tooltip은 삐져나옴 방지 (CSS 변수로 전달)
      if (breakpoint === self.minViewport) {
        tooltip.style.setProperty('--tooltip-translate-x', '0');
      } else if (breakpoint === self.maxViewport) {
        tooltip.style.setProperty('--tooltip-translate-x', '-100%');
      } else {
        tooltip.style.setProperty('--tooltip-translate-x', '-50%');
      }
    });
  },

  /* ==========================================================================
   * 8. CLAMP FORMULA HIGHLIGHT
   * MIN: 슬라이더가 맨 왼쪽 (minViewport) — clamp의 최솟값이 적용중
   * FLUID: 중간 범위 — vw 기반 유동값이 적용중
   * MAX: 슬라이더가 맨 오른쪽 (maxViewport) — clamp의 최댓값이 적용중
   * ========================================================================== */
  updateFormulaHighlight: function(percentage, fontSize) {
    if (!this.formulaEl) return;

    const atMin   = percentage <= 0;
    const atMax   = percentage >= 1;
    const isFluid = !atMin && !atMax;

    // 활성 클래스 토글
    if (this.formulaMin)   this.formulaMin.classList.toggle('sonic-typo-slider__formula-min--active', atMin);
    if (this.formulaFluid) this.formulaFluid.classList.toggle('sonic-typo-slider__formula-fluid--active', isFluid);
    if (this.formulaMax)   this.formulaMax.classList.toggle('sonic-typo-slider__formula-max--active', atMax);

    // 부모에 has-active 클래스 → 비활성 세그먼트 dimming
    this.formulaEl.classList.toggle('sonic-typo-slider__formula--has-active', true);

    // sample-size 색상을 활성 구간(min/fluid/max)에 맞춰 동기화
    // formula 색상과 동일한 색으로 → "이 공식이 이 숫자를 만든다"는 인과관계를 직관적으로 전달
    if (this.sampleSize) {
      this.sampleSize.style.color = atMin
        ? 'var(--color-soniczero-text-main)'   // MIN: 흰색 (formula-min 색상)
        : atMax
          ? 'var(--color-soniczero-positive)'  // MAX: 초록 (formula-max 색상)
          : 'var(--color-soniczero-primary)';  // FLUID: 파란 (formula-fluid 색상)
    }
  },

  /* ==========================================================================
   * 9. TICK MARKS GENERATION
   * ========================================================================== */
  generateMarks: function() {
    if (!this.marksContainer) return;

    // 마크 제거 (재초기화 방지)
    this.marksContainer.innerHTML = '';

    const self = this;
    let allPoints = [this.minViewport, ...this.breakpoints, this.maxViewport];

    // 중복 제거 및 정렬
    allPoints = [...new Set(allPoints)].sort(function(a, b) {
      return a - b;
    });

    // 큰 눈금만 생성 (주요 breakpoint)
    allPoints.forEach(function(viewport, index) {
      const mark = document.createElement('div');
      mark.className = 'sonic-typo-slider__mark';
      const percentage = ((viewport - self.minViewport) / (self.maxViewport - self.minViewport) * 100).toFixed(2);
      
      // 양 끝 마크는 border-radius 영역 안쪽으로 약간 이동 (1% 여유)
      if (index === 0) {
        mark.style.left = '1%';
        mark.style.transform = 'translateX(0)';
      } else if (index === allPoints.length - 1) {
        mark.style.left = '99%';
        mark.style.transform = 'translateX(-100%)';
      } else {
        mark.style.left = percentage + '%';
        mark.style.transform = 'translateX(-50%)';
      }
      
      self.marksContainer.appendChild(mark);
    });
  }
};

/* ==========================================================================
 * PAGES TAB
 * sonic-overview__item--pages 내부 탭 전환 로직
 * - ProjectTab과 독립적으로 동작 (scope: .sonic-overview__item--pages)
 * - 단순 click 이벤트 + --active 클래스 토글
 * ========================================================================== */
function initPagesTab() {
  var container = document.querySelector('.sonic-overview__item--pages');
  if (!container) return;

  var btns = container.querySelectorAll('.sonic-pages-tab__btn');
  var panels = container.querySelectorAll('.sonic-pages-panel');

  btns.forEach(function(btn, i) {
    btn.addEventListener('click', function() {
      /* 이미 활성 버튼 클릭 시 무시 */
      if (btn.classList.contains('sonic-pages-tab__btn--active')) return;

      /* 모든 버튼 비활성화 */
      btns.forEach(function(b) {
        b.classList.remove('sonic-pages-tab__btn--active');
      });

      /* 모든 패널 숨김 */
      panels.forEach(function(p) {
        p.classList.remove('sonic-pages-panel--active');
      });

      /* 클릭한 버튼·패널 활성화 */
      btn.classList.add('sonic-pages-tab__btn--active');
      if (panels[i]) {
        panels[i].classList.add('sonic-pages-panel--active');
      }
    });
  });
}


/* ==========================================================================
 * LIGHTHOUSE GAUGE ANIMATION
 * SVG stroke-dashoffset 카운트업 + 숫자 카운트업
 * - 둘레: 2π × r(46) ≈ 289.03
 * - IntersectionObserver로 뷰포트 진입 시 1회 실행
 * ==========================================================================*/
var LighthouseGauge = {
  CIRCUMFERENCE: 289.03, /* 2π × 46 */
  DURATION: 1200,        /* ms */

  /* easeOutCubic */
  ease: function (t) {
    return 1 - Math.pow(1 - t, 3);
  },

  /* 개별 게이지 애니메이션 실행 */
  animateGauge: function (gauge) {
    var ring = gauge.querySelector('.sonic-lighthouse__gauge-ring');
    var scoreEl = gauge.querySelector('.sonic-lighthouse__gauge-score');
    if (!ring || !scoreEl) return;

    var score = parseInt(ring.getAttribute('data-score'), 10) || 0;
    var targetOffset = this.CIRCUMFERENCE * (1 - score / 100);
    var startTime = null;
    var self = this;

    /* prefers-reduced-motion: reduce 감지 시 애니메이션 즉시 종료 */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ring.style.strokeDashoffset = targetOffset;
      scoreEl.textContent = score;
      return;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / self.DURATION, 1);
      var easedProgress = self.ease(progress);

      /* stroke-dashoffset 애니메이션 */
      ring.style.strokeDashoffset = self.CIRCUMFERENCE - (self.CIRCUMFERENCE - targetOffset) * easedProgress;

      /* 숫자 카운트업 */
      scoreEl.textContent = Math.round(score * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        scoreEl.textContent = score;
      }
    }

    requestAnimationFrame(step);
  },

  init: function () {
    var gaugesContainer = document.querySelector('.sonic-lighthouse__gauges');
    if (!gaugesContainer) return;

    /* IntersectionObserver 미지원 브라우저: 즉시 실행 */
    if (!('IntersectionObserver' in window)) {
      var gauges = gaugesContainer.querySelectorAll('.sonic-lighthouse__gauge');
      var self = this;
      gauges.forEach(function (gauge) {
        self.animateGauge(gauge);
      });
      return;
    }

    var self = this;
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var gauges = entry.target.querySelectorAll('.sonic-lighthouse__gauge');
        gauges.forEach(function (gauge) {
          self.animateGauge(gauge);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    observer.observe(gaugesContainer);
  }
};


/* ==========================================================================
 * MOCKUP LIGHTBOX DYNAMIC CONTROL (Factory)
 * 화면 크기에 따라 PC/Tablet/Mobile 목업 링크를 동적 전환
 * (project 섹션 전용 기능 — main.js에서 이동)
 * ==========================================================================*/
function createMockupLightbox(config) {
  // HTML에서 읽은 초기 href / data-type 캐시 (init 시 1회 저장)
  const _originalStates = {};

  return {
    // 요소 선택
    getElements: function () {
      return {
        pcMockup:     document.querySelector(config.selectors.pc),
        tabletMockup: document.querySelector(config.selectors.tablet),
        mobileMockup: document.querySelector(config.selectors.mobile)
      };
    },

    // HTML의 초기 상태를 캐싱 (href, data-type)
    _cacheOriginalStates: function () {
      const elements = this.getElements();
      const typeMap = { pc: elements.pcMockup, tablet: elements.tabletMockup, mobile: elements.mobileMockup };
      for (const [type, el] of Object.entries(typeMap)) {
        if (!el) continue;
        const link = el.querySelector('a');
        if (link) {
          _originalStates[type] = {
            href:     link.getAttribute('href'),
            dataType: link.getAttribute('data-type')
          };
        }
      }
    },

    // lightbox 속성 적용 (PC href로 통일, data-lightbox + data-type 부착)
    applyLightbox: function (element) {
      if (element && !element.hasAttribute('data-lightbox')) {
        element.setAttribute('data-lightbox', '');
        const link = element.querySelector('a');
        if (link) {
          if (_originalStates['pc']) {
            link.setAttribute('href', _originalStates['pc'].href);
          }
          link.setAttribute('data-type', 'iframe');
          if (typeof CustomLightbox !== 'undefined') {
            link.addEventListener('click', function(e) {
              e.preventDefault();
              CustomLightbox.open(this);
            });
          }
        }
      }
    },

    // lightbox 속성 제거 및 캐싱된 원래 상태 복원
    removeLightbox: function (element, type) {
      if (element && element.hasAttribute('data-lightbox')) {
        element.removeAttribute('data-lightbox');
        const link = element.querySelector('a');
        if (link) {
          const original = _originalStates[type];
          if (original) {
            link.setAttribute('href', original.href);
            if (original.dataType) {
              link.setAttribute('data-type', original.dataType);
            } else {
              link.removeAttribute('data-type');
            }
          }
        }
      }
    },

    // 비활성화 클래스 적용 (접근성: tabindex, aria-disabled 함께 처리)
    setDisabled: function (element, disabled, shrink = false) {
      if (!element) return;
      const link = element.querySelector('a');
      if (disabled) {
        element.classList.add('web-mockup__total-item--disabled');
        if (shrink) {
          element.classList.add('web-mockup__total-item--shrink');
        } else {
          element.classList.remove('web-mockup__total-item--shrink');
        }
        if (link) {
          link.setAttribute('tabindex', '-1');
          link.setAttribute('aria-disabled', 'true');
        }
      } else {
        element.classList.remove('web-mockup__total-item--disabled');
        element.classList.remove('web-mockup__total-item--shrink');
        if (link) {
          link.removeAttribute('tabindex');
          link.removeAttribute('aria-disabled');
        }
      }
    },

    // 화면 크기에 따라 lightbox 동적 적용
    update: function () {
      const elements = this.getElements();
      if (!elements.pcMockup) return;

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      if (isMobile) {
        this.removeLightbox(elements.pcMockup, 'pc');
        this.removeLightbox(elements.tabletMockup, 'tablet');
        this.applyLightbox(elements.mobileMockup);
        this.setDisabled(elements.pcMockup, true, false);
        this.setDisabled(elements.tabletMockup, true, false);
        this.setDisabled(elements.mobileMockup, false);
      } else if (isTablet) {
        this.removeLightbox(elements.pcMockup, 'pc');
        this.applyLightbox(elements.tabletMockup);
        this.removeLightbox(elements.mobileMockup, 'mobile');
        this.setDisabled(elements.pcMockup, true, false);
        this.setDisabled(elements.tabletMockup, false);
        this.setDisabled(elements.mobileMockup, true, true);
      } else {
        this.applyLightbox(elements.pcMockup);
        this.removeLightbox(elements.tabletMockup, 'tablet');
        this.removeLightbox(elements.mobileMockup, 'mobile');
        this.setDisabled(elements.pcMockup, false);
        this.setDisabled(elements.tabletMockup, false);
        this.setDisabled(elements.mobileMockup, false);
      }
    },

    // 초기화
    init: function () {
      this._cacheOriginalStates();
      this.update();
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.update(), 100);
      });
    }
  };
}

/* 웰라이프내과의원 목업 Lightbox 인스턴스 */
const WelllifeMockupLightbox = createMockupLightbox({
  selectors: {
    pc:     '.web-mockup__total--pc',
    tablet: '.web-mockup__total--tablet',
    mobile: '.web-mockup__total--mobile'
  }
});

/* SonicZero 목업 Lightbox 인스턴스 */
const SonicZeroMockupLightbox = createMockupLightbox({
  selectors: {
    pc:     '.soniczero-mockup--pc',
    tablet: '.soniczero-mockup--tablet',
    mobile: '.soniczero-mockup--mobile'
  }
});


/* ==========================================================================
 * INITIALIZATION ON DOM READY
 * ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
  // ProjectTab 초기화
  ProjectTab.init();

  // FluidTypographySlider 초기화
  FluidTypographySlider.init('.sonic-typo-slider__wrapper');

  // PagesTab 초기화
  initPagesTab();

  // LighthouseGauge 초기화
  LighthouseGauge.init();

  /* 목업 Lightbox 초기화 */
  WelllifeMockupLightbox.init();
  SonicZeroMockupLightbox.init();
});

