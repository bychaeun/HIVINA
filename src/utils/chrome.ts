import ko from '../site/home/ko.html?raw';
import en from '../site/home/en.html?raw';
import vi from '../site/home/vi.html?raw';
import type { Lang } from '../config/site';
import { swapLang } from '../i18n/utils';

const pages={ko,en,vi};
export function externalLinks(html:string):string {
 return html.replace(/<a\b([^>]*href="https?:\/\/[^\"]+"[^>]*)>/g,(all,attributes)=>/\btarget=/.test(attributes)?all:`<a${attributes} target="_blank" rel="noopener noreferrer">`);
}
/** All routes use the approved main-page chrome, including detail pages. */
export function canvasHeader(lang:Lang,pathname:string):string {
 let html=pages[lang].match(/<header\b[\s\S]*?<\/header>/)![0];
 html=html.replace('<header ','<header class="canvas-header" ');
 html=html.replace('href="#top"',`href="/${lang}/"`);
 html=html.replace(/<a\b[^>]*href="#history"[^>]*>[\s\S]*?<\/a>/g,'');
 html=html.replace(/(<div class="lng"[^>]*>)([\s\S]*?)(<\/div>)/,(_all:string,start:string,links:string,end:string)=>start+links.replace(/href="\/(vi|en|ko)\/"/g,(_m:string,l:Lang)=>`href="${pathname.startsWith(`/${lang}/`)?swapLang(pathname,l):`/${l}/`}"`)+end);
 return externalLinks(html);
}
export function canvasFooter(lang:Lang):string {
 return externalLinks(pages[lang].match(/<footer\b[\s\S]*?<\/footer>/)![0].replace('<footer ','<footer class="canvas-footer" '));
}
