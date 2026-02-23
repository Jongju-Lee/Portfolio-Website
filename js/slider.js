/* ############### Custom UI Slider (Vanilla JS) ############### */

// 슬라이더 기기별 해상도(Breakpoint) 및 레이아웃 설정
const SLIDER_RESPONSIVE_CONFIG = [
  { max: 480, itemsPerView: 2, gap: 12 },
  { max: 768, itemsPerView: 2, gap: 16 },
  { max: 1024, itemsPerView: 3, gap: 20 },
  { max: Infinity, itemsPerView: 4, gap: 24 }
];

document.addEventListener('DOMContentLoaded', function () {
  const sliders = document.querySelectorAll('.ui-slider');

  sliders.forEach(function (slider) {
    const wrapper = slider.querySelector('.ui-slider__wrapper');
    const items = Array.from(wrapper.querySelectorAll('.ui-slider__item'));
    const prevBtn = slider.querySelector('.slider-nav__btn--prev');
    const nextBtn = slider.querySelector('.slider-nav__btn--next');
    const dotsContainer = slider.querySelector('.slider-nav__dots');

    if (!wrapper || items.length === 0) return;

    let currentGroupIndex = 0;
    let itemsPerView = 4;
    let gap = 24;
    let totalGroups = 0;
    let shadowTimeout;

    // 슬라이더 동작중에는 그림자가 잘려보이거나 갑자기 사라지면 어색하므로 잠시 해제
    function clearVisibilityConstraints() {
      items.forEach(function (item) {
        item.classList.remove('ui-slider__item--invisible');
      });
    }

    // 슬라이더가 이동을 멈추고 제자리에 있을 때, 완전히 바깥에 나간 아이템들을 투명하게 처리 (Iframe GPU 렌더링 버그 방어)
    function applyVisibilityConstraints() {
      const startItemIndex = currentGroupIndex * itemsPerView;
      items.forEach(function (item, index) {
        if (index < startItemIndex || index >= startItemIndex + itemsPerView) {
          // 화면에 보이지 않는 아이템 완전 투명화
          item.classList.add('ui-slider__item--invisible');
        } else {
          // 화면 내에 보이는 아이템 정상 출력
          item.classList.remove('ui-slider__item--invisible');
        }
      });
    }

    // 초기 레이아웃 구조 세팅
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'nowrap';
    wrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'; // 부드러운 그룹 이동

    function updateLayout() {
      const width = window.innerWidth;
      
      // SLIDER_RESPONSIVE_CONFIG 배열에서 현재 화면 너비보다 크거나 같은 첫 번째 설정값을 찾아 적용
      const config = SLIDER_RESPONSIVE_CONFIG.find(item => width <= item.max) || SLIDER_RESPONSIVE_CONFIG[SLIDER_RESPONSIVE_CONFIG.length - 1];
      itemsPerView = config.itemsPerView;
      gap = config.gap;

      // 그룹 페이징 계산 (예: 6개 아이템이면 PC(4)에선 2그룹, 모바일(2)에선 3그룹)
      totalGroups = Math.ceil(items.length / itemsPerView);
      
      if (currentGroupIndex >= totalGroups) {
        currentGroupIndex = totalGroups - 1;
      }
      if (currentGroupIndex < 0) currentGroupIndex = 0;

      wrapper.style.gap = gap + 'px';
      
      // 보여지는 화면 컨테이너 너비
      // 보여지는 화면 컨테이너 너비 (slider의 안쪽 padding을 제외한 실제 콘텐츠 영역 너비)
      // JS에서 clientWidth는 padding을 포함하므로, css에서 지정한 양옆 패딩(16px * 2)을 빼주어야 실제 가용 너비가 됨
      const computedStyle = window.getComputedStyle(slider);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const containerWidth = slider.clientWidth - paddingLeft - paddingRight;
      
      // 아이템 한 개의 너비 = (실제 가용 너비 - (보여질아이템수 - 1) * 갭) / 보여질아이템수
      const itemWidth = (containerWidth - (gap * (itemsPerView - 1))) / itemsPerView;

      items.forEach(function (item) {
        item.style.flex = '0 0 ' + itemWidth + 'px';
        item.style.width = itemWidth + 'px';
      });

      renderDots();
      goToGroup(currentGroupIndex, false);
      applyVisibilityConstraints();
    }

    // Dot(닷) 생성 로직 (아이템 개수 단위가 아닌 그룹 단위)
    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      
      if (totalGroups <= 1) return;

      for (let i = 0; i < totalGroups; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-nav__dot';
        if (i === currentGroupIndex) dot.classList.add('slider-nav__dot--active');
        dot.setAttribute('aria-label', (i + 1) + '번째 그룹');
        
        dot.addEventListener('click', function (e) {
          e.stopPropagation();
          goToGroup(i);
        });
        
        dotsContainer.appendChild(dot);
      }
    }

    // Dot 활성화 UI 갱신
    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.slider-nav__dot');
      dots.forEach(function (dot, i) {
        if (i === currentGroupIndex) {
          dot.classList.add('slider-nav__dot--active');
        } else {
          dot.classList.remove('slider-nav__dot--active');
        }
      });
    }

    // 인덱스 기반으로 뷰 이동
    function goToGroup(index, animate = true) {
      if (index < 0) {
        index = totalGroups - 1; // 무한 루프 (첫 페이지에서 이전 누르면 마지막으로)
      } else if (index >= totalGroups) {
        index = 0; // 무한 루프 (마지막에서 다음 누르면 처음으로)
      }

      currentGroupIndex = index;

      wrapper.style.transition = animate ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
      
      if (animate) {
        clearVisibilityConstraints();
        clearTimeout(shadowTimeout);
        shadowTimeout = setTimeout(applyVisibilityConstraints, 400); // 트랜지션 완료(0.4s) 시점 적용
      } else {
        applyVisibilityConstraints();
      }
      
      if (items.length > 0) {
        const itemWidth = items[0].offsetWidth;
        // 그룹의 첫 아이템 인덱스
        const startItemIndex = currentGroupIndex * itemsPerView;
        
        // 마지막 그룹 보정: 빈 공간이 생기지 않도록, 마지막 페이지에서는 아이템 개수 초과 시 우측 정렬 느낌으로 이동
        let translateIndex = startItemIndex;
        if (startItemIndex + itemsPerView > items.length) {
          translateIndex = items.length - itemsPerView; 
        }

        const translateX = -(translateIndex * (itemWidth + gap));
        wrapper.style.transform = 'translate3d(' + translateX + 'px, 0, 0)';
      }

      updateDots();
    }

    // 이전/다음 버튼 이벤트
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goToGroup(currentGroupIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goToGroup(currentGroupIndex + 1);
      });
    }

    // -------- 터치/스와이프 드래그 구현 --------
    let isDragging = false;
    let preventClick = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function touchStart(event) {
      isDragging = true;
      preventClick = false; // 드래그 시작 시 초기화
      clearVisibilityConstraints();
      startPos = getPositionX(event);
      wrapper.style.transition = 'none';
      wrapper.style.cursor = 'grabbing';
      
      const itemWidth = items[0].offsetWidth;
      let translateIndex = currentGroupIndex * itemsPerView;
      if (translateIndex + itemsPerView > items.length) {
        translateIndex = items.length - itemsPerView; 
      }
      prevTranslate = -(translateIndex * (itemWidth + gap));
    }

    function touchMove(event) {
      if (!isDragging) return;
      const currentPosition = getPositionX(event);
      const diff = currentPosition - startPos;
      
      // 임계값(Threshold) 5px 이상 스와이프하면 클릭 차단 활성화
      if (Math.abs(diff) > 5) {
        preventClick = true;
      }
      
      currentTranslate = prevTranslate + diff;
      wrapper.style.transform = 'translate3d(' + currentTranslate + 'px, 0, 0)';
    }

    function touchEnd() {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = 'grab';
      
      const movedBy = currentTranslate - prevTranslate;
      
      // 한 화면 너비의 20% 이상 스와이프했을 경우 그룹 전환
      if (items.length > 0) {
        const threshold = slider.clientWidth * 0.2;
        if (movedBy < -threshold) {
          goToGroup(currentGroupIndex + 1);
        } else if (movedBy > threshold) {
          goToGroup(currentGroupIndex - 1);
        } else {
          // 제자리 스냅 복구
          goToGroup(currentGroupIndex);
        }
      }
      prevTranslate = 0;
    }

    // 드래그 중 발생한 클릭(링크 이동 등)을 캡처링 단계에서 원천 차단
    wrapper.addEventListener('click', function(e) {
      if (preventClick) {
        e.preventDefault();
        e.stopPropagation();
        preventClick = false; // 한 번 막은 후에는 상태 초기화
      }
    }, true);

    // 네이티브 이미지 요소 드래그 방지
    items.forEach(function (item) {
      const img = item.querySelector('img');
      if (img) img.addEventListener('dragstart', function(e) { e.preventDefault(); });
      
      const aTag = item.tagName.toLowerCase() === 'a' ? item : item.querySelector('a');
      if (aTag) aTag.addEventListener('dragstart', function(e) { e.preventDefault(); });
    });

    wrapper.addEventListener('mousedown', touchStart);
    wrapper.addEventListener('touchstart', touchStart, { passive: true });

    wrapper.addEventListener('mousemove', function(e) {
      if (isDragging) e.preventDefault();
      touchMove(e);
    });
    wrapper.addEventListener('touchmove', function(e) {
      if (isDragging) {
        const diffX = Math.abs(e.touches[0].clientX - startPos);
        if (diffX > 10) e.preventDefault(); 
      }
      touchMove(e);
    }, { passive: false });

    wrapper.addEventListener('mouseup', touchEnd);
    wrapper.addEventListener('mouseleave', function() {
      if (isDragging) touchEnd();
    });
    wrapper.addEventListener('touchend', touchEnd);

    wrapper.style.cursor = 'grab';

    // 화면 Resize 디바운스
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateLayout, 150);
    });

    // 시작
    updateLayout();
  });
});
