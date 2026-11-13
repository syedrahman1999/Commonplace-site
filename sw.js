/* Offline shell for the installable Artificience app.
   No API responses, private manuscripts, requests, or keys are cached here. */
const CACHE = 'artificience-4.3.0-shell-v1';
const ASSETS = ['./', './index.html', './app.js', './editor.js', './features.js', './mobile.js', './style.css', './manifest.json',
'./assets/favicon.png', './assets/icon-192.png', './assets/icon-512.png', './vendor/pdf.min.js', './vendor/pdf.worker.min.js',
'./vendor/mammoth.browser.min.js', './vendor/docx.iife.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('artificience-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Network-first for navigations so published improvements are visible promptly.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) { const clone = response.clone(); caches.open(CACHE).then(c => c.put(request,clone)); }
      return response;
    }).catch(() => caches.match(request).then(r => r || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && ASSETS.filter(path => path !== './').some(path => url.pathname === new URL(path, self.registration.scope).pathname)) {
      const clone = response.clone(); caches.open(CACHE).then(c => c.put(request,clone));
    }
    return response;
  })));
});
