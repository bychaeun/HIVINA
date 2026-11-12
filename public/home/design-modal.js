/* Open design sheets above the collection without losing its filter or scroll. */
(function(){
 if(document.documentElement.dataset.designModalReady)return;
 document.documentElement.dataset.designModalReady='true';
 // Every design sheet inside a frame is the content, never another modal host.
 var embedded=window.parent!==window&&/^\/(vi|en|ko)\/design\//.test(location.pathname);
 if(embedded){
  document.documentElement.classList.add('is-design-modal');
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();window.parent.postMessage({type:'hivina-design-close'},location.origin);}});
  document.addEventListener('click',function(e){var link=e.target.closest('a[href]');if(!link||link.hasAttribute('download'))return;var url=new URL(link.href);if(url.origin===location.origin&&/^\/(vi|en|ko)\/design\//.test(url.pathname)){url.searchParams.set('modal','1');link.href=url.href;}});
  var canonical=new URL(location.href);canonical.searchParams.delete('modal');
  window.parent.postMessage({type:'hivina-design-route',url:canonical.href},location.origin);
  return;
 }
 var dialog=null,iframe=null,opener=null,opened=false;
 function close(back){
  if(!dialog||!opened)return;
  opened=false;dialog.close();document.body.classList.remove('design-modal-open');
  if(opener&&document.contains(opener))opener.focus({preventScroll:true});
  if(back&&history.state&&history.state.hivinaDesignModal)history.back();
 }
 function prepare(){
  if(dialog)return;
  dialog=document.createElement('dialog');dialog.className='design-dialog';
  dialog.setAttribute('aria-label','HIVINA · Design');
  dialog.innerHTML='<button class="design-dialog-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><iframe class="design-dialog-frame" title="HIVINA · Design detail"></iframe>';
  document.body.appendChild(dialog);iframe=dialog.querySelector('iframe');
  dialog.querySelector('button').addEventListener('click',function(){close(true);});
  dialog.addEventListener('cancel',function(e){e.preventDefault();close(true);});
  dialog.addEventListener('click',function(e){var r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close(true);});
 }
 document.addEventListener('click',function(e){
  var link=e.target.closest('a[href]');
  if(!link||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
  var url=new URL(link.href);
  if(url.origin!==location.origin||!/^\/(vi|en|ko)\/design\//.test(url.pathname))return;
  if(typeof HTMLDialogElement==='undefined')return;
  e.preventDefault();prepare();opener=link;
  var frameUrl=new URL(url);frameUrl.searchParams.set('modal','1');iframe.src=frameUrl.href;
  history.pushState({hivinaDesignModal:true},'',url.href);
  opened=true;document.body.classList.add('design-modal-open');dialog.showModal();dialog.querySelector('button').focus();
 });
 window.addEventListener('popstate',function(){if(opened)close(false);});
 window.addEventListener('message',function(e){
  if(!opened||e.origin!==location.origin||e.source!==iframe.contentWindow||!e.data)return;
  if(e.data.type==='hivina-design-close')close(true);
  if(e.data.type==='hivina-design-route'&&typeof e.data.url==='string'){
   var url=new URL(e.data.url,location.origin);
   if(url.origin===location.origin&&/^\/(vi|en|ko)\/design\//.test(url.pathname))history.replaceState({hivinaDesignModal:true},'',url.href);
  }
 });
})();
