import fs from 'node:fs';
import crypto from 'node:crypto';
const root='tmp/site-reference';
const read=n=>fs.readFileSync(`${root}/${n}.html`,'utf8');
const decode=s=>s.replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&ndash;/g,'–').replace(/&mdash;/g,'—').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n));
const plain=s=>decode(s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());
const main=s=>s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/[\s\S]*?<\/header>/i,'').replace(/<footer[\s\S]*/i,'');
const imageUrls=s=>[...new Set([...s.matchAll(/(?:src=["']([^"']+)["']|url\(['"]?([^'"\)]+))/gi)].map(m=>m[1]||m[2]).filter(u=>/upload/.test(u)&&!/\.mov$/.test(u)).map(u=>new URL(u,'https://hivina.com.vn').href))];
const textLines=s=>s.replace(/<[^>]+>/g,'\n').split('\n').map(plain).filter(Boolean);
const media=new Map();
function asset(url){ const clean=new URL(decode(url),'https://hivina.com.vn').href; const ext=new URL(clean).pathname.match(/\.(png|jpe?g|webp|svg|avif)$/i)?.[0].toLowerCase()||'.jpg'; const file=crypto.createHash('sha1').update(clean).digest('hex').slice(0,14)+ext; media.set(clean,file); return file; }
function page(name){const html=main(read(name));return {source:'https://hivina.com.vn/'+name,text:textLines(html),images:imageUrls(html).map(asset)};}
const source={retrieved:'2026-11-12',home:page('home'),about:page('about'),contact:page('contact'),products:[],decors:[],projects:[],news:[],media:{}};
const productPaths=['lpm','finishing-foil','hpl','tambour-board','standard-lpm','lpm-special','t-white-lpm-1','coating-lpm-1','hi-flex-low-banding-lpm-1','flame-retardant-lpm-1','inert-coating-lpm-1','pre-foil','post-foil','uv-foil','premium-pet-foil'];
for(const slug of productPaths){const data=page(slug); data.slug=slug; source.products.push(data);}
for(const group of ['wood','solid','fabric','stone','tambour-board']) {
 const files=fs.readdirSync(root).filter(n=>n===group+'.html'||n.startsWith(group+'-page-')&&n.endsWith('.html')).sort((a,b)=>(Number(a.match(/-page-(\d+)/)?.[1])||1)-(Number(b.match(/-page-(\d+)/)?.[1])||1));
 for(const file of files){const html=main(fs.readFileSync(`${root}/${file}`,'utf8'));
  for(const match of html.matchAll(/<div class="product-item">([\s\S]*?)<\/h4>/g)) {
   const img=match[1].match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/);
   const link=match[1].match(/<a[^>]*href="([^"]+)"/);
   if(!img||!link)continue;
   const slug=new URL(link[1]).pathname.slice(1);
   if(source.decors.some(d=>d.slug===slug))continue;
   source.decors.push({slug,group,name:plain(img[2]),image:asset(img[1]),source:link[1]});
  }
 }
}
for(const type of ['projects','news']) {
 const list=JSON.parse(fs.readFileSync(`${root}/${type}.json`));
 const candidates=list.links.filter(l=>l.url.startsWith('https://hivina.com.vn/')&&fs.existsSync(`${root}/${new URL(l.url).pathname.slice(1)}.html`));
 const seen=new Set();
 for(const link of candidates){const slug=new URL(link.url).pathname.slice(1); if(seen.has(slug)||['home','about','products','projects','news','contact','du-an'].includes(slug))continue; const raw=read(slug); const article=raw.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1]; if(!article)continue; seen.add(slug);
 const title=plain(article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||link.label);
 const body=article.split(/<div class="(?:project|news|post)-content"[^>]*>/)[1]||article.split(/\d+ views[\s\S]*?<\/div>/)[1]||'';
 const paragraphs=[...body.matchAll(/<(p|li|h[2-4])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>plain(m[2])).filter(Boolean);
 const date=plain(article).match(/\b(\d{2}\/\d{2}\/\d{4})\b/)?.[1]||'';
 source[type].push({slug,title,date,paragraphs,images:imageUrls(article).map(asset),source:link.url});
 }
}
fs.writeFileSync(`${root}/media-downloads.json`,JSON.stringify([...media].map(([url,file])=>({url,file}))));
source.media=Object.fromEntries([...media].map(([url,file])=>[file,url]));
fs.writeFileSync('content/reference/source.json',JSON.stringify(source,null,2));
console.log(JSON.stringify({products:source.products.length,decors:source.decors.length,projects:source.projects.length,news:source.news.length,assets:media.size}));
