/* eslint-disable no-restricted-globals */
/**
 * Simple app-shell service worker for the Gmail PWA launcher.
 * - Caches local assets (manifest, icons, HTML/JS)
 * - Provides offline fallback page
 * - Does NOT cache Gmail (cross-origin)
 */

const CACHE_NAME = "gmail-pwa-shell-v1";
const APP_SHELL = [
  "/public/manifest.json",
  "/src/index.html",
  "/src/main.js",
  "/public/offline.html",
  "/public/icons/monochrome.svg",
  // PNG icons will be picked up by runtime cache if needed
];

// Install: cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
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

// Fetch: network-first for local navigations; fallback to offline page
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin requests
  const isSameOrigin = new URL(request.url).origin === self.location.origin;

  if (request.mode === "navigate" && isSameOrigin) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/public/offline.html"))
    );
    return;
  }

  if (isSameOrigin) {
    // Cache-first for static assets
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
            .catch(() => caches.match("/public/offline.html"))
      )
    );
  }
  // Cross-origin (e.g., Gmail) → let it pass through the network
});
