/* Home page behaviour: mobile menu, history wheel, project slideshow, LPM 3D viewer, contact form. */
(function () {
  var dataEl = document.getElementById('hv-home-data');
  if (!dataEl) return;
  var DATA = JSON.parse(dataEl.textContent);
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- mobile menu ---- */
  var menuBtn = $('[data-act="menu"]'), menu = $('[data-menu]');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.hidden = !menu.hidden;
      menuBtn.setAttribute('aria-expanded', String(!menu.hidden));
    });
  }

  /* ---- company history: continuous flow, hover pause, synchronized timeline ---- */
  (function () {
    var wheel=$('[data-wheel]'),list=$('[data-wheel-list]');
    if(!wheel||!list)return;
    var rows=$$('[data-yr]',wheel),dots=$$('[data-dot]'),timeline=$('.hdl'),section=wheel.closest('.hx');
    var N=rows.length,ROW=120,pos=0,frame=0,last=0,tween=null,drag=null,moved=false;
    var hovering=false,focusing=false,visible=false;
    if(N<2)return;
    section.classList.add('history-flow');
    // One cycle on each side makes the last-to-first movement seamless.
    var before=document.createDocumentFragment(),after=document.createDocumentFragment();
    rows.forEach(function(row,i){
      row.dataset.historyIndex=String(i);
      [before,after].forEach(function(fragment){var copy=row.cloneNode(true);copy.removeAttribute('data-yr');copy.removeAttribute('id');copy.dataset.historyIndex=String(i);copy.setAttribute('aria-hidden','true');copy.tabIndex=-1;fragment.appendChild(copy);});
    });
    list.prepend(before);list.append(after);
    var displayed=$$('[data-history-index]',list),cursor=document.createElement('span');
    cursor.className='history-cursor';cursor.setAttribute('aria-hidden','true');
    if(timeline)timeline.appendChild(cursor);
    var modulo=function(v){return (v%N+N)%N;};
    function render(){
      var p=modulo(pos),selected=Math.round(p)%N;
      list.style.transform='translateY(calc(var(--c) - '+((N+p)*ROW)+'px))';
      displayed.forEach(function(row){var index=Number(row.dataset.historyIndex);var distance=Math.min(modulo(index-selected),modulo(selected-index));row.className='wr d'+Math.min(3,distance);if(row.getAttribute('aria-hidden')!=='true')row.setAttribute('aria-selected',String(index===selected));});
      dots.forEach(function(dot,i){dot.className='hd'+(i===selected?' on':i<selected?' done':'');dot.setAttribute('aria-selected',String(i===selected));});
      if(timeline){cursor.style.transform='translateX('+((timeline.clientWidth-13)*Math.min(p,N-1)/(N-1))+'px)';cursor.style.opacity=p>N-1?String(1-(p-(N-1))):'1';}
      section.dataset.historyState=hovering||focusing||drag?'paused':'flowing';
    }
    function canFlow(){return !reduced&&visible&&!hovering&&!focusing&&!drag&&!document.hidden;}
    function request(){if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}}
    function tick(now){
      var elapsed=Math.min(50,now-last);last=now;frame=0;
      if(tween){var t=Math.min(1,(now-tween.start)/550),ease=1-Math.pow(1-t,3);pos=tween.from+(tween.to-tween.from)*ease;if(t===1)tween=null;render();}
      else if(canFlow()){pos=modulo(pos+elapsed/6500);render();}
      if(tween||canFlow())frame=requestAnimationFrame(tick);
    }
    function go(index){var current=modulo(pos),distance=index-current;if(distance>N/2)distance-=N;if(distance<-N/2)distance+=N;tween={from:current,to:current+distance,start:performance.now()};request();}
    function pause(){hovering=true;go(Math.round(modulo(pos))%N);render();}
    function resume(){hovering=false;render();request();}
    wheel.addEventListener('mouseenter',pause);wheel.addEventListener('mouseleave',resume);
    if(timeline){timeline.addEventListener('mouseenter',function(){hovering=true;render();});timeline.addEventListener('mouseleave',resume);}
    section.addEventListener('focusin',function(){focusing=true;render();});
    section.addEventListener('focusout',function(e){if(!section.contains(e.relatedTarget)){focusing=false;render();request();}});
    displayed.forEach(function(row){row.addEventListener('click',function(){if(moved){moved=false;return;}go(Number(row.dataset.historyIndex));});});
    dots.forEach(function(dot,i){['mouseenter','focus','click'].forEach(function(event){dot.addEventListener(event,function(){go(i);});});});
    wheel.addEventListener('keydown',function(e){if(e.key!=='ArrowUp'&&e.key!=='ArrowDown')return;e.preventDefault();go(Math.max(0,Math.min(N-1,Math.round(modulo(pos))+(e.key==='ArrowDown'?1:-1))));});
    wheel.addEventListener('pointerdown',function(e){if(e.button!==0)return;drag={y:e.clientY,start:modulo(pos)};tween=null;moved=false;wheel.classList.add('drag');wheel.setPointerCapture(e.pointerId);});
    wheel.addEventListener('pointermove',function(e){if(!drag)return;var delta=e.clientY-drag.y;if(Math.abs(delta)>5)moved=true;pos=Math.max(0,Math.min(N-1,drag.start-delta/ROW));render();});
    function end(){if(!drag)return;drag=null;wheel.classList.remove('drag');go(Math.round(modulo(pos)));}
    wheel.addEventListener('pointerup',end);wheel.addEventListener('pointercancel',end);
    var wheelLast=0;
    wheel.addEventListener('wheel',function(e){var current=Math.round(modulo(pos)),next=Math.max(0,Math.min(N-1,current+(e.deltaY>0?1:-1)));if(next===current)return;e.preventDefault();if(Date.now()-wheelLast<220||Math.abs(e.deltaY)<12)return;wheelLast=Date.now();go(next);},{passive:false});
    new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;if(visible)request();},{threshold:.1}).observe(section);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)request();});
    render();
  })();

  /* ---- project slideshow ---- */
  (function () {
    var imgs = $$('.pjs'), tabs = $$('[data-pj]');
    if (!imgs.length) return;
    var text = $('[data-pj-text]'), dateEl = $('[data-pj-date]'), nameEl = $('[data-pj-name]');
    var j = 0, timer = null, P = DATA.projects;
    function show(k) {
      j = (k + P.length) % P.length;
      imgs.forEach(function (im, n) { im.classList.toggle('on', n === j); });
      tabs.forEach(function (t, n) { t.classList.toggle('on', n === j); t.setAttribute('aria-selected', String(n === j)); });
      if (dateEl) dateEl.textContent = P[j][2];
      if (nameEl) nameEl.textContent = P[j][1];
      if (text) text.className = j % 2 ? 'fa' : 'fb';
    }
    var slider=imgs[0].closest('.pjw')||imgs[0].closest('.project-featured');
    function stop(){clearInterval(timer);timer=null;}
    function start(){stop();if(slider)slider.classList.remove('manual-preview');if(!reduced&&!document.hidden)timer=setInterval(function(){show(j+1);},5000);}
    tabs.forEach(function(t,n){
      function choose(){stop();if(slider)slider.classList.add('manual-preview');show(n);}
      t.addEventListener('mouseenter',choose);t.addEventListener('focus',choose);t.addEventListener('click',choose);
    });
    if(slider){
      slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',start);
      slider.addEventListener('focusin',stop);slider.addEventListener('focusout',function(e){if(!slider.contains(e.relatedTarget))start();});
    }
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else if(!slider||!slider.matches(':hover'))start();});
    start();
  })();

  /* ---- LPM 3D layer viewer (model-viewer) ---- */
  (function () {
    var box = $('[data-mv]'), v = box && $('model-viewer', box);
    if (!v) return;
    var hint = $('[data-mv-hint]', box), replay = $('[data-act="mv-replay"]', box);
    var state = 'loading', active = '', frame = 0, loaded = false, lastBond = -1;
    var decor = null, decorColor = null, resin = null, resinColor = null;
    function update(next) {
      state = next;
      box.classList.toggle('expanded', next === 'expanded');
      if (hint) hint.textContent = DATA.hint[next === 'loading' || next === 'assembling' ? 'busy' : next] || '';
    }
    function tint(bond) {
      if (!decor || Math.abs(bond - lastBond) < .001) return;
      lastBond = bond;
      var f = Math.pow(1 - .25 * bond, 2.2);
      decor.setBaseColorFactor(decorColor.map(function (c, k) { return k < 3 ? c * f : c; }));
      if (resin) resin.setBaseColorFactor(resinColor.map(function (c, k) { return k === 3 ? c * (1 - bond) + .025 * bond : c; }));
    }
    function coat(time, progress) {
      if (active === 'Assemble') { var t = Math.max(0, Math.min(1, (time - 1.64) / .12)); tint(t * t * (3 - 2 * t)); }
      else { var s = active === 'Expand' ? progress : 1 - progress; tint(1 - Math.min(1, s / .15)); }
    }
    function center(progress) { var p = Math.max(0, Math.min(1, progress)); v.cameraTarget = '0m ' + (.0085 + .754 * p) + 'm 0m'; }
    function follow() {
      var t = Math.min(1, v.currentTime / (v.duration || 1)), p = t * t * (3 - 2 * t);
      center(active === 'Expand' ? p : active === 'Collapse' ? 1 - p : 0);
      coat(v.currentTime, p);
      frame = requestAnimationFrame(follow);
    }
    function finish() {
      cancelAnimationFrame(frame);
      center(active === 'Expand' ? 1 : 0);
      tint(active === 'Expand' ? 0 : 1);
      update(active === 'Expand' ? 'expanded' : 'assembled');
    }
    function play(name, next) {
      if (!loaded) return;
      cancelAnimationFrame(frame);
      active = name; update(next);
      v.pause(); v.animationName = name;
      Promise.resolve(v.updateComplete).then(function () {
        v.currentTime = 0; coat(0, 0);
        if (reduced) { v.currentTime = v.duration; finish(); return; }
        v.play({ repetitions: 1 });
        follow();
      });
    }
    function change() { if (state === 'assembled') play('Expand', 'expanding'); else if (state === 'expanded') play('Collapse', 'collapsing'); }
    function onLoad() {
      if (loaded || !v.model) return; loaded = true;
      var d = v.model.getMaterialByName('Walnut_Decor'), r = v.model.getMaterialByName('Translucent_Resin');
      decor = d ? d.pbrMetallicRoughness : null; decorColor = decor ? decor.baseColorFactor.slice() : null;
      resin = r ? r.pbrMetallicRoughness : null; resinColor = resin ? resin.baseColorFactor.slice() : null;
      play('Assemble', 'assembling');
    }
    v.addEventListener('load', onLoad);
    if (v.loaded) onLoad();
    v.addEventListener('finished', finish);
    v.addEventListener('error', function () { update('error'); });
    var p = null;
    v.addEventListener('pointerdown', function (e) { p = { x: e.clientX, y: e.clientY, id: e.pointerId }; });
    v.addEventListener('pointermove', function (e) { if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 7) p = null; });
    v.addEventListener('pointercancel', function () { p = null; });
    v.addEventListener('pointerup', function (e) { if (p && p.id === e.pointerId) change(); p = null; });
    v.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); change(); } });
    if (replay) replay.addEventListener('click', function () { play('Assemble', 'assembling'); });
  })();

  /* ---- contact form: hands the message to the visitor's mail app (no server, no fake success) ---- */
  (function () {
    var form = $('[data-contact-form]'), btn = form && $('[data-act="send"]', form);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var val = function (n) { var el = form.elements[n]; return el ? String(el.value).trim() : ''; };
      var missing = ['name', 'phone', 'message'].filter(function (n) { return !val(n); });
      if (missing.length) { var first = form.elements[missing[0]]; if (first) first.focus(); return; }
      var body = [val('name'), val('phone'), val('email'), '', val('message')].filter(function (x, i) { return x || i === 3; }).join('\n');
      location.href = 'mailto:' + DATA.mail + '?subject=' + encodeURIComponent(val('subject') || 'HI VINA') + '&body=' + encodeURIComponent(body);
    });
  })();
  /* ---- product tabs: family + LPM introduction / design groups ---- */
  (function () {
    var tabs = $$('[data-tab]'), panels = $$('[data-panel]');
    var subTabs = $$('[data-lpm]'), subPanels = $$('[data-lpm-view]');
    if (!tabs.length) return;
    var family = '0', view = 'intro';
    function render(sync) {
      tabs.forEach(function (t) { var on=t.getAttribute('data-tab')===family; t.classList.toggle('on',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1; });
      panels.forEach(function (p) { p.hidden=p.getAttribute('data-panel')!==family; });
      subTabs.forEach(function (t) { var on=t.getAttribute('data-lpm')===view;t.classList.toggle('on',on);t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1; });
      subPanels.forEach(function (p) { p.hidden=p.getAttribute('data-lpm-view')!==view; });
      if(sync){var url=new URL(location.href);url.searchParams.set('family',family);if(family==='0'&&view!=='intro')url.searchParams.set('view',view);else url.searchParams.delete('view');history.replaceState(history.state,'',url);}
    }
    function read(){var q=new URLSearchParams(location.search);var f=q.get('family')||'0',g=q.get('view')||'intro';family=tabs.some(function(t){return t.getAttribute('data-tab')===f;})?f:'0';view=subTabs.some(function(t){return t.getAttribute('data-lpm')===g;})?g:'intro';render(false);}
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        family=t.getAttribute('data-tab');render(true);
      });
    });
    subTabs.forEach(function(t){t.addEventListener('click',function(){view=t.getAttribute('data-lpm');render(true);});});
    [tabs,subTabs].forEach(function(group){group.forEach(function(t,i){t.addEventListener('keydown',function(e){var k=e.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(k))return;e.preventDefault();var next=k==='Home'?0:k==='End'?group.length-1:(i+(k==='ArrowRight'?1:-1)+group.length)%group.length;group[next].focus();group[next].click();});});});
    window.addEventListener('popstate',read);window.addEventListener('pageshow',read);read();
  })();

  /* ---- project categories (accordion) ---- */
  (function () {
    var btn = $('[data-act="cat"]'), list = $('[data-cat-list]'), grid = $('[data-catgrid]'), name = $('[data-cat-name]');
    if (!btn || !list || !grid) return;
    function close() {
      list.hidden = true; btn.setAttribute('aria-expanded', 'false');
      var ic = $('.ic', btn); if (ic) ic.classList.remove('up');
    }
    btn.addEventListener('click', function () {
      list.hidden = !list.hidden; btn.setAttribute('aria-expanded', String(!list.hidden));
      var ic = $('.ic', btn); if (ic) ic.classList.toggle('up', !list.hidden);
    });
    $$('[data-cat]', list).forEach(function (o) {
      o.addEventListener('click', function () {
        var c = o.getAttribute('data-cat');
        ['all','hotel','home'].forEach(function(k){grid.classList.toggle('cat-'+k,k===c);});
        if (name && DATA.cats) name.textContent = DATA.cats[c];
        $$('[data-cat]', list).forEach(function (x) { var on = x === o; x.classList.toggle('on', on); x.setAttribute('aria-selected', String(on)); });
        close();
      });
    });
  })();

  /* ---- news: newest first, rotating ---- */
  (function () {
    var rows = $$('[data-nw]'), N = DATA.news;
    if (!rows.length || !N) return;
    var img = $('[data-nw-img]'), date = $('[data-nw-date]'), title = $('[data-nw-title]'), link = $('[data-nw-link]'), text = $('[data-nw-text]');
    var k = 0, timer = null;
    function show(n) {
      k = (n + N.length) % N.length;
      if (img) img.src = N[k][0];
      if (date) date.textContent = N[k][1];
      if (title) title.textContent = N[k][2];
      if (link) link.href = N[k][3];
      if (text) text.className = k % 2 ? 'fa' : 'fb';
      rows.forEach(function (r, i) { r.classList.toggle('on', i === k); r.setAttribute('aria-selected', String(i === k)); });
    }
    if (!reduced) timer = setInterval(function () { show(k + 1); }, 6000);
    rows.forEach(function (r, i) { r.addEventListener('click', function () { clearInterval(timer); show(i); }); });
  })();
})();
