/**
 * 사진 파일 이름으로 자동 연결하는 모듈.
 *
 *   content/products/<제품id>.jpg      → 대표 사진
 *   content/products/<제품id>-2.jpg    → 추가 사진 (-2, -3, ... 순서대로)
 *   content/catalogue/<그룹>/<패턴코드>.jpg → 카탈로그 (CSV 필요 없음)
 *
 * 파일 이름의 대소문자·공백·밑줄은 구분하지 않습니다. (T_White.JPG = t-white)
 */
import type { ImageMetadata } from 'astro';

type ImgModule = { default: ImageMetadata };

const productFiles = import.meta.glob<ImgModule>(
  '/content/products/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);
const catalogueFiles = import.meta.glob<ImgModule>(
  '/content/catalogue/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);

/** "T_White Sample.JPG" → "t-white-sample" */
export function normalizeName(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function baseName(path: string) {
  return path.split('/').pop() ?? path;
}

const productIndex = Object.entries(productFiles).map(([path, mod]) => ({
  key: normalizeName(baseName(path)),
  image: mod.default,
}));

/** 제품 id 에 맞는 사진들 [대표, 추가1, 추가2 ...] */
export function getProductImages(id: string): ImageMetadata[] {
  const main = productIndex.filter((f) => f.key === id).map((f) => f.image);
  const extra = productIndex
    .map((f) => {
      const m = f.key.match(new RegExp(`^${id}-(\\d+)$`));
      return m ? { n: Number(m[1]), image: f.image } : null;
    })
    .filter((x): x is { n: number; image: ImageMetadata } => x !== null)
    .sort((a, b) => a.n - b.n)
    .map((x) => x.image);
  return [...main, ...extra];
}

/** 어떤 제품에도 연결되지 않은 사진 파일 (빌드 시 경고용) */
export function unmatchedProductImages(ids: string[]): string[] {
  return productIndex
    .filter((f) => !ids.some((id) => f.key === id || new RegExp(`^${id}-\\d+$`).test(f.key)))
    .map((f) => f.key);
}

export interface CatalogueItem {
  group: string;
  code: string;
  image: ImageMetadata;
}

/** 카탈로그 그룹 표시 순서 (여기에 없는 새 폴더는 뒤에 이름순으로 붙음) */
export const CATALOGUE_GROUPS = ['wood', 'stone', 'fabric', 'fantasy', 'solid'];

export function getCatalogue(): CatalogueItem[] {
  return Object.entries(catalogueFiles)
    .map(([path, mod]) => {
      const parts = path.split('/');
      return {
        group: parts[parts.length - 2].toLowerCase(),
        code: baseName(path).replace(/\.[^.]+$/, ''),
        image: mod.default,
      };
    })
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
}
