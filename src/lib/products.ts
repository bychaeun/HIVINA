import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { LANGS } from '../config/site';
import { getProductImages, unmatchedProductImages } from './images';

export type Product = CollectionEntry<'products'>['data'] & {
  categoryId: string;
  images: ImageMetadata[];
};
export type Category = CollectionEntry<'categories'>['data'] & { products: Product[] };

let warned = false;

/** 화면에 보일 제품 목록 (visible=Y, 정렬 적용, 사진 자동 연결) */
export async function getProducts(): Promise<Product[]> {
  const all = await getCollection('products');
  const catIds = new Set((await getCollection('categories')).map((c) => c.data.id));
  const badCat = all.filter((e) => !catIds.has(e.data.category.id));
  if (badCat.length) {
    throw new Error(
      `products.csv 의 category 가 categories.csv 에 없습니다: ` +
        badCat.map((e) => `${e.data.id} → "${e.data.category.id}"`).join(', ') +
        ` (사용 가능: ${[...catIds].join(', ')})`,
    );
  }
  const products = all
    .map((e) => ({ ...e.data, categoryId: e.data.category.id, images: getProductImages(e.data.id) }))
    .filter((p) => p.visible)
    .sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id));

  if (!warned) {
    warned = true;
    reportProblems(all.map((e) => e.data.id), products);
  }
  return products;
}

export async function getCategories(): Promise<Category[]> {
  const [cats, products] = await Promise.all([getCollection('categories'), getProducts()]);
  return cats
    .map((c) => ({ ...c.data, products: products.filter((p) => p.categoryId === c.data.id) }))
    .sort((a, b) => a.sort - b.sort);
}

/** 빌드할 때 터미널에 빠진 사진·번역을 알려줌 (사이트는 정상 생성됨) */
function reportProblems(allIds: string[], products: Product[]) {
  const lines: string[] = [];
  for (const p of products) {
    if (p.images.length === 0) lines.push(`  · ${p.id}: 사진 없음 → content/products/${p.id}.jpg 추가`);
    const missing = LANGS.filter((l) => !p[`name_${l}`]);
    if (missing.length) lines.push(`  · ${p.id}: 제품명 번역 없음 (${missing.join(', ')})`);
  }
  for (const f of unmatchedProductImages(allIds)) {
    lines.push(`  · 사진 "${f}" 와 이름이 같은 제품 id 가 products.csv 에 없음`);
  }
  if (lines.length) console.warn(`\n[HIVINA 콘텐츠 점검]\n${lines.join('\n')}\n`);
}
