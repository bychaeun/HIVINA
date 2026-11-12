const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Use native anchor navigation so hashes, browser Back and reading order agree.
window.addEventListener('pageshow', (event) => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (!event.persisted && navigation?.type === 'navigate' && !location.hash) {
    window.scrollTo({top:0,behavior:'instant'});
  }
});

// 2) 화면에 들어오면 나타나기 (data-reveal)
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

// 3) 숫자 카운트업 (data-count)
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target as HTMLElement;
    const end = Number(el.dataset.count);
    const start = end > 1000 ? end - 40 : 0;
    const dur = reduce ? 0 : 1600;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = dur ? Math.min((now - t0) / dur, 1) : 1;
      el.textContent = String(Math.round(start + (end - start) * (1 - Math.pow(1 - p, 4))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

// 4) 패럴랙스 (data-parallax="0.2")
const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
if (!reduce && parallax.length) {
  const update = () => {
    const vh = window.innerHeight;
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      const speed = Number(el.dataset.parallax) || 0.2;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1)}px, 0)`;
    });
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// 5) 헤더: 스크롤 시 배경 전환
const header = document.querySelector('.site-header');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
