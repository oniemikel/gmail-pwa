/* eslint-disable no-restricted-globals */
const CACHE_NAME = "gmail-pwa-shell-v2";
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

// Fetch: ネットワーク優先、オフラインはキャッシュにフォールバック
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const isSameOrigin = new URL(request.url).origin === self.location.origin;

  if (request.mode === "navigate" && isSameOrigin) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
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
            .catch(() => caches.match("/offline.html"))
      )
    );
  }
});

// Background Sync: ネット復帰時に保留アクションを同期
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-actions") {
    event.waitUntil(
      self.clients
        .matchAll()
        .then((clients) =>
          clients.forEach((client) =>
            client.postMessage({ type: "SYNC_PENDING_ACTIONS" })
          )
        )
    );
  }
});

// Periodic Background Sync: 定期的にデータ取得
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "periodic-fetch-gmail") {
    event.waitUntil(
      fetch("https://mail.google.com")
        .then((res) => {
          console.log("[Periodic Sync] Gmail fetched:", res.status);
          return res;
        })
        .catch((err) => {
          console.warn("[Periodic Sync] fetch failed", err);
        })
    );
  }
});

// Push通知受信
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

// 通知クリック時の挙動
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
