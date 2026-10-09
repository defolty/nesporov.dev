(function () {
  const readPreference = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const writePreference = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  };

  const root = document.documentElement;
  const fxHost = document.querySelector('[data-fx-host]');
  const motionToggle = document.querySelector('[data-pref="motion"]');
  const cursorToggle = document.querySelector('[data-pref="cursor"]');
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storedMotion = readPreference('nes.motion');
  let isMotionEnabled = storedMotion ? storedMotion === 'on' : !prefersReducedMotion;
  let isCursorEnabled = readPreference('nes.cursor') !== 'off';
  let fx = null;

  const resetEffectStyles = () => {
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      element.style.transition = '';
      element.style.opacity = '';
      element.style.filter = '';
    });
    document.querySelectorAll('[data-reveal], [data-magnetic]').forEach((element) => {
      element.style.translate = '';
    });
    document.querySelectorAll('[data-letter]').forEach((element) => {
      element.style.fontWeight = '';
      element.style.transform = '';
      element.style.color = '';
    });
    document.querySelectorAll('[data-marquee], [data-progress]').forEach((element) => {
      element.style.transform = '';
    });
    document.querySelectorAll('[data-tilt], [data-spot], [data-fill]').forEach((element) => {
      ['--rx', '--ry', '--gx', '--gy', '--mx', '--my', '--p'].forEach((property) => element.style.removeProperty(property));
    });
  };

  const displayFontReady = (() => {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const fontLoad = document.fonts.load("400 1em 'Audiowide'").catch(() => {});
    const fontTimeout = new Promise((resolve) => setTimeout(resolve, 2500));
    return Promise.race([fontLoad, fontTimeout]);
  })();

  const startEffects = () => {
    if (fx || !window.NesFX || !fxHost) return;
    displayFontReady.then(() => {
      if (fx || !isMotionEnabled) return;
      fx = window.NesFX.mount(fxHost, { mode: 'liquid', intensity: 0.8, cursor: isCursorEnabled, dot: 'round' });
    });
  };

  const stopEffects = () => {
    if (!fx) return;
    fx.destroy();
    fx = null;
    resetEffectStyles();
  };

  const renderPreferences = () => {
    root.classList.toggle('is-calm', !isMotionEnabled);
    motionToggle?.setAttribute('aria-checked', String(isMotionEnabled));
    cursorToggle?.setAttribute('aria-checked', String(isMotionEnabled && isCursorEnabled));
    if (cursorToggle) cursorToggle.disabled = !isMotionEnabled;
  };

  const applyPreferences = () => {
    renderPreferences();
    if (isMotionEnabled) {
      startEffects();
      fx?.update({ cursor: isCursorEnabled });
    } else {
      stopEffects();
    }
  };

  motionToggle?.addEventListener('click', () => {
    isMotionEnabled = !isMotionEnabled;
    writePreference('nes.motion', isMotionEnabled ? 'on' : 'off');
    applyPreferences();
  });

  cursorToggle?.addEventListener('click', () => {
    isCursorEnabled = !isCursorEnabled;
    writePreference('nes.cursor', isCursorEnabled ? 'on' : 'off');
    applyPreferences();
  });

  applyPreferences();

  const copyEmailButton = document.getElementById('copyEmailButton');
  const emailStatus = document.getElementById('emailStatus');
  let emailResetTimer = 0;

  copyEmailButton?.addEventListener('click', async () => {
    const address = [109, 97, 105, 110, 64, 110, 101, 115, 112, 111, 114, 111, 118, 46, 100, 101, 118]
      .map((character) => String.fromCharCode(character))
      .join('');
    clearTimeout(emailResetTimer);

    try {
      await navigator.clipboard.writeText(address);
      copyEmailButton.textContent = 'email copied';
      if (emailStatus) emailStatus.textContent = 'Email copied to clipboard.';
    } catch (error) {
      copyEmailButton.textContent = 'copy failed';
      if (emailStatus) emailStatus.textContent = 'Copy failed — please use Telegram or LinkedIn.';
    }

    emailResetTimer = setTimeout(() => {
      copyEmailButton.textContent = 'copy email';
      if (emailStatus) emailStatus.textContent = '';
    }, 2400);
  });
})();
