/**
 * 사이트 전체 설정 — 회사 정보·연락처·언어는 여기 한 곳만 고치면 모든 페이지에 반영됩니다.
 */

export const LANGS = ['vi', 'en', 'ko'] as const;
export type Lang = (typeof LANGS)[number];

/** 루트(/)의 첫 화면은 베트남어로 표시합니다. */
export const DEFAULT_LANG: Lang = 'vi';

/** 번역이 비어 있을 때 대신 보여줄 언어 순서 */
export const FALLBACK_ORDER: Lang[] = ['ko', 'en', 'vi'];

export const LANG_LABELS: Record<Lang, string> = {
  ko: '한국어',
  vi: 'Tiếng Việt',
  en: 'English',
};

export const HTML_LANG: Record<Lang, string> = { ko: 'ko', vi: 'vi', en: 'en' };

export const COMPANY = {
  name: 'HI VINA JSC',
  legalName: {
    ko: '하이비나 주식회사',
    vi: 'Công ty Cổ phần Hi Việt Nam (HI VINA)',
    en: 'HI VINA Joint Stock Company',
  } satisfies Record<Lang, string>,
  founded: 2020,
  /** 홈 화면 숫자 카운트업에 쓰이는 연도 */
  rootsYear: 1997,
  productionStart: 2021,
  /** 관계사 링크 — 주소가 비어 있으면 버튼이 표시되지 않음 */
  family: [
    { name: 'HYOSAN', url: 'http://hslpl.com/en/mainen/' },
    { name: 'ICC', url: 'https://en-eicc.imweb.me/' },
  ],
  address: {
    ko: '베트남 동나이시 짱봄동 장디엔 산업단지 4번로 03번 부지',
    vi: 'Lô 03, Đường số 4, KCN Giang Điền, phường Trảng Bom, Đồng Nai, Việt Nam',
    en: 'Lot No. 03, Road No. 4, Giang Dien Industrial Park, Trang Bom Ward, Dong Nai City, Vietnam',
  } satisfies Record<Lang, string>,
  /** 지도 검색어 (Google 지도 임베드에 사용) */
  mapQuery: 'Giang Dien Industrial Park, Trang Bom, Dong Nai, Vietnam',
  phone: '+84-251-368-6731',
  fax: '0251 3686 732',
  email: 'hivina0835@gmail.com',
  facebook: 'https://www.facebook.com/Melaminepaper.Hivina',
};
