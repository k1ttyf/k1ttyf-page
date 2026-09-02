(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReducedMotion) return;

  const colors = ['#b892ff', '#ff8fd6', '#7ad7ff'];
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouseX = null;
  let mouseY = null;
  let lastX = null;
  let lastY = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (lastX === null || Math.hypot(mouseX - lastX, mouseY - lastY) > 6) {
      particles.push({
        x: mouseX,
        y: mouseY,
        r: Math.random() * 2 + 1.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.6 + 0.4,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      lastX = mouseX;
      lastY = mouseY;
      if (particles.length > 120) particles.shift();
    }
  });

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
    });
    particles = particles.filter((p) => p.life > 0);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    requestAnimationFrame(tick);
  }
  tick();
})();
