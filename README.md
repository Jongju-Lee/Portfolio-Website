# 웹 퍼블리셔 이종주 — 포트폴리오 웹사이트

> 웹 표준 · 웹 접근성 · 반응형 UI 중심의 퍼블리싱 포트폴리오

[![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&logoColor=white)](https://portfolio-jongju-lee.netlify.app/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#기술-스택)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#기술-스택)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#기술-스택)

<br />

## 📌 소개

**이력, 핵심 역량, 프로젝트, UI 프로토타입**을 한 페이지에서 확인할 수 있는 싱글 페이지 포트폴리오 웹사이트입니다.

외부 UI 라이브러리 없이 **Vanilla JavaScript**만으로 슬라이더, 모달, 라이트박스, 탭, 스크롤 애니메이션 등 모든 인터랙션을 직접 구현하였으며, **CSS Variables** 기반 디자인 시스템과 **BEM 방법론**으로 스타일을 체계적으로 관리합니다.

🔗 **Live :** [portfolio-jongju-lee.netlify.app](https://portfolio-jongju-lee.netlify.app/)

<br />

## 🗂️ 섹션 구성

| # | 섹션 | 설명 |
|---|------|------|
| 1 | **About** | 프로필 소개 · 플로팅 태그 애니메이션 · 스크롤 인디케이터 |
| 2 | **Core Strengths** | 4가지 핵심 역량 카드 (모달 확장형) — 웹 표준·접근성, Pixel-Perfect, 멀티 디바이스, 인터랙션 |
| 3 | **Publishing Skill** | 8가지 기술 스택 그리드 (HTML5, CSS3, JS, A11y, RWD, React, Git, Figma) · 모달 상세 설명 |
| 4 | **Work Experience** | 타임라인 UI 기반 경력·교육 이력 |
| 5 | **Resume (Ice Candy)** | 전자교과서 프로젝트 5건 — 메인 프로젝트 카드 + 테이블 이력 |
| 6 | **Project** | 탭 전환 방식의 프로젝트 3건 소개 (SonicZero · Well Life · TaskFlow) |
| 7 | **Prototype** | 7개 카테고리 × 슬라이더 — JavaScript, Navigation, Tab, Card, Form, Animation, Hover |
| 8 | **Epilogue** | 자기소개 · 마무리 인사 |

<br />

## ⚙️ 기술 스택

| 분류 | 기술 |
|------|------|
| **마크업** | HTML5 · Semantic Tag · WAI-ARIA |
| **스타일** | CSS3 · CSS Variables · BEM · Flexbox · Grid · Media Query |
| **인터랙션** | Vanilla JavaScript (ES6+) |
| **빌드 도구** | PostCSS · Autoprefixer |
| **배포** | Netlify |
| **이미지 최적화** | WebP 변환 · Lazy Loading · `<picture>` 반응형 이미지 |
| **SEO** | OpenGraph · Canonical URL · Semantic Structure |

<br />

## 🔧 핵심 구현 사항

### 1. 외부 라이브러리 없는 Vanilla JS 컴포넌트

| 컴포넌트 | 파일 | 주요 기능 |
|----------|------|-----------|
| **Custom Slider** | `js/slider.js` | 반응형 breakpoint별 레이아웃 · 그룹 페이징 · 터치/드래그 대응 |
| **Custom Lightbox** | `js/lightbox.js` | iframe/이미지 지원 · 키보드(←→, ESC) 내비게이션 · Caption 표시 |
| **Modal System** | `js/modal.js` | Overlay Expansion 애니메이션 · 네비게이션 바(Prev/Next/Dot) · 스크롤바 Layout Shift 방지 |
| **Project Tab** | `js/project-tab.js` | WAI-ARIA tablist 패턴 · 키보드(←→, Home, End) · 첫 활성화 시 1회 애니메이션 트리거 |
| **Scroll Animation** | `js/main.js` | IntersectionObserver 기반 · `data-anim` 속성 · delay 지원 · 구형 브라우저 fallback |
| **Loading Manager** | `js/loading.js` | 전체 화면 / 인라인 로딩 · aria-busy · 타임아웃 자동 해제 |
| **Mockup Core** | `js/mockup-core.js` | 목업 페이지 자동 스케일링 · 다크모드 동기화 · iframe 스크롤 격리 |

### 2. CSS Variables 기반 디자인 시스템

- **4px Grid Spacing** — `--spacing-4` ~ `--spacing-160` 체계적 간격 토큰
- **프로젝트별 전용 컬러** — SonicZero(Dark), Well Life(Blue), TaskFlow(Mint Green) 각각 독립 변수 세트
- **반응형 변수 재정의** — `768px`, `1280px` breakpoint에서 폰트·레이아웃 변수 오버라이드

### 3. 반응형 대응 (4 Breakpoint)

```
Desktop(1400px) → Laptop(1280px) → Tablet(768px) → Mobile(480px)
```

- `tablet.css` / `mobile.css`에서 breakpoint별 CSS Variables 재정의
- `<picture>` + `<source>` 태그로 디바이스별 최적 이미지 제공
- Lightbox 동적 전환 — 화면 크기에 따라 PC/Tablet/Mobile 목업 링크를 자동 교체

### 4. 웹 접근성 (A11y)

- **스킵 내비게이션** — `본문으로 바로가기` 링크
- **WAI-ARIA** — `role`, `aria-label`, `aria-selected`, `aria-controls`, `aria-hidden`, `aria-disabled` 등 시맨틱 속성 적용
- **키보드 내비게이션** — 모든 인터랙티브 컴포넌트(탭, 모달, 라이트박스, 슬라이더)에서 키보드 조작 지원
- **`:focus-visible`** — 마우스 클릭 시 outline 제거, 키보드 Tab 시 outline 표시
- **스크린리더 전용 텍스트** — `.sr-only` 클래스를 통한 보조 정보 제공
- **장식용 이미지 처리** — `alt=""` · `aria-hidden="true"` 의도적 적용

### 5. 성능 최적화

- 모든 이미지 **WebP** 변환 + `loading="lazy"` 지연 로딩
- CSS / JS **defer** 로딩 · `preconnect` 힌트
- **Autoprefixer** (PostCSS)로 Cross-Browser 벤더 프리픽스 자동 적용
- `100dvh` (iOS Safari 동적 뷰포트) + `100vh` fallback

<br />

## 📁 프로젝트 디렉토리 구조

```
├── index.html                  # 메인 페이지 (싱글 페이지)
├── package.json                # PostCSS + Autoprefixer 설정
├── postcss.config.js
│
├── css/
│   ├── common/                 # 공통 스타일 (reset, variables, font, common)
│   ├── sections/               # 섹션별 CSS (layout, sections-top/bottom, skill, project, components)
│   ├── responsive/             # 반응형 CSS (tablet.css, mobile.css)
│   └── mockup/                 # 목업 페이지 전용 CSS
│
├── js/
│   ├── main.js                 # 스크롤 애니메이션 · 유틸 버튼 · Lightbox 동적 제어
│   ├── slider.js               # 커스텀 슬라이더
│   ├── lightbox.js             # 커스텀 라이트박스
│   ├── modal.js                # 모달 시스템
│   ├── project-tab.js          # 프로젝트 탭 (WAI-ARIA tablist)
│   ├── loading.js              # 로딩 매니저
│   └── mockup-core.js          # 목업 페이지 공통 모듈
│
├── mockup/                     # 포트폴리오 사이트 자체 목업 (mobile, tablet)
│
├── portfolio/
│   ├── prototype_coding/       # UI 프로토타입 코딩 모음 (50+ 개)
│   │   ├── js/                 # 계산기, 타이머, 가위바위보, D&D, 투두리스트, 카운트다운
│   │   ├── navigation/         # 사이드바, 오버레이, 다크모드 헤더 등
│   │   ├── tab_menu/           # 탭 인디케이터, 아코디언, 세로 슬라이더 등
│   │   ├── card_ui/            # 프로필, 제품, 호버 애니메이션 카드 등
│   │   ├── form/               # 회원가입, 로그인, 검색 박스 등
│   │   ├── animation/          # 로딩, 토스트, 텍스트 애니메이션 등
│   │   ├── hover/              # 3D 호버, 아코디언 갤러리, SNS 버튼 등
│   │   ├── sass(scss)/         # SCSS 활용 프로토타입
│   │   └── prototype/          # 랜딩 페이지, 별점 평가, 툴팁 등
│   │
│   ├── soniczero/mockup/       # SonicZero 목업 페이지
│   ├── well-life/mockup/       # 웰라이프 목업 페이지
│   └── taskflow/mockup/        # TaskFlow 목업 페이지
│
├── images/                     # 이미지 리소스 (WebP 최적화)
├── font/                       # 웹폰트 (Pretendard, Outfit 등)
└── scripts/                    # 빌드 유틸리티 (WebP 변환, 경로 업데이트 등)
```

<br />

## 🖥️ 소개 프로젝트

### SonicZero X1 — React 프리미엄 오디오 랜딩 페이지
- **스택:** React · Vite · SASS · GSAP · Vercel
- **특징:** SASS Map 디자인 토큰 아키텍처 · Clamp 가변 폰트 · GSAP 타임라인 애니메이션
- **Lighthouse:** 성능 85 · 접근성 100 · 권장사항 100 · SEO 100
- **링크:** [Live](https://soniczero-x1.vercel.app/) · [GitHub](https://github.com/Jongju-Lee/soniczero-x1)

### 웰라이프내과의원 — Vanilla 반응형 웹사이트
- **스택:** HTML · CSS · JavaScript · Swiper.js
- **특징:** CSS Variables 다크모드/라이트모드 · Figma 디자인 토큰 연동 · 폼 유효성 검사 · W3C Validate 에러 0개
- **성과:** Lighthouse 접근성 100점 · OpenWAX(KWCAG) 에러 0개
- **링크:** [Live](https://well-life-clinic.vercel.app/) · [GitHub](https://github.com/Jongju-Lee/well-life-clinic)

### TaskFlow — React Todo-List 웹 앱
- **스택:** React · Vite · Styled-Components · React Calendar · dnd-kit
- **특징:** 캘린더 연동 일정 관리 · 터치 Drag & Drop · 키보드 단축키 · 반응형(PC/Tablet/Mobile)
- **링크:** [Live](https://taskflow-jongju.vercel.app/)

<br />

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# CSS Autoprefixer 적용
npm run prefix
```

> 별도의 번들러나 빌드 과정 없이, `index.html`을 브라우저에서 직접 열거나 Live Server로 실행할 수 있습니다.

<br />

## 📄 라이선스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다. 코드 참고 시 출처를 명시해 주세요.
