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

const heroIconStack = document.getElementById('heroIconStack');

function initHeroIconQueue() {
  if (!heroIconStack) return;

  const sourceIcons = [
    ...document.querySelectorAll('.cards-grid .app-card .app-icon img')
  ]
    .map((img) => img.getAttribute('src'))
    .filter(Boolean);

  if (!sourceIcons.length) return;

  heroIconStack.innerHTML = '';

  let queue = sourceIcons.map((src, index) => {
    const item = document.createElement('div');
    item.className = 'hero-stack-item';
    item.dataset.heroQueueItem = 'true';
    item.dataset.key = String(index);

    const image = document.createElement('img');
    image.src = src;
    image.alt = '';

    item.appendChild(image);
    heroIconStack.appendChild(item);
    return item;
  });

  const applyQueueLayout = () => {
    const total = queue.length;
    const maxDepth = Math.max(total - 1, 1);

    queue.forEach((item, depth) => {
      const t = depth / maxDepth;
      const angle = -45 + t * 90; // evenly distributed fan: -45..+45
      const size = 96 + t * 86; // front small -> back large
      const x = -20 + t * 40; // gentle fan spread
      const y = -8 + t * 16;
      const opacity = 0.96 - t * 0.1;

      item.style.width = `${size}px`;
      item.style.height = `${size}px`;
      item.style.opacity = `${opacity}`;
      item.style.zIndex = String(total - depth);
      item.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`;

      item.classList.toggle('is-front', depth === 0);
    });
  };

  applyQueueLayout();

  if (prefersReducedMotion || queue.length < 2) return;

  const cycleDuration = 2400;
  const cycle = () => {
    queue = [...queue.slice(1), queue[0]];
    applyQueueLayout();
  };

  window.setInterval(cycle, cycleDuration);
}

initHeroIconQueue();
