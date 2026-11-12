import { source,productNames,families,sourceImageByUrl,sourceImage } from './website';
import type { Lang } from '../config/site';
const imageOverrides:Record<string,string>={'t-white-lpm-1':'Product/T-White.jpg','coating-lpm-1':'Product/Coating-LPM.jpg','flame-retardant-lpm-1':'demo/products/detail-3.jpg','inert-coating-lpm-1':'demo/products/detail-4.jpg','premium-pet-foil':'demo/products/0b33ed89936f.jpg'};
const lpmSections:Record<string,string>={'t-white-lpm-1':'T-White LPM','coating-lpm-1':'Coating LPM','flame-retardant-lpm-1':'Flame-Retardant LPM','inert-coating-lpm-1':'Inert Coating LPM'};
export function productBody(id:string):string[]{
 const p=source.products.find(p=>p.slug===id);if(!p)return[];
 let lines=p.text.filter(t=>t.trim()).slice(1);const category=lines.indexOf('Categories');if(category>=0)lines=lines.slice(0,category);
 if(lines.length===0&&lpmSections[id]){const lpm=source.products.find(p=>p.slug==='lpm')!.text.filter(t=>t.trim());const start=lpm.lastIndexOf(lpmSections[id]);let end=start+1;while(end<lpm.length&&!Object.values(lpmSections).includes(lpm[end])&&lpm[end]!=='Hi-Flex Low-Banding LPM')end++;lines=lpm.slice(start+1,end);}
 if(lines.length===0&&id==='premium-pet-foil'){const foil=source.products.find(p=>p.slug==='finishing-foil')!.text.filter(t=>t.trim());lines=foil.slice(foil.lastIndexOf('Premium PET Foil')+1);}
 return lines;
}
export function productDescription(id:string,_lang:Lang){return productBody(id).find(t=>t.length>80)||'';}
export function productCover(id:string){const p=source.products.find(p=>p.slug===id);return imageOverrides[id]?sourceImageByUrl(imageOverrides[id]):p?.images.map(sourceImage).find(i=>i&&!i.src.endsWith('.svg'));}
export const products=source.products.map(p=>({...p,name:productNames[p.slug]||p.slug,family:families.find(f=>f.id===p.slug||f.children.includes(p.slug))}));
