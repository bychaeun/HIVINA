# HIVINA 웹사이트

HI VINA JSC(베트남 동나이, 효산·ICC 관계사) 공식 웹사이트입니다.
Astro 정적 사이트이며, GitHub에 올리면 Cloudflare Pages가 자동으로 배포합니다.
한국어 `/ko/`, 베트남어 `/vi/`, 영어 `/en/`가 완전히 분리되어 있고, 언어 버튼을 누르면 **같은 페이지의 다른 언어 버전**으로 이동합니다.

---

## 제품 추가·수정 방법 (코드 몰라도 됨)

모든 콘텐츠는 **`content/` 폴더**에만 있습니다. 코드는 건드릴 필요가 없습니다.

```
content/
├─ products.csv        ← 제품 목록 (엑셀로 편집)
├─ categories.csv      ← 제품군 (LPM, Finishing Foil …)
├─ history.csv         ← 연혁
├─ products/           ← 제품 사진 (파일명 = 제품 id)
└─ catalogue/          ← 패턴 사진 (폴더 = 그룹, 파일명 = 패턴 코드)
   ├─ wood/  stone/  fabric/  fantasy/  solid/
```

### 1. 새 제품 추가
1. `content/products.csv`를 엑셀로 열고 맨 아래에 한 줄을 추가합니다.
2. **`id`**: 영문 소문자, 숫자, 하이픈만 씁니다. 예: `hi-flex-plus`. 이 값이 주소(`/ko/products/hi-flex-plus/`)와 사진 파일 이름이 됩니다.
3. **`category`**: `categories.csv`의 id(`lpm`, `finishing-foil`) 중 하나를 씁니다.
4. `content/products/hi-flex-plus.jpg` 사진을 넣습니다.
5. 저장할 때는 **파일 → 다른 이름으로 저장 → "CSV UTF-8(쉼표로 분리)"**를 고릅니다. 그냥 "CSV"로 저장하면 한글과 베트남어가 깨집니다.
6. GitHub에 올리면 1~2분 뒤 사이트에 자동으로 반영됩니다. 상세 페이지 3개(ko/vi/en)와 목록 카드도 함께 만들어집니다.

### products.csv 열 설명
| 열 | 설명 | 예 |
|---|---|---|
| `id` | 제품 고유 코드 (사진 파일명과 같게) | `t-white` |
| `category` | 제품군 id | `lpm` |
| `sort` | 목록 순서 (작을수록 앞) | `1` |
| `visible` | `N`이면 사이트에서 숨김 (삭제하지 않고 내릴 때) | `Y` |
| `new` | `Y`면 NEW 배지 표시 | `N` |
| `name_ko / name_vi / name_en` | 제품명 | |
| `summary_*` | 카드에 보이는 한 줄 소개 | |
| `description_*` | 상세 설명 (셀 안 줄바꿈 가능) | |
| `features_*` | 특징. **`\|`로 구분** | `내수성 \| 내열성 \| 친환경` |
| `applications_*` | 적용 분야. **`\|`로 구분** | `가구 \| 도어` |

- 번역이 비어 있으면 다른 언어(ko → en → vi 순)로 대신 표시되므로 사이트가 깨지지 않습니다.
- 첫 칸이 `#`으로 시작하는 줄은 메모로 취급되어 무시됩니다.

### 2. 제품 사진 규칙
| 파일 | 용도 |
|---|---|
| `t-white.jpg` | 대표 사진 |
| `t-white-2.jpg`, `t-white-3.jpg` … | 상세 페이지 추가 사진 (번호 순서대로) |

- jpg, png, webp, avif를 쓸 수 있습니다. 대소문자, 공백, 밑줄은 구분하지 않습니다(`T_White.JPG`도 `t-white`로 인식).
- 원본을 그대로 넣어도 됩니다. 빌드할 때 웹용 크기와 WebP로 자동 변환됩니다.

### 3. 카탈로그(패턴) 추가
`content/catalogue/wood/HW-1001.jpg`처럼 **사진만 넣으면** 됩니다. CSV는 필요 없습니다.
파일명이 패턴 코드로 표시되고, 새 폴더(예: `metal/`)를 만들면 새 그룹이 자동으로 생깁니다.

### 4. 실수 방지 기능
`npm run build`를 하면 터미널에 점검 결과가 나옵니다.
- **경고 (사이트는 정상 배포):** 사진이 없는 제품, 번역이 빠진 제품명, 어떤 제품과도 이름이 맞지 않는 사진
- **오류 (배포 중단):** 잘못된 id 형식, 존재하지 않는 category, 한글이 깨진 CSV. 오류가 나면 Cloudflare가 이전 버전을 그대로 유지하므로 사이트가 망가지지 않습니다.

---

## 그 밖에 고칠 곳
| 하고 싶은 것 | 파일 |
|---|---|
| 회사 주소·전화·이메일·기본 언어·관계사 링크 | `src/config/site.ts` |
| 메뉴·버튼·홈 화면 문구 번역 | `src/i18n/ui.ts` (ko에 키를 추가하면 vi/en 누락 시 빌드 오류) |
| 색상·글꼴 | `src/styles/global.css` 맨 위 `:root` (딥그린 `--forest`, 라임 `--leaf` 등) |
| 홈 화면 섹션 순서·추가·삭제 | `src/pages/[lang]/index.astro` |
| 각 섹션 디자인 | `src/components/sections/*.astro` |
| 스크롤 모션 | `src/scripts/motion.ts` |
| 상단 메뉴 항목 | `src/components/Header.astro`의 `nav` |
| 로고 | `src/components/Logo.astro`, `public/favicon.svg` (원본 SVG 6종은 `brand/` 폴더) |
| CSV 열 추가 | `src/content.config.ts` schema에 같은 이름 추가 |

### 홈 화면에서 자동으로 채워지는 것
- 흐르는 띠(Marquee): `products.csv`의 영문 제품명
- 제품군 카드: `categories.csv` + 각 제품군의 제품 목록. 대표 사진은 그 제품군에서 사진이 있는 첫 제품
- 숫자 카운트업: `site.ts`의 연도(1997 효산 LPL 설립 / 2020 설립 / 2021 생산 시작)

### 모션 (HTML 속성만 붙이면 됨)
- `data-reveal`: 스크롤로 화면에 들어오면 떠오름. `style="--i:2"`로 순서 지연
- `data-count="2020"`: 숫자 카운트업
- `data-parallax="0.15"`: 스크롤 패럴랙스
- OS의 "동작 줄이기" 설정이 켜져 있으면 모든 모션이 자동으로 꺼집니다.

## 개발
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ 생성 + 콘텐츠 점검
npx astro check    # 타입 검사
```
Node 22 이상이 필요합니다.

## Cloudflare Pages 연결 (최초 1회)
1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**
2. `bychaeun/HIVINA` 저장소와 `main` 브랜치 선택
3. 빌드 설정
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - (Node 버전은 `.node-version` 파일로 자동 지정됩니다)
4. 이후 `main`에 push하면 자동 배포되고, 다른 브랜치는 미리보기 URL이 생깁니다.
5. 도메인을 연결한 뒤 `astro.config.mjs`에 `site: 'https://실제도메인'`을 넣으면 검색엔진용 언어 링크(hreflang)가 생성됩니다.

## TODO (미팅 후)
- [ ] 제품 설명 실제 문구로 교체 (`[샘플 문구]` 표시 부분), 베트남어 번역 검수
- [ ] 제품·패턴 사진
- [ ] 대표 이메일 (`src/config/site.ts`)
- [ ] 효산 홈페이지 주소 (`site.ts`의 `family`, 비어 있으면 버튼 숨김)
- [ ] 홈 화면 문구 검수 (특히 친환경 섹션 3개 항목)
- [ ] 효산·ICC 소개 방식
- [ ] 문의 폼 필요 여부 (필요하면 Cloudflare로 메일 발송 구현 가능)
