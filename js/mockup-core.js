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
        enableIframeScrollIsolation: true, // iframe 앵커 스크롤 시 부모 스크롤 격리
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

                // iframe 앵커 스크롤 격리 (옵션)
                if (config.enableIframeScrollIsolation) {
                    initIframeScrollIsolation();
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

        // 슬라이더 아이템 동적 생성 (MAX → MIN 순서)
        const generateSliderItems = () => {
            sliderBoxInner.innerHTML = '';

            for (let scale = MAX_SCALE; scale >= MIN_SCALE - 0.001; scale -= STEP_SCALE) {
                const rounded = roundToOneDecimal(scale);
                const item = document.createElement('div');
                item.classList.add('scale-control__slider-box-item');

                // 각 자릿수를 개별 <span>으로 생성 (기존 HTML 구조 유지)
                const scaleStr = rounded.toFixed(1);
                scaleStr.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    item.appendChild(span);
                });

                sliderBoxInner.appendChild(item);
            }
        };

        generateSliderItems();

        // 슬라이더 아이템 높이 측정 (동적 생성 후 조회)
        const sliderItem = sliderBoxInner.querySelector('.scale-control__slider-box-item');
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
                const scaleIndex = Math.round((MAX_SCALE - scale) / STEP_SCALE);
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

        // 세로 스크롤 중앙 정렬 + Fade-in (검증 루프 방식)
        let scrollAttempts = 0;
        const MAX_SCROLL_ATTEMPTS = 10;
        const SCROLL_CHECK_INTERVAL = 100; // ms
        let scrollIntervalId = null;

        const centerInitialScrollVertically = () => {
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
            const maxScrollable = Math.max(0, documentHeight - viewportHeight);
            const targetTop = Math.floor(maxScrollable / 2);

            // 현재 스크롤 위치
            const currentTop = Math.round(window.scrollY || window.pageYOffset);

            // 목표 위치와 현재 위치의 차이 (허용 오차: 5px)
            const isPositioned = Math.abs(currentTop - targetTop) <= 5;

            if (!isPositioned && maxScrollable > 0) {
                window.scrollTo({ top: targetTop, left: 0, behavior: 'auto' });
            }

            scrollAttempts++;

            // 위치가 잡혔거나 최대 시도 횟수 도달 시
            if (isPositioned || scrollAttempts >= MAX_SCROLL_ATTEMPTS) {
                // 인터벌 중지
                if (scrollIntervalId) {
                    clearInterval(scrollIntervalId);
                    scrollIntervalId = null;
                }
                // mockup 표시 (fade-in)
                if (mockupElement && !mockupElement.classList.contains('mockup--ready')) {
                    mockupElement.classList.add('mockup--ready');
                }
            }
        };

        // 브라우저 스크롤 복원 방지 (조기 설정)
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // 이미지/폰트 로딩 이후 중앙 정렬 + fade-in
        window.addEventListener('load', function () {
            measureSliderHeight();

            // 첫 시도
            requestAnimationFrame(centerInitialScrollVertically);

            // 검증 루프: 100ms 간격으로 위치 확인 및 재시도
            scrollIntervalId = setInterval(centerInitialScrollVertically, SCROLL_CHECK_INTERVAL);
        });

        // 만약 load 이벤트가 이미 발생했다면 즉시 실행 (fallback)
        if (document.readyState === 'complete') {
            measureSliderHeight();
            requestAnimationFrame(centerInitialScrollVertically);
            scrollIntervalId = setInterval(centerInitialScrollVertically, SCROLL_CHECK_INTERVAL);
        }
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

    // ------------------------------
    // iframe 앵커 스크롤 격리 기능
    // ------------------------------
    function initIframeScrollIsolation() {
        const iframe = document.querySelector('.mockup-iframe__wrap iframe');

        if (!iframe) return;

        // 부모 페이지 스크롤 위치 저장 변수
        let savedScrollX = 0;
        let savedScrollY = 0;
        let isIframeActive = false;
        let rafId = null;

        // 스크롤 위치 강제 유지 (렌더링 직전 복원으로 깜빡임 방지)
        const forceScrollPosition = () => {
            if (!isIframeActive) return;

            const currentY = window.scrollY || window.pageYOffset;
            const currentX = window.scrollX || window.pageXOffset;

            // 스크롤 위치가 변경되었으면 즉시 복원
            if (currentX !== savedScrollX || currentY !== savedScrollY) {
                window.scrollTo(savedScrollX, savedScrollY);
            }

            // 다음 프레임에도 계속 감시
            rafId = requestAnimationFrame(forceScrollPosition);
        };

        // iframe 영역 진입 시 스크롤 위치 고정 시작
        iframe.addEventListener('mouseenter', function () {
            savedScrollX = window.scrollX || window.pageXOffset;
            savedScrollY = window.scrollY || window.pageYOffset;
            isIframeActive = true;

            // RAF 루프 시작
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(forceScrollPosition);
        });

        // iframe 영역 이탈 시 고정 해제
        iframe.addEventListener('mouseleave', function () {
            isIframeActive = false;

            // RAF 루프 중지
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
    }

})();
