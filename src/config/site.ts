/**
 * 사이트 전체 설정 — 회사 정보·연락처·언어는 여기 한 곳만 고치면 모든 페이지에 반영됩니다.
 */

export const LANGS = ['ko', 'vi', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** 루트(/) 접속 시 브라우저 언어를 알 수 없을 때 보낼 기본 언어 */
export const DEFAULT_LANG: Lang = 'ko';

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
    { name: 'HYOSAN', url: '' }, // TODO: 효산 홈페이지 주소 확인 후 입력
    { name: 'ICC', url: 'http://www.eicc.co.kr/' },
  ],
  address: {
    ko: '베트남 동나이성 짱봄군 장디엔사 장디엔 산업단지 4번로 3번 부지',
    vi: 'Lô số 3, đường số 4, KCN Giang Điền, xã Giang Điền, huyện Trảng Bom, tỉnh Đồng Nai, Việt Nam',
    en: 'Lot 3, Road No. 4, Giang Dien Industrial Park, Giang Dien Commune, Trang Bom District, Dong Nai Province, Vietnam',
  } satisfies Record<Lang, string>,
  /** 지도 검색어 (Google 지도 임베드에 사용) */
  mapQuery: 'Giang Dien Industrial Park, Trang Bom, Dong Nai, Vietnam',
  phone: '0251 3686 731',
  fax: '0251 3686 732',
  /** TODO: 미팅 후 대표 이메일 입력 (비워두면 화면에 표시되지 않음) */
  email: '',
  facebook: 'https://www.facebook.com/Melaminepaper.Hivina',
};
