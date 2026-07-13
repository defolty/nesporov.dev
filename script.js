const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuToggle = document.getElementById('menuToggle');
const menuPanel = document.getElementById('menuPanel');

function setMenuOpen(isOpen) {
  if (!menuToggle || !menuPanel) return;
  menuPanel.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', isOpen);
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menuPanel?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

document.addEventListener('click', (event) => {
  if (!menuPanel?.classList.contains('open')) return;
  if (menuPanel.contains(event.target) || menuToggle?.contains(event.target)) return;
  setMenuOpen(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) setMenuOpen(false);
}, { passive: true });

const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const glowItems = document.querySelectorAll('[data-glow]');

glowItems.forEach((item) => {
  item.style.setProperty('--glow-scale', item.dataset.glow || '1.02');
  item.addEventListener('pointerenter', () => item.classList.add('is-glowing'));
  item.addEventListener('pointerleave', () => item.classList.remove('is-glowing'));
});

const primaryTech = [
  'swift',
  'uikit',
  'swiftui',
  'modular architecture',
  'tuist',
  'viper',
  'clean swift',
  'combine',
  'async/await',
  'dependency injection',
  'design systems',
  'git',
  'gitlab ci'
];

const secondaryTech = [
  'unit tests',
  'ui tests',
  'snapshot tests',
  'xctest',
  'sniffers',
  'ci/cd automation',
  'fastlane',
  'testflight',
  'app store connect',
  'storekit',
  'revenuecat',
  'push notifications',
  'core data'
];

function populateMarquee(selector, items) {
  const marquee = document.querySelector(selector);
  if (!marquee) return;

  [...items, ...items].forEach((item, index) => {
    const pill = document.createElement('span');
    pill.className = 'tech-pill';
    pill.textContent = item;
    if (index >= items.length) pill.setAttribute('aria-hidden', 'true');
    marquee.append(pill);
  });
}

populateMarquee('[data-marquee="primary"]', primaryTech);
populateMarquee('[data-marquee="secondary"]', secondaryTech);

const sourceFiles = [
  [
    '// ProfileInteractor.swift',
    '// nesporov.dev — iOS Software Engineer',
    '',
    'import UIKit',
    'import Combine',
    '',
    'protocol ProfileInteractorInput {',
    '    func loadProfile()',
    '    func trackOpen()',
    '}',
    '',
    'final class ProfileInteractor {',
    '    private let service: NetworkService',
    '    private var bag = Set<AnyCancellable>()',
    '    weak var presenter: ProfilePresenterInput?',
    '',
    '    init(service: NetworkService) {',
    '        self.service = service',
    '    }',
    '}',
    '',
    'extension ProfileInteractor: ProfileInteractorInput {',
    '    func loadProfile() {',
    '        service.fetch(.profile)',
    '            .receive(on: DispatchQueue.main)',
    '            .sink { [weak self] profile in',
    '                self?.presenter?.didLoad(profile)',
    '            }',
    '            .store(in: &bag)',
    '    }',
    '}',
    '',
    '// clean architecture',
    '// strict layer isolation',
    '// advanced UIKit · custom components'
  ].join('\n'),
  [
    '// AppModule.swift',
    '// viper · modular · di',
    '',
    'import UIKit',
    '',
    'enum AppModule {',
    '    static func build() -> UIViewController {',
    '        let view = ProfileViewController()',
    '        let service = NetworkService.live',
    '        let interactor = ProfileInteractor(',
    '            service: service',
    '        )',
    '        let router = ProfileRouter()',
    '        let presenter = ProfilePresenter(',
    '            view: view,',
    '            interactor: interactor,',
    '            router: router',
    '        )',
    '        view.presenter = presenter',
    '        interactor.presenter = presenter',
    '        router.viewController = view',
    '        return view',
    '    }',
    '}',
    '',
    'struct DesignSystem {',
    '    static let radius: CGFloat = 8',
    '    static let accent = Color("blurple")',
    '}',
    '',
    '// tuist-based pipeline',
    '// design system · reuse',
    '// 5M+ monthly users across Europe'
  ].join('\n'),
  [
    '// ProfileTests.swift',
    '// unit · ui · snapshot — full cycle',
    '',
    'import XCTest',
    '@testable import Profile',
    '',
    'final class ProfileTests: XCTestCase {',
    '    func test_load_rendersName() {',
    '        let sut = AppModule.build()',
    '        sut.loadViewIfNeeded()',
    '        XCTAssertEqual(',
    '            sut.titleLabel.text,',
    '            "nikita nesporov"',
    '        )',
    '    }',
    '',
    '    func test_snapshot_darkMode() {',
    '        assertSnapshot(',
    '            of: AppModule.build(),',
    '            as: .image(on: .iPhone15Pro)',
    '        )',
    '    }',
    '}',
    '',
    '@main',
    'struct PortfolioApp {',
    '    static func main() {',
    '        Window.shared.setRoot(AppModule.build())',
    '        Analytics.track(.launch)',
    '    }',
    '}',
    '',
    '// fastlane · testflight',
    '// app store connect · storekit'
  ].join('\n')
];

const codeColumns = [...document.querySelectorAll('[data-code-column]')].map((column, index) => ({
  element: column,
  content: column.querySelector('.code-content'),
  source: sourceFiles[index] || '',
  parallax: [16, 26, 36][index] || 16,
  renderedCharacters: -1
}));

const cursorGlow = document.querySelector('.cursor-glow');
let scrollProgress = 0;
let mouseX = 0.5;
let mouseY = 0.42;
let targetMouseX = mouseX;
let targetMouseY = mouseY;
let backgroundFrame = 0;

function updateScrollProgress() {
  const maximumScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollProgress = Math.min(1, Math.max(0, window.scrollY / maximumScroll));
}

function renderBackground() {
  mouseX += (targetMouseX - mouseX) * 0.07;
  mouseY += (targetMouseY - mouseY) * 0.07;

  const relativeX = mouseX - 0.5;
  const relativeY = mouseY - 0.5;
  const anchor = window.innerHeight * 0.48;

  codeColumns.forEach((column) => {
    const characters = Math.round(Math.min(1, scrollProgress * 0.6) * column.source.length);
    if (characters !== column.renderedCharacters && column.content) {
      column.content.textContent = column.source.slice(0, characters);
      column.renderedCharacters = characters;
    }

    const visibleSource = column.source.slice(0, characters);
    const lineCount = (visibleSource.match(/\n/g) || []).length;
    const offsetX = relativeX * column.parallax;
    const offsetY = anchor - lineCount * 22 + relativeY * column.parallax * 1.3;
    column.element.style.transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px)`;
  });

  if (cursorGlow) {
    cursorGlow.style.left = `${(mouseX * 100).toFixed(2)}%`;
    cursorGlow.style.top = `${(mouseY * 100).toFixed(2)}%`;
  }

  backgroundFrame = window.requestAnimationFrame(renderBackground);
}

updateScrollProgress();

if (prefersReducedMotion) {
  codeColumns.forEach((column) => {
    if (column.content) column.content.textContent = column.source.slice(0, Math.round(column.source.length * 0.35));
  });
} else {
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('pointermove', (event) => {
    targetMouseX = event.clientX / window.innerWidth;
    targetMouseY = event.clientY / window.innerHeight;
  }, { passive: true });
  backgroundFrame = window.requestAnimationFrame(renderBackground);
}

document.addEventListener('visibilitychange', () => {
  if (prefersReducedMotion) return;
  if (document.hidden && backgroundFrame) {
    window.cancelAnimationFrame(backgroundFrame);
    backgroundFrame = 0;
  } else if (!document.hidden && !backgroundFrame) {
    backgroundFrame = window.requestAnimationFrame(renderBackground);
  }
});

const navigationLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  observedSections.forEach((section) => navigationObserver.observe(section));
}

const copyEmailButton = document.getElementById('copyEmailButton');
const emailStatus = document.getElementById('emailStatus');

copyEmailButton?.addEventListener('click', async () => {
  const address = [109, 97, 105, 110, 64, 110, 101, 115, 112, 111, 114, 111, 118, 46, 100, 101, 118]
    .map((character) => String.fromCharCode(character))
    .join('');

  try {
    await navigator.clipboard.writeText(address);
    copyEmailButton.textContent = 'email copied';
    if (emailStatus) emailStatus.textContent = 'Email copied to clipboard.';
  } catch {
    copyEmailButton.textContent = 'copy failed';
    if (emailStatus) emailStatus.textContent = 'Copy failed — please use Telegram or LinkedIn.';
  }

  window.setTimeout(() => {
    copyEmailButton.textContent = 'copy email';
    if (emailStatus) emailStatus.textContent = '';
  }, 2200);
});
