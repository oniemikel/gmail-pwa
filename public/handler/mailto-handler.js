(function () {
  const params = new URLSearchParams(location.search);
  // ?url= で渡されるエンコード済み mailto
  const original = params.get("url") || "";
  // Gmail の公式 mailto ハンドラ形式へ橋渡し
  const gmail =
    "https://mail.google.com/mail/?extsrc=mailto&url=" +
    encodeURIComponent(original);

  // fallbackリンクを設定
  const a = document.getElementById("fallback");
  if (a) a.href = gmail;

  // 即時遷移
  location.replace(gmail);
})();
