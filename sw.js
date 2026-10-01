const CACHE_NAME = 'winter-arc-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icon.svg',
    '/manifest.webmanifest'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
