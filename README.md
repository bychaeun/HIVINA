# HIVINA 웹사이트

HIVINA는 베트남에 있는 한국계 기업이며 효산의 형제기업입니다. 이 저장소는 HIVINA의 다국어(한국어 · 베트남어 · 영어) 정적 웹사이트입니다.
**Astro** 기반이고 **GitHub → Cloudflare Pages**로 자동 배포합니다.

## 바로 시작하기
```bash
npm install
npm run dev      # http://localhost:4321/ko/
npm run build    # dist/ 폴더 생성
```

## Cloudflare Pages 연결 (최초 1회)
1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**
2. 이 GitHub 저장소 선택
3. 빌드 설정
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - 환경 변수: `NODE_VERSION = 22`
4. 이후 `main` 브랜치에 push하면 자동 배포, 다른 브랜치는 미리보기 URL이 생성됩니다.
5. 도메인 연결 후 `astro.config.mjs`의 `site` 값을 실제 도메인으로 바꿔 주세요.

## 폴더 구조 (어디를 고치면 되나)
| 하고 싶은 것 | 수정할 파일 |
|---|---|
| 문구 수정 / 번역 | `src/i18n/ko.json`, `vi.json`, `en.json` (세 파일의 키 구조는 동일해야 함) |
| 색상 · 폰트 · 간격 | `src/styles/global.css` 맨 위 `:root` 토큰 |
| 섹션 순서 · 추가/삭제 | `src/pages/[lang]/index.astro` |
| 각 섹션 디자인 | `src/components/sections/*.astro` |
| 스크롤 모션 · 카운트업 · 패럴랙스 | `src/scripts/motion.ts` |
| 헤더 · 언어 전환 | `src/components/Header.astro` |
| 이미지 | `public/images/`에 넣고 `/images/파일명.webp`로 사용 |

## 모션 사용법 (HTML 속성만 붙이면 됨)
- `data-reveal`: 스크롤로 화면에 들어오면 아래에서 떠오름. `style="--i:2"`로 순서 딜레이
- `data-count="2004"`: 숫자 카운트업
- `data-parallax="0.15"`: 스크롤 패럴랙스 (값이 클수록 많이 움직임)
- OS의 "동작 줄이기" 설정이 켜져 있으면 모든 모션이 자동으로 꺼집니다 (접근성).

## 언어
- `/ko/`, `/vi/`, `/en/` 경로로 완전히 분리. 언어 버튼은 **같은 페이지의 다른 언어 버전**으로 이동합니다.
- 루트 `/` 접속 시 브라우저 언어를 감지해 자동 이동합니다.
- 언어 추가: `src/i18n/`에 JSON 추가 → `src/i18n/index.ts`와 `astro.config.mjs`의 `locales`에 등록.

## TODO (미팅 후)
- [ ] 실제 사업 내용, 수치, 주소, 문의 메일 (`(예시)` 표시된 값 교체)
- [ ] 로고 SVG (`src/components/Logo.astro`, `public/favicon.svg`)
- [ ] 공장 · 제품 사진 (`Business.astro`의 그라디언트 → 이미지)
- [ ] 효산 홈페이지 링크 (`Family.astro`의 `HYOSAN_URL`)
- [ ] 서브 페이지 (회사소개 / 사업분야 / 문의 등)
