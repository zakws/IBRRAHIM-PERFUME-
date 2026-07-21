/* IBRAHIM Fragrances — service worker (A9).
   Network-first for pages, CSS and JS so updates always land; cache-first for images
   and fonts for instant repeat views and basic offline support. */
var VERSION = 'ibrahim-v1';
var CORE = ['./', './index.html', './styles/main.css', './scripts/store.js', './scripts/app.js', './data/products.js', './assets/icons/favicon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }).catch(function () {}));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== VERSION) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function networkFirst(req) {
  return fetch(req).then(function (r) {
    if (r && r.ok) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
    return r;
  }).catch(function () {
    return caches.match(req).then(function (m) { return m || caches.match('./index.html'); });
  });
}
function cacheFirst(req) {
  return caches.match(req).then(function (m) {
    return m || fetch(req).then(function (r) {
      if (r && r.ok) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
      return r;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate' || /\.(css|js|json|webmanifest)$/.test(url.pathname)) { e.respondWith(networkFirst(req)); return; }
  if (/\.(webp|avif|jpe?g|png|svg|ico|woff2?)$/.test(url.pathname)) { e.respondWith(cacheFirst(req)); return; }
});
