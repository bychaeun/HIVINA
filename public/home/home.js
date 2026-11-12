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

  /* ---- company history: wheel picker + dot timeline ---- */
  (function () {
    var wheel = $('[data-wheel]'), list = $('[data-wheel-list]');
    if (!wheel || !list) return;
    var rows = $$('[data-yr]', wheel), dots = $$('[data-dot]'), fill = $('[data-dotfill]');
    var N = rows.length, ROW = 120, yr = 0, off = 0, drag = null, moved = false, timer = null;
    function render() {
      list.style.transform = 'translateY(calc(var(--c) + ' + (-yr * ROW + off) + 'px))';
      rows.forEach(function (r, k) {
        r.className = 'wr d' + Math.min(3, Math.abs(k - yr));
        r.setAttribute('aria-selected', String(k === yr));
      });
      dots.forEach(function (d, k) {
        d.className = 'hd' + (k === yr ? ' on' : k < yr ? ' done' : '');
        d.setAttribute('aria-selected', String(k === yr));
      });
      if (fill) fill.style.width = 'calc((100% - 12px) * ' + (yr / (N - 1)) + ')';
    }
    function stop() { clearInterval(timer); timer = null; }
    function go(k) { yr = Math.max(0, Math.min(N - 1, k)); render(); }
    if (!reduced) timer = setInterval(function () { yr = (yr + 1) % N; render(); }, 4000);
    wheel.addEventListener('pointerdown', function (e) {
      stop(); drag = { y: e.clientY, start: yr * ROW }; moved = false; wheel.classList.add('drag');
    });
    wheel.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dy = e.clientY - drag.y; if (Math.abs(dy) > 5) moved = true;
      var raw = Math.max(-40, Math.min((N - 1) * ROW + 40, drag.start - dy));
      yr = Math.max(0, Math.min(N - 1, Math.round(raw / ROW))); off = yr * ROW - raw; render();
    });
    function end() { if (!drag) return; drag = null; off = 0; wheel.classList.remove('drag'); render(); }
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { wheel.addEventListener(ev, end); });
    rows.forEach(function (r, k) {
      r.addEventListener('click', function () { if (moved) { moved = false; return; } stop(); go(k); });
    });
    wheel.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault(); stop(); go(yr + (e.key === 'ArrowDown' ? 1 : -1));
    });
    var acc = 0, last = 0;
    wheel.addEventListener('wheel', function (e) {
      var next = Math.max(0, Math.min(N - 1, yr + (e.deltaY > 0 ? 1 : -1)));
      if (next === yr) return; /* at either end the page scrolls on as usual */
      e.preventDefault(); stop();
      var now = Date.now(); acc += Math.abs(e.deltaY);
      if (now - last < 160 || acc < 30) return;
      last = now; acc = 0; go(next);
    }, { passive: false });
    dots.forEach(function (d, k) {
      ['mouseenter', 'focus', 'click'].forEach(function (ev) { d.addEventListener(ev, function () { stop(); go(k); }); });
    });
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
    if (!reduced) timer = setInterval(function () { show(j + 1); }, 5000);
    tabs.forEach(function (t, n) { t.addEventListener('click', function () { clearInterval(timer); show(n); }); });
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
  /* ---- product tabs ---- */
  (function () {
    var tabs = $$('[data-tab]'), panels = $$('[data-panel]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-tab');
        tabs.forEach(function (x) { var on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-selected', String(on)); });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== k; });
      });
    });
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
        grid.className = 'g3 hs cat-' + c;
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
