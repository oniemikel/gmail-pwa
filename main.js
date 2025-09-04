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
        try {
          await registration.sync.register("sync-actions");
          console.log("Background Sync registered: sync-actions");
        } catch (err) {
          console.warn("Background Sync registration failed:", err);
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

// プッシュ通知の許可を要求
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
