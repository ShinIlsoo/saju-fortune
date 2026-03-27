const CACHE_NAME = 'saju-fortune-v1';
const urlsToCache = [
  '/saju-fortune/',
  '/saju-fortune/index.html',
  '/saju-fortune/css/style.css',
  '/saju-fortune/js/data.js',
  '/saju-fortune/js/saju.js',
  '/saju-fortune/js/fortune.js',
  '/saju-fortune/icons/icon-192.png',
  '/saju-fortune/icons/icon-512.png'
];

// 설치 시 캐시 저장
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 이전 캐시 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시 사용
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
