/* eslint-disable no-restricted-globals */
const CACHE_NAME = "gmail-pwa-shell-v1";
const APP_SHELL = [
  "/manifest.json",
  "/index.html",
  "/main.js",
  "/offline.html",
  "/icons/monochrome.svg",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k)))
        )
      )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const isSameOrigin = new URL(request.url).origin === self.location.origin;

  if (request.mode === "navigate" && isSameOrigin) {
    event.respondWith(
      fetch(request).catch(() => caches.match("public/offline.html"))
    );
    return;
  }

  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((res) => {
              const resClone = res.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, resClone));
              return res;
            })
            .catch(() => caches.match("public/offline.html"))
      )
    );
  }
});
