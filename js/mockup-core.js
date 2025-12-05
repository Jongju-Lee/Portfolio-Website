/**
 * Mockup Core Module
 * 목업 페이지의 공통 기능을 제공하는 모듈
 * 
 * 사용법:
 * <script src="/js/mockup-core.js"></script>
 * <script>
 *   MockupCore.init({
 *     mockupHeight: 923,           // 목업 높이 (px)
 *     viewportPadding: 160,        // 뷰포트 패딩 (기본: 160)
 *     enableAutoScale: true,       // 뷰포트 감지 자동 스케일 (기본: true)
 *     enableDarkModeSync: false,   // 다크모드 동기화 (기본: false)
 *     enableBackButtonHandler: false, // PDF 진입 뒤로가기 처리 (기본: false)
 *     backButtonFallbackUrl: ''    // 뒤로가기 기본 URL
 *   });
 * </script>
 */

(function () {
    'use strict';

    // ------------------------------
    // 유틸리티 함수
    // ------------------------------
    const roundToOneDecimal = (value) => Math.round(value * 10) / 10;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    // ------------------------------
    // 기본 설정값
    // ------------------------------
    const DEFAULTS = {
        mockupHeight: 923,
        viewportPadding: 160,
        minScale: 0.5,
        maxScale: 1.0,
        stepScale: 0.1,
        enableAutoScale: true,
        enableDarkModeSync: false,
        enableBackButtonHandler: false,
        backButtonFallbackUrl: ''
    };

    // ------------------------------
    // 메인 모듈
    // ------------------------------
    window.MockupCore = {
        init: function (userConfig = {}) {
            // 설정 병합
            const config = { ...DEFAULTS, ...userConfig };

            document.addEventListener('DOMContentLoaded', function () {
                // 스케일 컨트롤 초기화
                initScaleControl(config);

                // 다크모드 동기화 (옵션)
                if (config.enableDarkModeSync) {
                    initDarkModeSync();
                }

                // 뒤로가기 버튼 핸들러 (옵션)
                if (config.enableBackButtonHandler) {
                    initBackButtonHandler(config.backButtonFallbackUrl);
                }
            });
        }
    };

    // ------------------------------
    // 스케일 컨트롤 기능
    // ------------------------------
    function initScaleControl(config) {
        const mockupElement = document.querySelector('.mockup');
        const increaseScaleButton = document.querySelector('.scale-control__button--increase');
        const decreaseScaleButton = document.querySelector('.scale-control__button--decrease');
        const sliderBoxInner = document.querySelector('.scale-control__slider-box-inner');
        const nextScaleText = document.querySelector('.scale-control__value--next');
        const previousScaleText = document.querySelector('.scale-control__value--prev');
        const sliderItem = document.querySelector('.scale-control__slider-box-item');

        // 필수 요소 확인
        const hasScaleControls = !!(
            mockupElement &&
            increaseScaleButton &&
            decreaseScaleButton &&
            sliderBoxInner
        );

        if (!hasScaleControls) return;

        // 설정값 추출
        const MIN_SCALE = config.minScale;
        const MAX_SCALE = config.maxScale;
        const STEP_SCALE = config.stepScale;
        const MOCKUP_HEIGHT = config.mockupHeight;
        const VIEWPORT_PADDING = config.viewportPadding;
        const ENABLE_AUTO_SCALE = config.enableAutoScale;

        let currentScale = MAX_SCALE;
        let sliderItemHeight = 64;

        // 슬라이더 아이템 높이 측정
        const measureSliderHeight = () => {
            if (sliderItem) {
                const computedHeight = parseFloat(getComputedStyle(sliderItem).height);
                sliderItemHeight = isNaN(computedHeight) ? 64 : computedHeight;
            }
        };

        // 뷰포트 크기에 맞는 최적 스케일 계산
        const calculateOptimalScale = () => {
            const viewportHeight = window.innerHeight;
            const availableHeight = viewportHeight - VIEWPORT_PADDING;

            let optimalScale = (availableHeight / MOCKUP_HEIGHT) + 0.1;
            optimalScale = clamp(optimalScale, MIN_SCALE, MAX_SCALE);
            optimalScale = Math.floor(optimalScale * 10) / 10;

            return optimalScale;
        };

        // UI 업데이트
        const renderScaleUI = (targetScale) => {
            const clamped = clamp(targetScale, MIN_SCALE, MAX_SCALE);
            const rounded = roundToOneDecimal(clamped);

            // 1) Mockup에 스케일 적용
            mockupElement.style.transform = `scale(${rounded})`;

            // 2) Slider 박스 이동
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

        // 스케일 변경 헬퍼
        const changeScaleBy = (delta) => {
            renderScaleUI(currentScale + delta);
        };

        // 초기 렌더링
        const initialScale = ENABLE_AUTO_SCALE ? calculateOptimalScale() : MAX_SCALE;
        renderScaleUI(initialScale);

        // 버튼 이벤트 등록
        increaseScaleButton.addEventListener('click', function () {
            changeScaleBy(STEP_SCALE);
        });

        decreaseScaleButton.addEventListener('click', function () {
            changeScaleBy(-STEP_SCALE);
        });

        // 세로 스크롤 중앙 정렬
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

        // 이미지/폰트 로딩 이후 중앙 정렬
        window.addEventListener('load', function () {
            measureSliderHeight();
            requestAnimationFrame(centerInitialScrollVertically);
            setTimeout(centerInitialScrollVertically, 150);
        });
    }

    // ------------------------------
    // 다크모드 동기화 기능
    // ------------------------------
    function initDarkModeSync() {
        const container = document.querySelector('.mockup-container');
        const iframe = document.querySelector('.mockup-iframe__wrap iframe');

        if (!container || !iframe) return;

        const applyThemeToContainer = (themeValue) => {
            if (themeValue) {
                container.setAttribute('data-theme', themeValue);
            } else {
                container.removeAttribute('data-theme');
            }
        };

        const startObservingIframeTheme = () => {
            try {
                const docEl = iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.documentElement;
                if (!docEl) return;

                // 초기 상태 반영
                applyThemeToContainer(docEl.getAttribute('data-theme'));

                // 변화 감지
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                            applyThemeToContainer(docEl.getAttribute('data-theme'));
                        }
                    }
                });

                observer.observe(docEl, { attributes: true, attributeFilter: ['data-theme'] });
            } catch (error) {
                // 교차 출처 등 접근 불가 시 무시
            }
        };

        if (iframe.complete) {
            startObservingIframeTheme();
        } else {
            iframe.addEventListener('load', startObservingIframeTheme, { once: true });
        }
    }

    // ------------------------------
    // 뒤로가기 버튼 핸들러 (PDF 진입 지원)
    // ------------------------------
    function initBackButtonHandler(fallbackUrl) {
        const backButton = document.querySelector('.back-btn');

        if (!backButton) return;

        backButton.addEventListener('click', function (e) {
            e.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const isFromPdf = urlParams.get('from') === 'pdf';

            if (isFromPdf) {
                window.history.back();
            } else {
                window.location.href = fallbackUrl || '/';
            }
        });
    }

})();
