import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const workspace=process.cwd();
const origin=path.resolve('src/assets/imported');
const archive=path.resolve('tmp/site-reference/original-media');
if(!origin.startsWith(workspace+path.sep)||!archive.startsWith(workspace+path.sep))throw Error('Media paths outside workspace');
fs.mkdirSync(archive,{recursive:true});
const files=fs.readdirSync(origin);const map=new Map();let totalBefore=0,totalAfter=0;
const queue=[...files];
async function worker(){while(queue.length){const name=queue.shift();const input=path.join(origin,name);const before=fs.statSync(input).size;totalBefore+=before;if(name.endsWith('.svg')||name.endsWith('.webp')){map.set(name,name);totalAfter+=before;continue;}const outputName=name.replace(/\.[^.]+$/,'.webp');await sharp(input).rotate().resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toFile(path.join(origin,outputName));map.set(name,outputName);totalAfter+=fs.statSync(path.join(origin,outputName)).size;fs.renameSync(input,path.join(archive,name));}}
await Promise.all(Array.from({length:4},worker));
const source=JSON.parse(fs.readFileSync('content/reference/source.json'));
function convert(o){if(typeof o==='string')return map.get(o)||o;if(Array.isArray(o))return o.map(convert);if(o&&typeof o==='object')return Object.fromEntries(Object.entries(o).map(([k,v])=>[map.get(k)||k,convert(v)]));return o;}
fs.writeFileSync('content/reference/source.json',JSON.stringify(convert(source),null,2));
const component='src/components/CompanyPhoto.astro';fs.writeFileSync(component,fs.readFileSync(component,'utf8').replace('0aafc0d7c9ec75.png','0aafc0d7c9ec75.webp'));
fs.writeFileSync('content/reference/media-manifest.json',JSON.stringify({format:'webp',maxDimension:2000,quality:88,originals:'Official HI VINA source URLs retained in source.json',files:map.size},null,2));
console.log(JSON.stringify({files:files.length,beforeMB:Math.round(totalBefore/1048576),afterMB:Math.round(totalAfter/1048576)}));
