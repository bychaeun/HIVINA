/**
 * content/ 폴더의 CSV 파일을 사이트 데이터로 읽어오는 설정.
 * CSV 에 열을 추가하면 아래 schema 에도 추가해야 화면에서 쓸 수 있습니다.
 */
import { defineCollection, reference } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parseCsv, splitList, toBool } from './lib/csv';

const text = z.string().default('');
const ID_RULE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const idField = z
  .string()
  .transform((s) => s.toLowerCase())
  .refine((s) => ID_RULE.test(s), {
    message: 'id 는 영문 소문자·숫자·하이픈(-)만 쓸 수 있습니다. 예: t-white, uv-foil',
  });

const csvLoader = (path: string) =>
  file(path, { parser: (raw) => parseCsv(raw, path) });

const categories = defineCollection({
  loader: csvLoader('content/categories.csv'),
  schema: z.object({
    id: idField,
    sort: z.coerce.number().default(999),
    name_ko: text,
    name_vi: text,
    name_en: text,
    summary_ko: text,
    summary_vi: text,
    summary_en: text,
  }),
});

const products = defineCollection({
  loader: csvLoader('content/products.csv'),
  schema: z.object({
    id: idField,
    category: reference('categories'),
    sort: z.coerce.number().default(999),
    visible: z.string().optional().transform((v) => toBool(v, true)),
    new: z.string().optional().transform((v) => toBool(v, false)),
    name_ko: text,
    name_vi: text,
    name_en: text,
    summary_ko: text,
    summary_vi: text,
    summary_en: text,
    description_ko: text,
    description_vi: text,
    description_en: text,
    features_ko: z.string().optional().transform(splitList),
    features_vi: z.string().optional().transform(splitList),
    features_en: z.string().optional().transform(splitList),
    applications_ko: z.string().optional().transform(splitList),
    applications_vi: z.string().optional().transform(splitList),
    applications_en: z.string().optional().transform(splitList),
  }),
});

const history = defineCollection({
  // 연혁은 id 열 없이 행 순서대로 자동 번호를 붙입니다.
  loader: file('content/history.csv', {
    parser: (raw) =>
      parseCsv(raw, 'content/history.csv').map((row, i) => ({ id: String(i + 1), ...row })),
  }),
  schema: z.object({
    id: z.string(),
    year: z.coerce.number(),
    text_ko: text,
    text_vi: text,
    text_en: text,
  }),
});

export const collections = { categories, products, history };
