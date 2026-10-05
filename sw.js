const CACHE = 'qsolog-map-v4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.png', './icon-192.png', './icon-180.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // 同一オリジンのGETのみキャッシュ対象。Drive API・国土地理院タイルなど
  // 外部オリジンへのリクエストはそのままブラウザに任せる（常に最新を取得）。
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
