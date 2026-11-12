import fs from 'node:fs/promises';
import sharp from 'sharp';

// Presentation geometry, in relative units. No physical thickness is specified.
// Independent nodes and Pressed morphs support assembly and exploded views.
const out = new URL('../public/models/lpm-assembly.glb', import.meta.url);
const parts = [], views = [], accessors = [];
let byteLength = 0;
function bufferView(data, target) {
  const padding = (4 - byteLength % 4) % 4;
  if (padding) { parts.push(Buffer.alloc(padding)); byteLength += padding; }
  const index = views.length;
  views.push({ buffer: 0, byteOffset: byteLength, byteLength: data.byteLength, ...(target ? {target} : {}) });
  parts.push(Buffer.from(data.buffer, data.byteOffset, data.byteLength));
  byteLength += data.byteLength;
  return index;
}
function accessor(values, size, indices = false, vertex = true) {
  const data = indices ? new Uint16Array(values) : new Float32Array(values);
  const min = Array(size).fill(Infinity), max = Array(size).fill(-Infinity);
  values.forEach((v, i) => { min[i % size] = Math.min(min[i % size], v); max[i % size] = Math.max(max[i % size], v); });
  const index = accessors.length;
  accessors.push({bufferView: bufferView(data, vertex ? (indices ? 34963 : 34962) : undefined), componentType: indices ? 5123 : 5126, count: values.length / size, type: size === 1 ? 'SCALAR' : `VEC${size}`, min, max});
  return index;
}
function normals(p, ix) {
  const n = Array(p.length).fill(0);
  for (let i = 0; i < ix.length; i += 3) {
    const [a,b,c] = ix.slice(i, i+3).map(v => v*3);
    const u = [p[b]-p[a],p[b+1]-p[a+1],p[b+2]-p[a+2]];
    const v = [p[c]-p[a],p[c+1]-p[a+1],p[c+2]-p[a+2]];
    const cross = [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    for (const j of [a,b,c]) for (let k=0;k<3;k++) n[j+k]+=cross[k];
  }
  for (let i=0;i<n.length;i+=3) { const l=Math.hypot(...n.slice(i,i+3)) || 1; for(let k=0;k<3;k++) n[i+k]/=l; }
  return n;
}
function primitive(p, uv, ix, material, flat) {
  const n = normals(p, ix);
  const result = {attributes:{POSITION:accessor(p,3),NORMAL:accessor(n,3),...(material===2?{}:{TEXCOORD_0:accessor(uv,2)})},indices:accessor(ix,1,true),material};
  if(flat) {
    const fn=normals(flat,ix);
    result.targets=[{POSITION:accessor(flat.map((v,i)=>v-p[i]),3),NORMAL:accessor(fn.map((v,i)=>v-n[i]),3)}];
  }
  return result;
}
// A fine bevel catches light around the solid core, without outline strokes.
const cp=[], cuv=[], ci=[];
const rings=[[-.065,1.594,1.044],[-.059,1.6,1.05],[.059,1.6,1.05],[.065,1.594,1.044]];
for(const [y,x,z] of rings) for(const [px,pz] of [[-x,-z],[-x,z],[x,z],[x,-z]]) {cp.push(px,y,pz);cuv.push((px+1.6)/3.2,(pz+1.05)/2.1);}
ci.push(0,3,2,0,2,1,12,13,14,12,14,15);
for(let r=0;r<3;r++) for(let k=0;k<4;k++){const a=r*4+k,b=r*4+(k+1)%4,c=b+4,d=a+4;ci.push(a,b,c,a,c,d);}
// Split planar faces so a board edge never inherits a stretched top-face UV.
const coreTop = primitive(cp.slice(36),cuv.slice(24),[0,1,2,0,2,3],0);
const edgeP=[],edgeUV=[],edgeIX=[];
for(let r=0;r<3;r++) for(let k=0;k<4;k++) {
  const ids=[r*4+k,r*4+(k+1)%4,(r+1)*4+(k+1)%4,(r+1)*4+k],offset=edgeP.length/3;
  ids.forEach(id=>{const pos=cp.slice(id*3,id*3+3);edgeP.push(...pos);edgeUV.push((k%2?pos[0]:pos[2])*.8,pos[1]*.8+.5);});
  edgeIX.push(offset,offset+1,offset+2,offset,offset+2,offset+3);
}
const coreSide=primitive(edgeP,edgeUV,edgeIX,3);
const coreBottom=primitive(cp.slice(0,12),cuv.slice(0,8),[0,3,2,0,2,1],0);
function sheet(material, height, lift) {
  const p=[],uv=[],ix=[],flat=[]; const nx=64,nz=36;
  for(let j=0;j<=nz;j++) for(let i=0;i<=nx;i++) {
    const u=i/nx,v=j/nz,x=(u-.5)*3.2,z=(v-.5)*2.1;
    const bend=Math.pow(1-u,3)*lift*(.84+.16*v);
    p.push(x,height+bend,z);
    // Rotate only the decorative print by 90 degrees; preserve sheet geometry.
    uv.push(...(material===1?[v,1-u]:[u,v]));
    flat.push(x,.075+(material===2?.007:0),z);
  }
  for(let j=0;j<nz;j++) for(let i=0;i<nx;i++) {const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;ix.push(a,c,b,b,c,d);}
  return {primitives:[primitive(p,uv,ix,material,flat)],weights:[1],extras:{targetNames:['Pressed']}};
}
const paper=sheet(1,.14,.55), resin=sheet(2,.39,.72);
// Fine, non-directional fibres for MDF; no timber rings on faces or edges.
const size=512, pixels=Buffer.alloc(size*size*3);let seed=4137;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const noise=(random()-.5)*20+(Math.sin(x*.71+y*.29)*Math.sin(y*.37))*3;
  const fleck=random()<.035?-15:0;
  for(let k=0;k<3;k++)pixels[(y*size+x)*3+k]=[171,148,113][k]+noise+fleck;
}
const mdf=await sharp(pixels,{raw:{width:size,height:size,channels:3}}).png().toBuffer();
const images=[];
images.push({bufferView:bufferView(mdf),mimeType:'image/png'});
for(const file of ['df86797add0c54.webp']) {
  const jpg=await sharp(await fs.readFile(new URL(`../src/assets/imported/${file}`,import.meta.url))).resize({width:1024,withoutEnlargement:true}).jpeg({quality:92}).toBuffer();
  images.push({bufferView:bufferView(jpg),mimeType:'image/jpeg'});
}
const animations=[];
function clip(name,duration,sample) {
  const frames=Math.ceil(duration*60),times=Array.from({length:frames+1},(_,i)=>i*duration/frames);
  const input=accessor(times,1,false,false),samplers=[],channels=[];
  for(const [node,path,size] of [[1,'translation',3],[2,'translation',3],[3,'translation',3],[2,'weights',1],[3,'weights',1]]){
    const values=times.flatMap(t=>sample(t,node,path));
    const sampler=samplers.length;samplers.push({input,output:accessor(values,size,false,false),interpolation:'LINEAR'});channels.push({sampler,target:{node,path}});
  }
  animations.push({name,samplers,channels});
}
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function fall(t,start,duration){if(t<start)return 5;const p=(t-start)/duration;if(p<1)return 5*(1-p*p*p);if(p<1.26)return .035*Math.sin((p-1)/.26*Math.PI);return 0;}
clip('Assemble',2.2,(t,node,path)=>path==='weights'?[1]:[0,fall(t,[0,0,.66,1.28][node],node===1?.58:.46),0]);
function exploded(t,node,path,reverse=false){const p=smooth(reverse?1-t/1.05:t/1.05);return path==='weights'?[1-p]:[0,node===1?0:(node===2?.2:.48)*p,0];}
clip('Expand',1.05,(t,node,path)=>exploded(t,node,path));
clip('Collapse',1.05,(t,node,path)=>exploded(t,node,path,true));
const gltf={asset:{version:'2.0',generator:'HIVINA LPM presentation model'},
  extensionsUsed:['KHR_materials_ior','KHR_materials_specular'],
  scene:0,scenes:[{name:'LPM_Assembly',nodes:[0]}],
  nodes:[{name:'LPM_Assembly',children:[1,2,3]},
    {name:'Core_Board',mesh:0,extras:{label:'Core재'}},
    {name:'Decorative_Paper',mesh:1,extras:{label:'Decorative Paper'}},
    {name:'Resin_Sheet',mesh:2,extras:{label:'요소/멜라민 수지 함침',presentation:'Separate translucent sheet as requested in reference'}}],
  meshes:[{name:'Core_Board',primitives:[coreTop,coreSide,coreBottom]}, {...paper,name:'Decorative_Paper'}, {...resin,name:'Resin_Sheet'}],animations,
  materials:[
    {name:'MDF_Surface',pbrMetallicRoughness:{baseColorTexture:{index:0},metallicFactor:0,roughnessFactor:.96},extensions:{KHR_materials_specular:{specularFactor:.05}}},
    {name:'Walnut_Decor',doubleSided:true,pbrMetallicRoughness:{baseColorTexture:{index:1},baseColorFactor:[.73,.59,.47,1],metallicFactor:0,roughnessFactor:1},extensions:{KHR_materials_specular:{specularFactor:0}}},
    {name:'Translucent_Resin',doubleSided:true,alphaMode:'BLEND',pbrMetallicRoughness:{baseColorFactor:[.91,.95,.97,.18],metallicFactor:0,roughnessFactor:.45},extensions:{KHR_materials_ior:{ior:1.46},KHR_materials_specular:{specularFactor:.3}}},
    {name:'MDF_Edge',pbrMetallicRoughness:{baseColorTexture:{index:0},baseColorFactor:[.91,.9,.88,1],metallicFactor:0,roughnessFactor:.98},extensions:{KHR_materials_specular:{specularFactor:.05}}}
  ],samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],
  textures:[{sampler:0,source:0},{sampler:0,source:1}],images,bufferViews:views,accessors,buffers:[{byteLength}]};
const json=Buffer.from(JSON.stringify(gltf));
const jsonPad=Buffer.alloc((4-json.length%4)%4,0x20);
const bin=Buffer.concat(parts),binPad=Buffer.alloc((4-bin.length%4)%4);
const header=Buffer.alloc(12);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+json.length+jsonPad.length+8+bin.length+binPad.length,8);
const jh=Buffer.alloc(8);jh.writeUInt32LE(json.length+jsonPad.length);jh.writeUInt32LE(0x4e4f534a,4);
const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length+binPad.length);bh.writeUInt32LE(0x004e4942,4);
await fs.mkdir(new URL('../public/models/',import.meta.url),{recursive:true});
await fs.writeFile(out,Buffer.concat([header,jh,json,jsonPad,bh,bin,binPad]));
console.log(`Created ${out.pathname}: ${header.readUInt32LE(8)} bytes; 3 meshes; Assemble, Expand, Collapse clips.`);
