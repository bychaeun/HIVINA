# HIVINA 웹사이트

Astro 정적 사이트입니다. GitHub → Cloudflare Pages 배포 구조를 유지합니다.

## 현재 화면과 콘텐츠

- 상단 메뉴: 회사소개 → 제품 → 프로젝트 → 뉴스 → 문의. HOME 메뉴와 검색 아이콘은 없습니다.
- 헤더·푸터의 로고는 현재 언어의 홈으로 연결됩니다.
- 제품 구조: LPM → Standard LPM / LPM Special 및 특수 제품, Finishing Foil → Pre / Post / UV / Premium PET, HPL, Tambour Board.
- 실제 사이트의 제품 소개 15개, 디자인 패턴 251개, 프로젝트 6개, 뉴스 4개를 가져왔습니다.
- 회사소개 상세는 데스크톱에서 좌측 이미지 고정, 우측 내용 스크롤과 이미지 전환 방식입니다.
- 본문은 https://hivina.com.vn/ 에서 2026-11-12에 가져온 원문을 그대로 사용합니다. UI 언어를 변경해도 원문을 임의로 번역하거나 다시 쓰지 않습니다.
- 참고 디자인의 수치·기업 설명은 사용하지 않습니다.

## 수정할 파일

| 대상 | 파일 |
|---|---|
| 공식 사이트에서 가져온 원문·이미지 연결·디자인 코드 | `content/reference/source.json` |
| 원문 연혁 | `content/history.csv` |
| 제품·제품군의 CSV 사본 | `content/products.csv`, `content/categories.csv` |
| 실제 페이지에서 쓰는 제품 위계·UI 문구·원문 홈 문구 | `src/data/website.ts` |
| 제품 원문 블록·공식 사진 선택 | `src/data/product-copy.ts` |
| 프로젝트·뉴스 원문 선택 | `src/data/editorial.ts` |
| 홈 디자인 | `src/pages/[lang]/index.astro` |
| 고정 이미지 회사소개 | `src/pages/[lang]/about.astro` |
| 헤더 메뉴·언어 선택 | `src/components/Header.astro` |
| 공통 스타일·모션 | `src/styles/global.css`, `src/scripts/motion.ts` |
| 공식 사이트 사진의 웹용 파일 | `src/assets/imported/` |

제품·디자인·프로젝트·뉴스 라우트는 `source.json`을 기준으로 생성합니다. CSV는 가져온 제품 원문의 사본이며 현재 제품 페이지 생성의 기준은 `source.json`입니다. 정보 수정 시 원본과 대조하고 사용자의 원문 유지 요청을 우선합니다.

원본 사진을 웹용 WebP로 최적화했습니다. 원본 URL은 `source.json`의 `media`에 보관합니다. 원문 페이지와 다운로드 원본은 Git에 포함하지 않는 `tmp/site-reference/`에 있습니다. `scripts/import-source.mjs`, `scripts/download-source.mjs`, `scripts/optimize-source.mjs`는 이 가져오기 작업의 기록입니다.

## 이동 동작

- 브라우저 기본 앵커 이동을 사용해 URL 해시·뒤로가기·도착 위치를 일치시킵니다.
- 카탈로그는 분류와 페이지 번호를 URL에 유지합니다. 디자인 상세의 목록 링크도 이전 분류와 페이지를 복원합니다.
- 언어 전환은 같은 경로·분류·페이지·해시를 유지합니다.
- 문의 폼은 작성 내용을 사용자의 메일 앱에 전달합니다. 서버 메일 발송이나 성공 메시지를 가장하지 않습니다. 웹에서 직접 전송하려면 메일 발송 백엔드를 별도로 연결해야 합니다.

## 개발 및 확인

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run dev -- --host 127.0.0.1
npm run build
npx astro check
node scripts/verify-site.mjs
```

Cloudflare Pages 빌드 명령은 `npm run build`, 출력 경로는 `dist`입니다. 현재 작업에서는 GitHub push와 운영 배포를 실행하지 않았습니다.

## 홈 화면 (디자인 캔버스에서 옮긴 화면)

- 홈(`/ko/`, `/en/`, `/vi/`)은 디자인 캔버스에서 확정한 화면을 언어별 정적 HTML로 옮긴 것입니다: `src/home/ko.html`, `en.html`, `vi.html`.
- 스타일은 `public/home/home.css`, 동작(연혁 휠·점 타임라인, 프로젝트 슬라이드, LPM 3D, 문의 폼)은 `public/home/home.js`, 이미지와 영상은 `public/home/img/`, `public/home/video/`에 있습니다.
- LPM 3D는 `public/models/lpm-assembly.glb`와 `public/3d/vendor/model-viewer.min.js`를 사용합니다.
- 홈의 한국어·베트남어 문구는 공식 사이트 영어 원문을 번역한 것입니다. 회사소개·제품·프로젝트·뉴스·문의 하위 페이지는 기존 구현을 그대로 사용하며, 홈의 메뉴가 이 페이지들로 연결됩니다.
- 문의 폼은 기존 원칙대로 사용자의 메일 앱에 내용을 넘깁니다.
