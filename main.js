document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.innerWidth < 600;

  const clickScreen = document.querySelector('.click');
  const block = document.querySelector('.block');
  const blockTitle = block.querySelector('h1');
  const blockParagraph = block.querySelector('p');

  const fadeOut = (el, duration, callback) => {
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
      el.style.opacity = '0';
    });
    setTimeout(() => {
      el.style.display = 'none';
      if (callback) callback();
    }, duration);
  };

  const fadeIn = (el, duration, display) => {
    el.style.display = display;
    el.style.opacity = '0';
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
      });
    });
  };

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
  audioElement.volume = 0.1;
  audioElement.addEventListener('ended', function () {
    location.reload();
  });

  const initParticles = () => {
    if (typeof particlesJS === 'undefined' || prefersReducedMotion) return;

    particlesJS('particles-js', {
      particles: {
        number: {
          value: isSmallScreen ? 26 : 55,
          density: { enable: true, value_area: 800 },
        },
        color: { value: ['#b892ff', '#ff8fd6', '#7ad7ff'] },
        shape: { type: 'circle' },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false },
        },
        size: {
          value: 2.5,
          random: true,
          anim: { enable: false },
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#b892ff',
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: !isSmallScreen, mode: 'grab' },
          onclick: { enable: false },
          resize: true,
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.4 } },
        },
      },
      retina_detect: true,
    });
  };

  const reveal = () => {
    fadeOut(clickScreen, 300);
    setTimeout(function () {
      fadeIn(block, 300, 'flex');
      audioElement.play().catch(() => {});
      initParticles();
    }, 300);

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
