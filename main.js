// Service Worker 登録
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "public/service-worker.js"
      );
      console.log("Service Worker registered:", registration);

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
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "<Base64VAPID公開鍵をここに>", // 
          });
          console.log("Push subscribed:", subscription);
        } catch (err) {
          console.warn("Push subscription failed:", err);
        }
      }

      // Periodic Sync登録（対応ブラウザ限定）
      if ("periodicSync" in registration) {
        try {
          await registration.periodicSync.register("get-latest-mails", {
            minInterval: 24 * 60 * 60 * 1000,
          });
          console.log("Periodic Sync registered: get-latest-mails");
        } catch (err) {
          console.warn("Periodic Sync registration failed:", err);
        }
      }
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  });
}

// mailto: のハンドラ登録
(async () => {
  try {
    if ("registerProtocolHandler" in navigator) {
      navigator.registerProtocolHandler(
        "mailto",
        "public/handler/mailto.html?url=%s",
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
  hint.textContent =
    "このアプリは PWA としてインストールできます。ブラウザのメニューから『アプリとしてインストール』を選択してください。";
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
