(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReducedMotion) return;

  const EASE = 0.12;

  let current = window.scrollY;
  let target = current;
  let frame = null;

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  const step = () => {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo({ top: current, behavior: 'instant' });
    frame = current === target ? null : requestAnimationFrame(step);
  };

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = maxScroll();
    if (max <= 0) return;

    e.preventDefault();
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 16;
    else if (e.deltaMode === 2) delta *= window.innerHeight;

    if (!frame) current = window.scrollY;
    target = Math.max(0, Math.min(max, target + delta));
    if (!frame) frame = requestAnimationFrame(step);
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (!frame) current = target = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    target = Math.max(0, Math.min(maxScroll(), target));
  });
})();
