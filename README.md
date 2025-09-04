# Gmail PWA

Gmail をシンプルな **PWA (Progressive Web App)** として利用できるラッパーアプリケーションです。  
このプロジェクトは PWABuilder を通して Windows 向け **MSIX パッケージ** を生成し、既定のメールアプリとして設定できることを目的としています。

---

## 📦 プロジェクト構造

```
gmail-pwa/
├─ public/
│   ├─ handler/
│   │   ├─ compose.html      # Gmail 作成画面へのリンク
│   │   └─ mailto.html       # mailto リンクハンドラ
│   ├─ icons/                # アイコン格納
│   │   ├─ icon-192.png
│   │   ├─ icon-512.png
│   │   ├─ maskable-192.png
│   │   ├─ maskable-512.png
│   │   └─ monochrome.svg
│   ├─ manifest.json         # Web App Manifest
│   └─ offline.html          # オフライン用ページ
├─ index.html                # Gmail リダイレクトページ
├─ main.js                   # Service Worker 登録
├─ service-worker.js         # オフライン対応 SW
├─ LICENSE
└─ README.md
```

---

## 🛠 PWABuilder でのパッケージ化

1. [PWABuilder](https://www.pwabuilder.com/) にアクセス  
2. `manifest.json` の URL を入力  
   - 例: `https://yourdomain.com/manifest.json`
3. 「Generate」から **Windows (MSIX)** を選択  
4. ダウンロードしたパッケージをインストール

---

## 📧 既定のメールアプリとして設定

1. Windows 設定を開く  
2. **アプリ > 既定のアプリ** に移動  
3. **メール** の項目を選択し、この Gmail PWA を指定  

---

## 📄 使用技術

- **Web App Manifest** による PWA 準拠  
- **Service Worker** によるオフライン対応  
- **PWABuilder** を用いた Windows 向け MSIX 配布  

---

## ⚠️ 注意事項

- 本アプリは **公式 Gmail へのラッパー** であり、Gmail 本体ではありません。  
- Gmail は Google LLC の商標です。  
- 本リポジトリは MIT ライセンスの下で公開されています。

---

## 📜 ライセンス

詳細は [LICENSE](./LICENSE) を参照してください。
