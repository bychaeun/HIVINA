import originalSource from '../../content/reference/source.json';
import { normalizeBrand } from '../utils/brand';
import type { ImageMetadata } from 'astro';
import type { Lang } from '../config/site';
// Keep the archived source intact. Only display spelling changes, never URLs.
export const source = {
 ...originalSource,
 home: {...originalSource.home, text: originalSource.home.text.map(normalizeBrand)},
 about: {...originalSource.about, text: originalSource.about.text.map(normalizeBrand)},
 products: originalSource.products.map(p=>({...p,text:p.text.map(normalizeBrand)})),
 projects: originalSource.projects.map(p=>({...p,title:normalizeBrand(p.title),paragraphs:p.paragraphs.map(normalizeBrand)})),
 news: originalSource.news.map(p=>({...p,title:normalizeBrand(p.title),paragraphs:p.paragraphs.map(normalizeBrand)})),
};
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/imported/*.{png,jpg,jpeg,JPG,JPEG,PNG,webp,svg,avif}', { eager: true });
export function sourceImage(file: string | undefined): ImageMetadata | undefined {
  return file ? files[`/src/assets/imported/${file}`]?.default : undefined;
}
export function sourceImageByUrl(fragment: string): ImageMetadata | undefined {
  return sourceImage(Object.entries(source.media).find(([,url]) => url.includes(fragment))?.[0]);
}
export const families = [
  { id: 'lpm', name: 'LPM', subtitle: 'Low Pressure Melamine', image: 'Homepage/1_1.png', children: ['standard-lpm','lpm-special','t-white-lpm-1','coating-lpm-1','hi-flex-low-banding-lpm-1','flame-retardant-lpm-1','inert-coating-lpm-1'] },
  { id: 'finishing-foil', name: 'Finishing Foil', subtitle: '', image: 'Homepage/8.png', children: ['pre-foil','post-foil','uv-foil','premium-pet-foil'] },
  { id: 'hpl', name: 'HPL', subtitle: 'High Pressure Laminate', image: 'demo/products/product-4.jpg', children: [] },
  { id: 'tambour-board', name: 'Tambour Board', subtitle: '', image: 'demo/products/3.png', children: [] },
];
export const productNames: Record<string,string> = {
  lpm: 'LPM', 'finishing-foil':'Finishing Foil', hpl:'HPL', 'tambour-board':'Tambour Board',
  'standard-lpm':'Standard LPM', 'lpm-special':'LPM Special', 't-white-lpm-1':'T-White LPM',
  'coating-lpm-1':'Coating LPM', 'hi-flex-low-banding-lpm-1':'Hi-Flex Low-Banding LPM',
  'flame-retardant-lpm-1':'Flame-Retardant LPM', 'inert-coating-lpm-1':'Inert Coating LPM',
  'pre-foil':'Pre Foil','post-foil':'Post Foil','uv-foil':'UV Foil','premium-pet-foil':'Premium PET Foil',
};
// Navigation and controls are localized. Published business copy comes directly
// from the captured official source, without translation, summaries or rewriting.
const UI_COPY = {
 ko:{projects:'프로젝트',news:'뉴스',catalogue:'카탈로그',about:'회사소개',products:'제품',contact:'문의',explore:'컬렉션 살펴보기',all:'전체 보기',details:'자세히 보기',back:'목록으로',browse:'패턴 둘러보기',collection:'디자인 컬렉션',specifications:'제품 소개',related:'함께 살펴보기',patterns:'디자인',filterAll:'전체',groups:{wood:'나무',solid:'단색',fabric:'패브릭',stone:'스톤','tambour-board':'Tambour Board'},form:{name:'이름',phone:'연락처',email:'이메일',subject:'제목',message:'문의 내용',send:'이메일로 문의하기',note:'작성한 내용으로 메일 앱이 열립니다. 메일 앱에서 전송을 완료해 주세요.'}},
 en:{projects:'Projects',news:'News',catalogue:'Catalogue',about:'About us',products:'Our products',contact:'Contact',explore:'Explore the collection',all:'View all',details:'Discover more',back:'Back to overview',browse:'Explore the decors',collection:'Design collection',specifications:'Product overview',related:'Explore further',patterns:'decors',filterAll:'All',groups:{wood:'Wood',solid:'Solid',fabric:'Fabric',stone:'Stone','tambour-board':'Tambour Board'},form:{name:'Name',phone:'Phone',email:'Email',subject:'Subject',message:'Message',send:'Continue in email',note:'Your email app opens with this message. Complete sending in your email app.'}},
 vi:{projects:'Dự án',news:'Tin tức',catalogue:'Catalogue',about:'Giới thiệu',products:'Sản phẩm',contact:'Liên hệ',explore:'Khám phá bộ sưu tập',all:'Xem tất cả',details:'Khám phá thêm',back:'Trở về danh sách',browse:'Khám phá mẫu thiết kế',collection:'Bộ sưu tập thiết kế',specifications:'Giới thiệu sản phẩm',related:'Khám phá thêm',patterns:'mẫu',filterAll:'Tất cả',groups:{wood:'Vân gỗ',solid:'Màu trơn',fabric:'Vân vải',stone:'Vân đá','tambour-board':'Tambour Board'},form:{name:'Họ tên',phone:'Điện thoại',email:'Email',subject:'Chủ đề',message:'Nội dung',send:'Tiếp tục qua email',note:'Ứng dụng email sẽ mở với nội dung đã nhập. Vui lòng hoàn tất gửi trong ứng dụng email.'}},
};
const homeLines=source.home.text.filter(line=>line.trim());
const aboutLines=source.about.text.filter(line=>line.trim());
const after=(label:string)=>homeLines[homeLines.indexOf(label)+1]||'';
const ORIGINAL_COPY={
 hero:homeLines.slice(0,2).join('\n'),
 heroLead:homeLines.find(line=>line.startsWith('HIVINA, backed'))||'',
 expertise:homeLines.slice(homeLines.findIndex(line=>line.startsWith('ECO-FRIENDLY')),homeLines.findIndex(line=>line.startsWith('ECO-FRIENDLY'))+2).join('\n'),
 expertiseLead:homeLines.find(line=>line==='Our expertise')||'',
 aboutTitle:homeLines.slice(2,4).join('\n'),
 aboutBody:aboutLines.find(line=>line.startsWith('Backed by'))||'',
 aboutDetail:aboutLines.find(line=>line.startsWith('Powered by'))||'',
 visionLabel:'Corporate Vision',vision:after('Corporate Vision'),
 missionLabel:'Mission',mission:after('Mission'),
 valuesLabel:'Core Values',values:after('Core Values'),
 projectsTitle:'Our Project',newsTitle:'News',contactTitle:'Contact Us',contactLead:'',coming:'Contact Us',
 history:aboutLines.find(line=>line==='Company History')||'',
 visionTitle:aboutLines.slice(aboutLines.indexOf('Protect human life &'),aboutLines.indexOf('Protect human life &')+2).join('\n'),
};
export const COPY={ko:{...UI_COPY.ko,...ORIGINAL_COPY},en:{...UI_COPY.en,...ORIGINAL_COPY},vi:{...UI_COPY.vi,...ORIGINAL_COPY}};
export type Copy=typeof COPY[Lang];
export function familyOf(id:string){return families.find(f=>f.id===id||f.children.includes(id));}
