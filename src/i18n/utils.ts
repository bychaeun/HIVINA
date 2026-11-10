import { FALLBACK_ORDER, LANGS, type Lang } from '../config/site';

export function isLang(value: string | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}

/** 모든 [lang] 페이지가 공통으로 쓰는 getStaticPaths */
export function langPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

/**
 * CSV 데이터에서 언어별 열을 꺼냅니다. 예: localize(row, 'name', 'vi') → row.name_vi
 * 해당 언어가 비어 있으면 FALLBACK_ORDER 순서로 다른 언어를 대신 보여줍니다.
 */
export function localize<T = string>(row: Record<string, unknown>, field: string, lang: Lang): T {
  const isEmpty = (v: unknown) => v == null || v === '' || (Array.isArray(v) && v.length === 0);
  const own = row[`${field}_${lang}`];
  if (!isEmpty(own)) return own as T;
  for (const fb of FALLBACK_ORDER) {
    const v = row[`${field}_${fb}`];
    if (!isEmpty(v)) return v as T;
  }
  return (Array.isArray(own) ? [] : '') as T;
}

/** 언어가 붙은 내부 링크 만들기: href('vi', '/products') → /vi/products/ */
export function href(lang: Lang, path = '/'): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/** 현재 주소를 다른 언어 주소로 바꾸기 (언어 선택 메뉴용) */
export function swapLang(pathname: string, to: Lang): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && isLang(parts[0])) parts.shift();
  return href(to, parts.join('/'));
}
