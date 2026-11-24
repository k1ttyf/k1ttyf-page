(function () {
  const ENDPOINT = 'https://api.k1ttyf.xyz/lastfm/now-playing';
  const PROFILE = 'https://www.last.fm/user/k1ttyf';
  const POLL_MS = 20000;

  const root = document.querySelector('.np');
  if (!root) return;
  const wrap = root.closest('.np-wrap');

  const art = root.querySelector('.np-art');
  const cover404 = root.querySelector('.np-404');
  const title = root.querySelector('.np-title');
  const meta = root.querySelector('.np-meta');
  const time = root.querySelector('.np-time');
  const elapsedEl = root.querySelector('.np-elapsed');
  const totalEl = root.querySelector('.np-total');
  const fill = root.querySelector('.np-fill');

  let current = null;
  let pollTimer = null;
  let busy = false;
  const SWAP_OUT_MS = 200;

  const fmt = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };

  const tick = () => {
    if (!current || !current.durationMs || current.startMs == null) return;
    const elapsed = Math.min(Date.now() - current.startMs, current.durationMs);
    elapsedEl.textContent = fmt(elapsed);
    fill.style.width = (elapsed / current.durationMs * 100) + '%';
  };
  setInterval(tick, 1000);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const preload = (src) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => img.decode().then(() => resolve(true), () => resolve(true));
    img.onerror = () => resolve(false);
    img.src = src;
  });

  const setCover = (state) => {
    art.hidden = state !== 'art';
    cover404.hidden = state !== '404';
  };

  art.addEventListener('error', () => {
    if (art.getAttribute('src')) setCover('404');
  });

  const render = (np, startMs, imageOk) => {
    title.textContent = np.name;
    meta.textContent = np.artist + (np.album ? ' · ' + np.album : '');
    root.href = np.url || PROFILE;
    root.setAttribute('aria-label', 'Сейчас слушаю: ' + np.artist + ' — ' + np.name);

    if (!np.image) {
      setCover('none');
    } else if (imageOk) {
      art.src = np.image;
      setCover('art');
    } else {
      art.removeAttribute('src');
      setCover('404');
    }

    const showTime = np.durationMs > 0 && startMs != null;
    time.hidden = !showTime;
    if (showTime) {
      totalEl.textContent = fmt(np.durationMs);
      fill.style.transition = 'none';
      tick();
      fill.offsetWidth;
      fill.style.transition = '';
    }
  };

  const hide = () => {
    wrap.classList.remove('is-on');
    current = null;
  };

  const update = async () => {
    let np;
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) return;
      np = await res.json();
    } catch (e) {
      return;
    }

    if (!np.playing) {
      hide();
      return;
    }

    const key = np.artist + '\u0000' + np.name;
    if (busy || (current && current.key === key)) return;
    busy = true;

    try {
      const sawChange = current !== null;
      const startMs = np.startMs != null ? np.startMs : (sawChange ? Date.now() : null);
      const swapping = sawChange && wrap.classList.contains('is-on');

      const imageOk = np.image
        ? await Promise.race([preload(np.image), wait(15000).then(() => true)])
        : false;

      if (swapping) {
        root.classList.add('is-swapping');
        await wait(SWAP_OUT_MS);
      }

      current = { key, durationMs: np.durationMs, startMs };
      render(np, startMs, imageOk);

      if (swapping) {
        root.offsetWidth;
        root.classList.remove('is-swapping');
      }
      wrap.classList.add('is-on');
    } finally {
      busy = false;
    }
  };

  const start = () => {
    if (pollTimer) return;
    update();
    pollTimer = setInterval(update, POLL_MS);
  };

  const stop = () => {
    clearInterval(pollTimer);
    pollTimer = null;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  start();
})();
