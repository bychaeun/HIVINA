import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('content/reference/source.json'));
console.log(data.projects.map(x=>[x.slug,x.paragraphs.length])); console.log(data.news.map(x=>[x.slug,x.paragraphs.length]));
const list=JSON.parse(fs.readFileSync('tmp/site-reference/media-downloads.json'));
let completed=0,failures=[];
const queue=[...list];
async function worker(){while(queue.length){const item=queue.shift();const path='src/assets/imported/'+item.file;if(fs.existsSync(path)){completed++;continue;}try{const r=await fetch(item.url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(r.status);fs.writeFileSync(path,Buffer.from(await r.arrayBuffer()));completed++;if(completed%40===0)console.log('Downloaded '+completed+'/'+list.length);}catch(e){failures.push({url:item.url,error:String(e)});}}}
await Promise.all(Array.from({length:6},worker));
fs.writeFileSync('tmp/site-reference/download-errors.json',JSON.stringify(failures,null,2)); console.log(JSON.stringify({completed,failed:failures.length}));
