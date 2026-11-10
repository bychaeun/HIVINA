// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/guides/internationalization/
export default defineConfig({
  site: 'https://hivina.pages.dev', // TODO: 실제 도메인으로 교체
  trailingSlash: 'always',
  i18n: {
    locales: ['ko', 'vi', 'en'],
    defaultLocale: 'ko',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
