self.addEventListener('install', event => {
    console.log('Service Worker installed');
});

self.addEventListener('fetch', event => {
    // Gmail はキャッシュせず、常に最新を開く
});
