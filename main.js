// Service Worker 登録
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/gmail-pwa/service-worker.js", {
      scope: "/gmail-pwa/",
    })
    .then((registration) => {
      console.log("Service Worker registered:", registration);

      // updatefound: 新しいSWがインストールされるとき
      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        console.log(
          "A new service worker is being installed:",
          installingWorker
        );

        if (installingWorker) {
          installingWorker.onstatechange = () => {
            console.log(
              "Service Worker state changed:",
              installingWorker.state
            );
            if (installingWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log("New content available; please refresh.");
              } else {
                console.log("Content cached for offline use.");
              }
            }
          };
        }
      });

      // Background Sync登録例
      if ("sync" in registration) {
        registration.sync
          .register("sync-actions")
          .then(() => console.log("Background Sync registered: sync-actions"))
          .catch((err) =>
            console.warn("Background Sync registration failed:", err)
          );
      }

      // Push通知の購読処理
      if ("PushManager" in window) {
        registration.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: "<Base64VAPID公開鍵をここに>", // 適宜置換
          })
          .then((subscription) => console.log("Push subscribed:", subscription))
          .catch((err) => console.warn("Push subscription failed:", err));
      }

      // Periodic Sync登録（対応ブラウザ限定）
      if ("periodicSync" in registration) {
        registration.periodicSync
          .register("get-latest-mails", {
            minInterval: 24 * 60 * 60 * 1000, // 1日
          })
          .then(() => console.log("Periodic Sync registered: get-latest-mails"))
          .catch((err) =>
            console.warn("Periodic Sync registration failed:", err)
          );
      }
    })
    .catch((error) => {
      console.error(`Service Worker registration failed: ${error}`);
    });
} else {
  console.error("Service workers are not supported.");
}

// mailto: のハンドラ登録
(async () => {
  try {
    if ("registerProtocolHandler" in navigator) {
      navigator.registerProtocolHandler(
        "mailto",
        "public/handler/mailto.html?url=%s", // GitHub Pages用パス
        "Gmail PWA Launcher"
      );
    }
  } catch (e) {
    console.debug("registerProtocolHandler failed:", e);
  }
})();

// インストールヒント
const hint = document.getElementById("installHint");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  if (hint) {
    hint.textContent =
      "このアプリは PWA としてインストールできます。ブラウザのメニューから『アプリとしてインストール』を選択してください。";
  }
});

// 通知権限のリクエスト
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Push notifications permission granted.");
    }
  });
}

// Service Worker からのメッセージ受信
navigator.serviceWorker?.addEventListener("message", (event) => {
  if (event.data?.type === "SYNC_PENDING_ACTIONS") {
    console.log("Sync pending actions triggered by Service Worker.");
    // ここでオフライン操作をサーバーに送信する処理を実装可能
  }
});
