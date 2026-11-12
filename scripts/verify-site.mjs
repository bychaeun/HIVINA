import fs from 'node:fs';
import path from 'node:path';
const source=JSON.parse(fs.readFileSync('content/reference/source.json','utf8'));
const failures=[];
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#x([a-f0-9]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&nbsp;/g,' ');
const normalized=s=>decode(s).replace(/\s+/g,' ').trim();
const textOf=html=>normalized(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' '));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk('dist').filter(f=>f.endsWith('.html'));
let links=0;
for(const file of files){const html=fs.readFileSync(file,'utf8');const relative=path.relative('dist',file).split(path.sep).join('/');const urlPath='/'+relative.replace(/index\.html$/,'');
 for(const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)){
  const raw=decode(match[1]);if(!raw||/^(?:https?:|mailto:|tel:|data:)/i.test(raw))continue;
  const url=new URL(raw,'https://local.test'+urlPath);if(url.origin!=='https://local.test')continue;links++;
  const target=path.join('dist',decodeURIComponent(url.pathname));const candidate=path.extname(target)?target:path.join(target,'index.html');
  if(!fs.existsSync(candidate)){failures.push(`Broken link ${url.pathname} from ${relative}`);continue;}
  if(url.hash){const targetHtml=fs.readFileSync(candidate,'utf8');const id=decodeURIComponent(url.hash.slice(1));if(!targetHtml.includes(`id="${id}"`))failures.push(`Missing anchor ${url.pathname}${url.hash} from ${relative}`);}
 }
 for(const match of html.matchAll(/<img\b[^>]*src="([^"?]+)(?:\?[^"]*)?"/gi)) { const src=decode(match[1]); if(src.startsWith('/')&&!src.startsWith('//')&&!fs.existsSync(path.join('dist',decodeURIComponent(src))))failures.push(`Missing image ${src} from ${relative}`); }
}
let originalPassages=0;
for(const lang of ['ko','en','vi']){
 for(const kind of ['projects','news'])for(const article of source[kind]){
  const file=`dist/${lang}/${kind}/${article.slug}/index.html`;const htmlText=textOf(fs.readFileSync(file,'utf8'));
  for(const passage of [article.title,...article.paragraphs.filter(p=>p.trim())]){originalPassages++;if(!htmlText.includes(normalized(passage)))failures.push(`Changed editorial copy: ${lang}/${kind}/${article.slug}: ${passage.slice(0,60)}`);}
 }
 for(const product of source.products){const htmlText=textOf(fs.readFileSync(`dist/${lang}/products/${product.slug}/index.html`,'utf8'));const lines=product.text.filter(t=>t.trim());const cutoff=lines.indexOf('Categories');for(const passage of cutoff>=0?lines.slice(0,cutoff):lines){originalPassages++;if(!htmlText.includes(normalized(passage)))failures.push(`Changed product copy: ${lang}/${product.slug}: ${passage.slice(0,60)}`);}}
 const about=textOf(fs.readFileSync(`dist/${lang}/about/index.html`,'utf8'));for(const passage of source.about.text.filter(p=>p.trim()&&p.length>5)){originalPassages++;if(!about.includes(normalized(passage)))failures.push(`Changed company copy: ${lang}: ${passage.slice(0,60)}`);}
 const header=fs.readFileSync(`dist/${lang}/index.html`,'utf8').match(/<header\b[\s\S]*?<\/header>/)?.[0]||'';
 if(/>\s*HOME\s*<|aria-label="(?:Search|검색)"/i.test(header))failures.push(`Unexpected HOME/search menu: ${lang}`);
}
const wood=source.decors.filter(d=>d.group==='wood');if(wood[0]?.name!=='HI 6000'||wood[24]?.name!=='HI 6024')failures.push('Catalogue page ordering differs from source');
console.log(JSON.stringify({htmlPages:files.length,internalLinks:links,originalPassages,products:source.products.length,decors:source.decors.length,projects:source.projects.length,news:source.news.length,failures:failures.length},null,2));
if(failures.length){console.error([...new Set(failures)].slice(0,40).join('\n'));process.exitCode=1;}
