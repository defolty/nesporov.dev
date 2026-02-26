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
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 20);
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
