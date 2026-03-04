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


  /* ------
   * 탭 전환
   * ------ */
  switchTab: function (targetBtn) {
    var targetPanelId = targetBtn.getAttribute('aria-controls');
    var targetPanel = document.getElementById(targetPanelId);
    if (!targetPanel) return;

    var currentBtn = this.tabBtns.find(function (btn) {
      return btn.getAttribute('aria-selected') === 'true';
    });
    var currentPanel = currentBtn
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
      var panelToHide = currentPanel;
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
      if (targetPanelId === 'panel-taskflow') {
        this.section.classList.add('panel-taskflow-active');
      } else {
        this.section.classList.remove('panel-taskflow-active');
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
  },


  /* --------------------------------
   * 첫 활성화 시 1회 애니메이션 트리거
   * -------------------------------- */
  triggerPanelAnimation: function (panel) {
    /* data-tab-animated 속성이 이미 있으면 재발동 안 함 */
    if (panel.hasAttribute('data-tab-animated')) return;

    /* 해당 패널의 [data-anim] 요소에 is-animated 클래스 추가 */
    var animEls = panel.querySelectorAll('[data-anim]:not(.is-animated)');
    animEls.forEach(function (el) {
      /* data-anim-delay 속성 처리 */
      var delay = el.getAttribute('data-anim-delay');
      if (delay) {
        el.style.transitionDelay = delay + 'ms';
        var delayNum = parseInt(delay, 10);
        var duration = 1500; /* CSS transition duration (1.5s) */
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
    var currentIndex = ProjectTab.tabBtns.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    var newIndex = currentIndex;
    var total = ProjectTab.tabBtns.length;

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
    var self = this;
    var DRAG_THRESHOLD = 5; /* px — 이 이상 움직여야 드래그로 판정 */

    tablist.addEventListener('mousedown', function (e) {
      self.dragIsDown = true;
      self.isDragging = false;
      self.dragStartX = e.pageX - tablist.getBoundingClientRect().left;
      self.dragScrollLeft = tablist.scrollLeft;
    });

    /* mousemove: 탭 바 내 + 탭 바 밖 모두 감지하기 위해 document에 등록 */
    document.addEventListener('mousemove', function (e) {
      if (!self.dragIsDown) return;
      var x = e.pageX - tablist.getBoundingClientRect().left;
      var walk = x - self.dragStartX;

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



  /* ---- 초기화 ---- */
  init: function () {
    var tablist = document.querySelector('[role="tablist"]');
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
    var defaultPanel = this.tabPanels.find(function (p) {
      return p && !p.hasAttribute('hidden');
    });
    if (defaultPanel) {
      defaultPanel.classList.add('project-tab__panel--visible');
    }

    /* overflow 감지: 탭이 넘칠 때 fade gradient 표시 */
    var wrap = document.querySelector('.project-tab-scroll-wrap');

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
      var ro = new ResizeObserver(function () {
        checkOverflow();
      });
      ro.observe(tablist);
    }

    /* 마우스 드래그 스크롤 초기화 */
    this.initDragScroll(tablist);
  }
};


/* DOMContentLoaded 후 초기화 */
document.addEventListener('DOMContentLoaded', function () {
  ProjectTab.init();
});
