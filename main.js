$(document).ready(function () {
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
    location.reload(false);
  });

  $('.click').on('click', function () {
    $('.click').fadeOut(300);
    setTimeout(function () {
      $('.block').fadeIn(300);
      audioElement.play();
      const particlesConfig = {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000',
            },
            polygon: {
              nb_sides: 5,
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
      };
      
      particlesJS('particles-js', particlesConfig);      
    }, 300);

    const blockTitle = $('.block h1');
    const blockTitleText = blockTitle.text();
    const blockParagraph = $('.block p');
    const blockParagraphText = blockParagraph.text();
    const documentTitle = document.title;

    setInterval(function () {
      const titleOptions = {
        el: blockTitle[0],
        text: blockTitleText,
      };
      awesomeEffect(titleOptions);

      const paragraphOptions = {
        el: blockParagraph[0],
        text: blockParagraphText,
      };
      awesomeEffect(paragraphOptions);

      const documentTitleOptions = {
        text: documentTitle,
      };
      awesomeEffectTitle(documentTitleOptions);
    }, 2500);

    const discordLink = $('.social-link .fa-discord').parent();
    discordLink.on("click", function(){
      toastr.info(`Запрашиваем ссылку Discord...`);
      $.ajax({
        type: "POST",
        url: "https://api.k1ttyf.xyz/discord",
        success: function(response){
          toastr.clear();
          discordLink.attr("href", response.url);
          discordLink.attr("target", response.url);
          window.open(response.url, '_blank');
          discordLink.off("click");
        },
        error: function(error){
          toastr.clear();
          toastr.error(`Повторите попытку позже.`, `Произошла ошибка!`);
        }
      })
    });
  });
});
