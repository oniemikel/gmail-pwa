// Service Worker 登録
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("public/service-worker.js")
      .catch(console.error);
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
