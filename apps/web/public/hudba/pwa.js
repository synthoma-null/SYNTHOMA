(() => {
  'use strict';
  const button = document.getElementById('install-app');
  const dialog = document.getElementById('install-help');
  const offline = document.getElementById('offline-notice');
  const appMode = matchMedia('(display-mode: standalone)');
  let installPrompt = null;
  function updateMode() { button.hidden = appMode.matches || navigator.standalone === true; }
  function updateNetwork() { offline.hidden = navigator.onLine; }
  updateMode();
  updateNetwork();
  appMode.addEventListener('change', updateMode);
  window.addEventListener('online', updateNetwork);
  window.addEventListener('offline', updateNetwork);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    updateMode();
  });
  window.addEventListener('appinstalled', () => { installPrompt = null; button.hidden = true; });
  button.addEventListener('click', async () => {
    if (installPrompt) {
      const prompt = installPrompt;
      installPrompt = null;
      try { await prompt.prompt(); await prompt.userChoice; } catch { dialog.showModal(); }
    } else { dialog.showModal(); }
  });
  document.getElementById('close-install-help').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }});
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/hudba/sw.js', {scope: '/hudba/', updateViaCache: 'none'}).then(registration => {
      if (registration.active) return;
      return new Promise((resolve, reject) => {
        const worker = registration.installing || registration.waiting;
        if (!worker) { reject(new Error('Missing worker')); return; }
        const timer = setTimeout(() => {worker.removeEventListener('statechange', check); reject(new Error('Install timeout'));}, 20000);
        function check() {
          if (worker.state === 'activated' || worker.state === 'redundant') {
            clearTimeout(timer);
            worker.removeEventListener('statechange', check);
            if (worker.state === 'activated') resolve(); else reject(new Error('Install failed'));
          }
        }
        worker.addEventListener('statechange', check);
        check();
      });
    }).then(() => {
      button.disabled = false;
      button.textContent = 'Nainstalovat aplikaci';
    }).catch(() => {
      button.disabled = false;
      button.textContent = 'Jak nainstalovat aplikaci';
      document.getElementById('pwa-status').textContent = 'Příprava aplikace se nepodařila. Zkontrolujte připojení a obnovte stránku.';
    });
  } else {
    button.disabled = false;
    button.textContent = 'Jak nainstalovat aplikaci';
  }
})();
