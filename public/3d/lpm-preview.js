const viewer=document.querySelector('#assembly');
const toggle=document.querySelector('#toggle');
const replay=document.querySelector('#replay');
const status=document.querySelector('#status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let state='loading',active='',pointer=null,timers=[],centerFrame=0;
let decorPbr=null,originalColor=null,resinPbr=null,resinColor=null,lastBond=-1;
function coatingTint(bond){
  if(!decorPbr||Math.abs(bond-lastBond)<.001)return;
  lastBond=bond;
  // glTF factors are linear: convert the requested visible 25% reduction
  // to linear light, rather than multiplying linear RGB by 0.75.
  const factor=Math.pow(1-.25*bond,2.2);
  decorPbr.setBaseColorFactor(originalColor.map((v,i)=>i<3?v*factor:v));
  // A bonded coating is clear; the separated sheet retains its visible tint.
  // Leaving the white overlay opaque would wash out the darkened paper.
  resinPbr?.setBaseColorFactor(resinColor.map((v,i)=>i===3?v*(1-bond)+.025*bond:v));
}
function coatingAt(time,progress){
  if(active==='Assemble'){
    const t=Math.max(0,Math.min(1,(time-1.64)/.12));
    coatingTint(t*t*(3-2*t));
  }else{
    const separation=active==='Expand'?progress:1-progress;
    coatingTint(1-Math.min(1,separation/.15));
  }
}
// Geometry bounds: pressed [-0.065, 0.082], expanded [-0.065, 1.59].
// Keep x/z at the board centre; clicks must never move the orbit pivot.
function centerAt(progress){
  const p=Math.max(0,Math.min(1,progress));
  viewer.cameraTarget=`0m ${.0085+.754*p}m 0m`;
}
function followCenter(){
  const t=Math.min(1,viewer.currentTime/viewer.duration);
  const p=t*t*(3-2*t);
  centerAt(active==='Expand'?p:active==='Collapse'?1-p:0);
  coatingAt(viewer.currentTime,p);
  centerFrame=requestAnimationFrame(followCenter);
}
function update(next){
  state=next;viewer.dataset.state=next;
  const busy=['loading','assembling','expanding','collapsing'].includes(next);
  toggle.disabled=busy;replay.disabled=busy;
  toggle.textContent=next==='expanded'?'다시 누르면 합쳐집니다':busy?'소재가 쌓이고 있습니다':'모델을 눌러 구성을 살펴보세요';
  if(next==='expanding')toggle.textContent='구성 요소를 펼치고 있습니다';
  if(next==='collapsing')toggle.textContent='하나의 표면으로 합쳐지고 있습니다';
  const messages={assembled:'클릭 · 터치하여 분리 / 드래그하여 회전',expanded:'각 층의 구조 / 다시 클릭하면 합쳐집니다',expanding:'구성 요소 분리 중',collapsing:'구성 요소 합치는 중'};
  if(messages[next])status.textContent=messages[next];
}
function finish(){
  cancelAnimationFrame(centerFrame);
  centerAt(active==='Expand'?1:0);
  coatingTint(active==='Expand'?0:1);
  if(active==='Assemble'||active==='Collapse')update('assembled');
  else if(active==='Expand')update('expanded');
}
async function play(name,next){
  cancelAnimationFrame(centerFrame);
  timers.forEach(clearTimeout);timers=[];active=name;update(next);
  viewer.pause();viewer.animationName=name;
  await viewer.updateComplete;
  viewer.currentTime=0;
  coatingAt(0,0);
  if(reduced){viewer.currentTime=viewer.duration;finish();return;}
  viewer.play({repetitions:1});
  followCenter();
  if(name==='Assemble'){
    status.textContent='01 / MDF 보드';
    timers.push(setTimeout(()=>status.textContent='02 / Decorative Paper',660));
    timers.push(setTimeout(()=>status.textContent='03 / 반투명 코팅층',1280));
  }
}
function change(){if(state==='assembled')play('Expand','expanding');else if(state==='expanded')play('Collapse','collapsing');}
viewer.addEventListener('load',()=>{
  decorPbr=viewer.model.getMaterialByName('Walnut_Decor')?.pbrMetallicRoughness;
  originalColor=decorPbr?.baseColorFactor.slice();
  resinPbr=viewer.model.getMaterialByName('Translucent_Resin')?.pbrMetallicRoughness;
  resinColor=resinPbr?.baseColorFactor.slice();
  play('Assemble','assembling');
},{once:true});
viewer.addEventListener('finished',finish);
viewer.addEventListener('error',()=>{status.textContent='3D 모델을 불러오지 못했습니다. 페이지를 새로고침해 주세요.';});
toggle.addEventListener('click',change);
replay.addEventListener('click',()=>play('Assemble','assembling'));
viewer.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY,id:e.pointerId};});
viewer.addEventListener('pointermove',e=>{if(pointer&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>7)pointer=null;});
viewer.addEventListener('pointercancel',()=>pointer=null);
viewer.addEventListener('pointerup',e=>{if(pointer&&pointer.id===e.pointerId)change();pointer=null;});
viewer.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();change();}});
