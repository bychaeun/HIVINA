/* Review interactions shared by the localized canvas pages. */
(function(){
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var all=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
  var menuButton=document.querySelector('[data-act="menu"]'),menu=document.querySelector('[data-menu]');
  if(menuButton&&menu){menuButton.addEventListener('click',function(){menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.focus();}});}

  // Begin writing only when the quote itself enters view; finish while stationary.
  all('.qsec').forEach(function(section){
    if(reduced||!('IntersectionObserver' in window))return;
    section.setAttribute('data-write-ready','');
    var observer=new IntersectionObserver(function(entries){
      if(entries.some(function(e){return e.isIntersecting;})){
        requestAnimationFrame(function(){section.classList.add('quote-visible');});
        observer.disconnect();
      }
    },{threshold:.35});
    observer.observe(section.querySelector('.qt')||section);
  });

  // Shared sliding selection pill. Works with wrapped tabs and responsive widths.
  all('.lng,.tbs[role="tablist"],.lpm-subnav[role="tablist"]').forEach(function(group){
    var isLanguage=group.classList.contains('lng');
    var isSubnav=group.classList.contains('lpm-subnav');
    var selector=isLanguage?'a':isSubnav?'[role="tab"]':'[data-tab]';
    var options=all(selector,group);
    if(!options.length)return;
    var indicator=document.createElement('span');
    indicator.className='selection-indicator';indicator.setAttribute('aria-hidden','true');
    group.appendChild(indicator);group.classList.add('has-indicator');
    var selected=function(){return group.querySelector(isLanguage?'a[aria-current="page"]':selector+'[aria-selected="true"]')||options[0];};
    function move(target,instant){
      if(instant)indicator.style.transition='none';
      indicator.style.width=target.offsetWidth+'px';indicator.style.height=target.offsetHeight+'px';
      indicator.style.transform='translate('+target.offsetLeft+'px,'+target.offsetTop+'px)';
      if(instant)requestAnimationFrame(function(){indicator.style.transition='';});
    }
    move(selected(),true);
    if('ResizeObserver'in window)new ResizeObserver(function(){move(selected(),true);}).observe(group);
    if(document.fonts)document.fonts.ready.then(function(){move(selected(),true);});
    options.forEach(function(option){
      if(isLanguage){
        var dest=new URL(option.href);dest.search=location.search;dest.hash=location.hash;option.href=dest.href;
      }
      option.addEventListener('click',function(event){
        if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
        if(!isLanguage){move(option,false);return;}
        if(option.getAttribute('aria-current')==='page')return;
        event.preventDefault();
        options.forEach(function(link){if(link===option)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
        move(option,false);
        if(reduced)location.assign(option.href);
        else setTimeout(function(){location.assign(option.href);},200);
      });
    });
    window.addEventListener('pageshow',function(){move(selected(),true);});
    if(!isLanguage)new MutationObserver(function(){move(selected(),false);}).observe(group,{subtree:true,attributes:true,attributeFilter:['aria-selected']});
  });

  // The factory still precedes each complete video playback. Video ends, the
  // still returns, then the sequence repeats. Never consume video offscreen.
  all('[data-history-video]').forEach(function(video){
    var media=video.closest('.hxl'),timer=null,visible=false;
    if(!media||reduced)return;
    function stop(){clearTimeout(timer);video.pause();}
    function start(){
      stop();media.classList.remove('video-visible');
      timer=setTimeout(function(){
        if(!visible||document.hidden)return;
        video.currentTime=0;
        var result=video.play();
        if(result)result.then(function(){if(visible&&!document.hidden)media.classList.add('video-visible');else video.pause();}).catch(function(){media.classList.remove('video-visible');});
      },3800);
    }
    video.addEventListener('ended',function(){if(visible&&!document.hidden)start();});
    video.addEventListener('error',function(){media.classList.remove('video-visible');});
    var observer=new IntersectionObserver(function(entries){
      visible=entries[0].isIntersecting;
      if(visible&&!document.hidden)start();else stop();
    },{threshold:.15});
    observer.observe(media);
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else if(visible)start();});
  });
})();
