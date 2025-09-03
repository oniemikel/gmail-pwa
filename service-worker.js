self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event) => {
    // Gmailはiframe経由なので特にキャッシュ処理はなし
});
