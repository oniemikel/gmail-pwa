/* eslint-disable no-restricted-globals */

const CACHE_NAME = "gmail-pwa-shell-v1";
const APP_SHELL = [
  "/manifest.json",
  "/index.html",
  "/main.js",
  "/offline.html",
  "/icons/monochrome.svg",
];

// Install: アプリシェルをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell...");
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activate: 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
        )
      )
  );
  self.clients.claim();
});

// Fetch: キャッシュ優先、オフラインは offline.html
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // ナビゲーション（HTMLページ）の場合
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached || fetch(request).catch(() => caches.match("/offline.html"))
        );
      })
    );
    return;
  }

  // 同一オリジンのアセットはキャッシュ優先
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((res) => {
            const resClone = res.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, resClone));
            return res;
          })
          .catch(() => caches.match("/offline.html"));
      })
    );
  }
});

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-actions") {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: "SYNC_PENDING_ACTIONS" })
        );
      })
    );
  }
});

// Push通知
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Gmail PWA", {
      body: data.body || "You have a new message.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: data.url || "https://mail.google.com",
    })
  );
});

// 通知クリック
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data;
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
