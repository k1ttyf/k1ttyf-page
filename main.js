document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fontsLoaded = document.fonts
    ? Promise.all([
        document.fonts.load('500 48px "Geist"'),
        document.fonts.load('400 12px "Geist Mono"'),
      ]).catch(() => {})
    : Promise.resolve();
  const timeout = new Promise((resolve) => setTimeout(resolve, 1500));

  Promise.race([fontsLoaded, timeout]).then(() => {
    requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
  });

  const clickScreen = document.querySelector('.click');
  const block = document.querySelector('.block');
  const blockTitle = block.querySelector('h1');
  const blockParagraph = block.querySelector('.info p');

  const awesomeEffect = (options) => {
    let element = options.el;
    let result = '';
    let text = options.text;
    let possibleChars = options.possible ? options.possible : 'ABCDEFASIRUWJFCKSJHYWRKJEsdfskdjfk-+*/|}{[]~\\":;?/.><=+-_)(*&^%$#@!)}';
    let delay = options.delay ? options.delay : 70;

    const setText = (index, newText) => {
      setTimeout(() => {
        element.innerText = newText;
      }, index * delay);
    };

    for (let i = 0; i < text.length + 1; i++) {
      result = text.substr(0, i);
      for (let j = i; j < text.length; j++) {
        result += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      setText(i, result);
      result = '';
    }
  };

  const awesomeEffectTitle = (options) => {
    let text = options.text;
    let possibleChars = options.possible ? options.possible : 'ABCDEFASIRUWJFCKSJHYWRKJEsdfskdjfk-+*/|}{[]~\\":;?/.><=+-_)(*&^%$#@!)}';
    let delay = options.delay ? options.delay : 70;

    const setTitle = (index, newText) => {
      setTimeout(() => {
        document.title = newText;
      }, index * delay);
    };

    for (let i = 0; i < text.length + 1; i++) {
      let result = text.substr(0, i);
      for (let j = i; j < text.length; j++) {
        result += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      }
      setTitle(i, result);
    }

    setTimeout(() => {
      document.title = text;
    }, text.length * delay);
  };

  const audioElement = new Audio('music.mp3');
  audioElement.loop = true;

  const player = document.querySelector('.player');
  const playerToggle = player.querySelector('.player-toggle');
  const volumeInput = player.querySelector('.player-volume');
  const volumeValue = player.querySelector('.player-value');
  const DEFAULT_VOLUME = 10;

  const readSavedVolume = () => {
    try {
      const saved = parseInt(localStorage.getItem('k1ttyf-volume'), 10);
      return saved >= 0 && saved <= 100 ? saved : DEFAULT_VOLUME;
    } catch (e) {
      return DEFAULT_VOLUME;
    }
  };

  const setVolume = (percent, save) => {
    audioElement.volume = percent / 100;
    volumeInput.value = percent;
    volumeInput.style.setProperty('--fill', percent + '%');
    volumeValue.textContent = percent + '%';
    if (save) {
      try { localStorage.setItem('k1ttyf-volume', String(percent)); } catch (e) {}
    }
  };

  setVolume(readSavedVolume(), false);

  if (Math.abs(audioElement.volume - volumeInput.value / 100) > 0.01) {
    player.classList.add('no-volume');
  }

  const syncPlayer = () => {
    player.classList.toggle('is-paused', audioElement.paused);
    playerToggle.setAttribute('aria-label', audioElement.paused ? 'Играть' : 'Пауза');
  };

  audioElement.addEventListener('play', syncPlayer);
  audioElement.addEventListener('pause', syncPlayer);
  syncPlayer();

  playerToggle.addEventListener('click', () => {
    if (audioElement.paused) {
      audioElement.play().catch(() => {});
    } else {
      audioElement.pause();
    }
  });

  volumeInput.addEventListener('input', () => {
    setVolume(parseInt(volumeInput.value, 10), true);
  });

  const bgVideo = document.querySelector('.bg-video');
  const loadingLabel = clickScreen.querySelector('.loading');
  let entered = false;

  const showVideo = () => {
    if (!entered || !bgVideo.getAttribute('src')) return;
    bgVideo.play().catch(() => {});
  };

  const setVideoSource = (url) => {
    bgVideo.src = url;
    showVideo();
  };

  const loadBackground = async () => {
    const src = bgVideo.dataset.src;

    bgVideo.addEventListener('playing', () => {
      bgVideo.classList.add('is-on');
      if (prefersReducedMotion) bgVideo.pause();
    });

    bgVideo.addEventListener('error', () => {
      if (bgVideo.src.startsWith('blob:')) setVideoSource(src);
    });

    const saveData = navigator.connection && navigator.connection.saveData;
    if (prefersReducedMotion || saveData) {
      setVideoSource(src);
      return;
    }

    loadingLabel.hidden = false;
    try {
      const response = await fetch(src);
      if (!response.ok || !response.body) throw new Error('fetch failed');

      const total = parseInt(response.headers.get('content-length'), 10) || 0;
      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) {
          loadingLabel.textContent = 'загрузка фона ' + Math.min(99, Math.floor(received / total * 100)) + '%';
        }
      }

      setVideoSource(URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' })));
    } catch (e) {
      setVideoSource(src);
    }
    loadingLabel.hidden = true;
  };

  if (bgVideo) loadBackground();

  const reveal = () => {
    if (entered) return;
    entered = true;

    audioElement.play().catch(() => {});

    if (bgVideo) showVideo();
    clickScreen.classList.add('is-leaving');

    setTimeout(() => {
      clickScreen.hidden = true;
      block.hidden = false;
      block.classList.add('is-in');

    }, 240);

    if (prefersReducedMotion) return;

    const blockTitleText = blockTitle.textContent;
    const blockParagraphText = blockParagraph.textContent;
    const documentTitle = document.title;

    setInterval(function () {
      awesomeEffect({ el: blockTitle, text: blockTitleText });
      awesomeEffect({ el: blockParagraph, text: blockParagraphText });
      awesomeEffectTitle({ text: documentTitle });
    }, 2500);
  };

  clickScreen.addEventListener('click', reveal);
  clickScreen.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      reveal();
    }
  });
});
