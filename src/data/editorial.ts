import { source } from './website';
import type { Lang } from '../config/site';
import koNews from '../site/news/ko.html?raw';
import enNews from '../site/news/en.html?raw';
import viNews from '../site/news/vi.html?raw';
export type Article = typeof source.projects[number];
// Editorial text is the published source text, with no rewriting or translation.
const newsTitles=Object.fromEntries(Object.entries({ko:koNews,en:enNews,vi:viNews}).map(([lang,html])=>{
 const data=JSON.parse(html.match(/<script type="application\/json" id="hv-home-data">([\s\S]*?)<\/script>/)![1]) as {news:string[][]};
 return [lang,Object.fromEntries(data.news.map(item=>[item[3].split('/').filter(Boolean).at(-1),item[2]]))];
}));
// Reuse the approved list titles rather than showing a different detail title.
export function articleTitle(article:Article,lang:Lang){return newsTitles[lang]?.[article.slug]||article.title;}
export function articleParagraphs(article:Article,_lang:Lang){return article.paragraphs.filter(p=>p.trim());}
