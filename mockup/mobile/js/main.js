// ------------------------------
// 유틸리티 함수
// ------------------------------
const roundToOneDecimal = (value) => Math.round(value * 10) / 10;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

document.addEventListener('DOMContentLoaded', function () {
  // ------------------------------
  // Mockup 스케일 컨트롤 기능
  // ------------------------------
  const mockupElement = document.querySelector('.mockup');
  const increaseScaleButton = document.querySelector('.scale-control__button--increase');
  const decreaseScaleButton = document.querySelector('.scale-control__button--decrease');
  const sliderBoxInner = document.querySelector('.scale-control__slider-box-inner');
  const nextScaleText = document.querySelector('.scale-control__value--next');
  const previousScaleText = document.querySelector('.scale-control__value--prev');
  const sliderItem = document.querySelector('.scale-control__slider-box-item');

  // 필수 요소가 모두 있는 경우에만 동작
  const hasScaleControls = !!(
    mockupElement &&
    increaseScaleButton &&
    decreaseScaleButton &&
    sliderBoxInner
  );

  if (hasScaleControls) {
    // 스케일 제어 상수
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 1.0;
    const STEP_SCALE = 0.1;
    const INITIAL_SCALE = 1.0;

    let currentScale = INITIAL_SCALE;
    let sliderItemHeight = 64; // 기본값으로 초기화

    // 페이지 로딩 완료 후 실제 높이값 측정
    const measureSliderHeight = () => {
      if (sliderItem) {
        const computedHeight = parseFloat(getComputedStyle(sliderItem).height);
        sliderItemHeight = isNaN(computedHeight) ? 64 : computedHeight;
      }
    };

    // 현재 스케일을 기준으로 UI 전체를 업데이트
    const renderScaleUI = (targetScale) => {
      const clamped = clamp(targetScale, MIN_SCALE, MAX_SCALE);
      const rounded = roundToOneDecimal(clamped);

      // 1) Mockup에 스케일 적용
      mockupElement.style.transform = `scale(${rounded})`;

      // 2) Slider 박스 이동 (동적 높이 계산)
      const getSliderPosition = (scale) => {
        const scaleIndex = Math.round((1.0 - scale) / STEP_SCALE);
        return -(sliderItemHeight * scaleIndex);
      };

      const translateY = getSliderPosition(rounded);
      sliderBoxInner.style.transform = `translateY(${translateY}px)`;

      // 3) 인접 값 표시 업데이트
      if (nextScaleText) {
        const next = roundToOneDecimal(rounded + STEP_SCALE);
        nextScaleText.textContent = next > MAX_SCALE ? '' : next.toFixed(1);
      }

      if (previousScaleText) {
        const prev = roundToOneDecimal(rounded - STEP_SCALE);
        previousScaleText.textContent = prev < MIN_SCALE ? '' : prev.toFixed(1);
      }

      // 4) 버튼 상태 업데이트
      increaseScaleButton.disabled = rounded >= MAX_SCALE;
      decreaseScaleButton.disabled = rounded <= MIN_SCALE;

      currentScale = rounded;
    };

    // 스케일을 delta만큼 변경하는 헬퍼
    const changeScaleBy = (delta) => {
      renderScaleUI(currentScale + delta);
    };

    // 초기 렌더링
    renderScaleUI(currentScale);

    // 버튼 이벤트 등록
    increaseScaleButton.addEventListener('click', function () {
      changeScaleBy(STEP_SCALE);
    });

    decreaseScaleButton.addEventListener('click', function () {
      changeScaleBy(-STEP_SCALE);
    });

    // 초기 로딩 시 세로 스크롤을 중앙으로 이동
    const centerInitialScrollVertically = () => {
      try {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }

        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight
        );
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const maxScrollable = Math.max(0, documentHeight - viewportHeight);

        const targetTop = Math.floor(maxScrollable / 2);

        if (maxScrollable > 0) {
          window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' });
        }
      } catch (error) {
        console.warn('초기 스크롤 중앙 정렬 중 오류:', error);
      }
    };

    // 이미지/폰트 로딩 이후 안정화된 레이아웃에서 중앙 정렬 시도
    window.addEventListener('load', function () {
      measureSliderHeight();
      requestAnimationFrame(centerInitialScrollVertically);
      setTimeout(centerInitialScrollVertically, 150);
    });
  }
});
