import { source } from './website';
import type { Lang } from '../config/site';
export type Article = typeof source.projects[number];
// Editorial text is the published source text, with no rewriting or translation.
export function articleTitle(article:Article,_lang:Lang){return article.title;}
export function articleParagraphs(article:Article,_lang:Lang){return article.paragraphs.filter(p=>p.trim());}
