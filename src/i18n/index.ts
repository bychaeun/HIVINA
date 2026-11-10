import ko from './ko.json';
import vi from './vi.json';
import en from './en.json';

export const languages = { ko, vi, en } as const;
export type Lang = keyof typeof languages;
export const langs = Object.keys(languages) as Lang[];
export const defaultLang: Lang = 'ko';

export function t(lang: Lang) {
  return languages[lang] ?? languages[defaultLang];
}

/** 현재 경로에서 언어 코드만 바꿔 같은 페이지의 다른 언어 버전 주소를 만든다. */
export function switchLangPath(pathname: string, to: Lang) {
  const parts = pathname.split('/');
  if (langs.includes(parts[1] as Lang)) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join('/') || `/${to}/`;
}
