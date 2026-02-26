const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');
const nav = document.querySelector('.nav');
const typeTarget = document.getElementById('typeTarget');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (menuToggle && menuPanel) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuPanel.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  menuPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuPanel.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  if (menuToggle && menuPanel && menuPanel.classList.contains('open')) {
    menuPanel.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

function typeWriter(node, text, speed = 62) {
  if (!node) return;
  if (prefersReducedMotion) {
    node.textContent = text;
    return;
  }

  let index = 0;
  const tick = () => {
    node.textContent = text.slice(0, index + 1);
    index += 1;
    if (index < text.length) {
      window.setTimeout(tick, speed);
    }
  };
  window.setTimeout(tick, 350);
}

typeWriter(typeTarget, '');

const revealItems = [...document.querySelectorAll('.reveal')];

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.22 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const tiltCards = document.querySelectorAll('.tilt-card');

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

const heroFrontItems = [
  ...document.querySelectorAll('.hero-object .layer-1, .hero-object .layer-2, .hero-object .layer-3, .hero-object .object-mini-card')
];
const heroFrontImages = [
  ...document.querySelectorAll('.hero-object .layer-1 img, .hero-object .layer-2 img, .hero-object .layer-3 img, .hero-object .object-mini-card img')
];

if (!prefersReducedMotion && heroFrontItems.length) {
  let frontIndex = 0;
  const cycleDuration = 2800;
  const fadeOutStart = 0;
  const swapAt = 320;
  const frontSwitchAt = 520;
  const fadeInEnd = 860;

  const setFrontItem = (index) => {
    heroFrontItems.forEach((item, itemIndex) => {
      item.classList.toggle('is-front', itemIndex === index);
    });
  };

  setFrontItem(frontIndex);

  window.setInterval(() => {
    if (heroFrontImages.length === heroFrontItems.length) {
      window.setTimeout(() => {
        heroFrontImages.forEach((img) => img.classList.add('is-swapping'));
      }, fadeOutStart);

      window.setTimeout(() => {
        const currentSources = heroFrontImages.map((img) => img.getAttribute('src'));
        const rotatedSources = [currentSources[currentSources.length - 1], ...currentSources.slice(0, -1)];
        heroFrontImages.forEach((img, imageIndex) => {
          img.setAttribute('src', rotatedSources[imageIndex]);
        });
      }, swapAt);

      window.setTimeout(() => {
        frontIndex = (frontIndex + 1) % heroFrontItems.length;
        setFrontItem(frontIndex);
      }, frontSwitchAt);

      window.setTimeout(() => {
        heroFrontImages.forEach((img) => img.classList.remove('is-swapping'));
      }, fadeInEnd);
    } else {
      frontIndex = (frontIndex + 1) % heroFrontItems.length;
      setFrontItem(frontIndex);
    }
  }, cycleDuration);
}
