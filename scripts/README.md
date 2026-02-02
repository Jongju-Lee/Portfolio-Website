# 이미지 최적화 스크립트

포트폴리오 이미지 최적화를 위한 빌드 도구 모음입니다.

## 📄 스크립트 목록

### convert-to-webp.js
PNG 이미지를 WebP 포맷으로 일괄 변환하여 파일 크기를 약 70% 절감합니다.

**요구사항:**
- Node.js
- FFmpeg (시스템에 설치 필요)

**사용법:**
```bash
node scripts/convert-to-webp.js
```

**실행 결과:**
- `images/practical` 폴더의 모든 PNG 파일을 WebP로 변환
- 원본 PNG는 `_original_png_backup` 폴더에 자동 백업
- 변환 결과: 47개 이미지, 6.61MB → 1.78MB (73% 절감)

---

### update-html-paths.js
HTML 파일 내의 이미지 경로를 `.png`에서 `.webp`로 일괄 변경합니다.

**사용법:**
```bash
node scripts/update-html-paths.js
```

**실행 결과:**
- `index.html`의 모든 practical 이미지 경로 자동 수정
- UTF-8 인코딩 유지 (한글 깨짐 방지)

---

## 🎯 사용 시나리오

새로운 이미지를 추가했을 때:

1. 이미지를 `images/practical/` 폴더에 추가 (PNG 형식)
2. `node scripts/convert-to-webp.js` 실행
3. `node scripts/update-html-paths.js` 실행
4. 브라우저에서 확인

---

## 📊 최적화 효과

- **로딩 속도**: 약 73% 향상
- **대역폭 절약**: 사용자당 약 4.83MB 절감
- **브라우저 호환성**: Chrome, Firefox, Safari, Edge 등 99%+ 지원
