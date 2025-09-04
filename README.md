# Gmail PWA

Gmail をシンプルな PWA (Progressive Web App) として利用できるようにしたラッパーアプリケーションです。  
このプロジェクトは、PWABuilder を通して Windows 向けの **署名済み MSIX パッケージ** を提供し、既定のメールアプリとして設定できることを目的としています。

---

## 📦 プロジェクト構造

```
gmail-pwa/
├─ public/
│   ├─ handler/
│   │   ├─ compose.html
│   │   └─ mailto.html
│   ├─ icons/        # アイコン格納
│   │   ├─ icon-192.png
│   │   ├─ icon-512.png
│   │   ├─ maskable-192.png
│   │   ├─ maskable-512.png
│   │   └─ monochrome.svg
│   ├─ manifest.json
│   └─ offline.html
├─ index.html        # Gmail リダイレクト
├─ main.js           # Service Worker 登録
├─ service-worker.js
├─ LICENSE
└─ README.md
```

---

## 🚀 セットアップ

1. ZIP で配布している署名済み MSIX パッケージをダウンロード  
2. Windows でインストール  
   - インストールには **signtool.exe** または PowerShell での署名済みパッケージが必要です  
3. インストール後、既定のメールアプリとして設定  

---

## 📧 既定のアプリとして設定

1. Windows 設定を開く  
2. **アプリ > 既定のアプリ** に移動  
3. **メール** の項目を選択し、Gmail PWA を指定  

---

## 📄 使用技術

- **Manifest v3** 準拠の Web App Manifest  
- **Service Worker** によるオフライン対応  
- **PWABuilder** を用いたクロスプラットフォーム配布  

---

## ⚠️ 注意事項

- 本アプリは **Gmail 本体のコピーではなく、公式 Gmail へのラッパー** です。  
- Gmail は Google LLC の商標です。  
- 本リポジトリは MIT ライセンスの下で公開されています。  

---

## 📜 ライセンス

このリポジトリは **MIT License** の下で公開されています。  
詳細は [LICENSE](./LICENSE) を参照してください。
