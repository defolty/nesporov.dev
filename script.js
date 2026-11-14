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
  const cursorToggle = document.querySelector('[data-pref="cursor"]');
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMotionEnabled = !prefersReducedMotion;
  let isCursorEnabled = readPreference('nes.cursor') !== 'off';
  let fx = null;

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

  const renderPreferences = () => {
    root.classList.toggle('is-calm', !isMotionEnabled);
    cursorToggle?.setAttribute('aria-checked', String(isMotionEnabled && isCursorEnabled));
    if (cursorToggle) cursorToggle.disabled = !isMotionEnabled;
  };

  const applyPreferences = () => {
    renderPreferences();
    if (isMotionEnabled) {
      startEffects();
      fx?.update({ cursor: isCursorEnabled });
    }
  };

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
