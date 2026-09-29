(function () {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const fxHost = document.querySelector('[data-fx-host]');
  if (window.NesFX && fxHost) {
    window.NesFX.mount(fxHost, { mode: 'liquid', intensity: 0.8, cursor: true, dot: 'round' });
  }

  const appsTrack = document.querySelector('[data-apps-track]');
  const appSlots = appsTrack ? Array.from(appsTrack.querySelectorAll('[data-app-slot]')) : [];
  const appsCounter = appsTrack ? appsTrack.querySelector('[data-apps-counter]') : null;
  const wideLayout = matchMedia('(min-width: 1200px)');
  const spreadThreshold = 0.62;
  let activeIndex = -1;
  let isSpread = null;

  const setActiveApp = (index, spread) => {
    if (index === activeIndex && spread === isSpread) return;
    activeIndex = index;
    isSpread = spread;
    appSlots.forEach((slot, slotIndex) => slot.classList.toggle('is-active', spread && slotIndex === index));
    if (appsCounter) appsCounter.textContent = String(index + 1).padStart(2, '0');
    appsTrack.setAttribute('data-bg-shape', `app:${index}`);
  };

  const updateApps = () => {
    if (!appsTrack || !appSlots.length) return;
    const rect = appsTrack.getBoundingClientRect();
    const viewportHeight = innerHeight;

    if (!wideLayout.matches) {
      const unfoldRange = Math.max(1, viewportHeight * 0.6);
      appsTrack.style.setProperty('--s', clamp((viewportHeight * 0.85 - rect.top) / unfoldRange, 0, 1).toFixed(4));
      setActiveApp(0, false);
      return;
    }

    const scrollSpan = Math.max(1, rect.height - viewportHeight);
    const progress = clamp(-rect.top / scrollSpan, 0, 1);
    const stackScale = Math.min(1, (innerWidth - 48) / 1500, (viewportHeight - 150) / 940);
    appsTrack.style.setProperty('--ap', progress.toFixed(4));
    appsTrack.style.setProperty('--sc', stackScale.toFixed(3));

    const spread = progress > spreadThreshold;
    const spreadProgress = (progress - spreadThreshold) / (1 - spreadThreshold);
    const index = spread ? Math.min(appSlots.length - 1, Math.floor(spreadProgress * appSlots.length)) : 0;
    setActiveApp(index, spread);
  };

  addEventListener('scroll', updateApps, { passive: true });
  addEventListener('resize', updateApps);
  updateApps();

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
