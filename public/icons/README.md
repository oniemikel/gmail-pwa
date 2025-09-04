# Gmail PWA

Gmail をシンプルな PWA (Progressive Web App) として利用できるようにしたラッパーアプリケーションです。  
このプロジェクトは、PWABuilder を通して Windows 向けの **MSIX パッケージ** を生成し、既定のメールアプリとして設定できることを目的としています。  

---

## 📦 プロジェクト構造

```
gmail-pwa/
├─ public/
│   ├─ favicon.ico
│   ├─ manifest.json
│   └─ icons/        # アイコン格納
├─ src/
│   ├─ index.html    # Gmail リダイレクト
│   ├─ main.js       # Service Worker 登録
│   └─ service-worker.js
├─ package.json
└─ README.md
```

---

## 🚀 セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/gmail-pwa.git
cd gmail-pwa
```

### 2. 依存関係のインストール
本プロジェクトはビルドステップ不要のシンプル構成ですが、将来の拡張用に `package.json` を含めています。  
必要であればローカルサーバをインストールしてください。

例:  
```bash
npm install -g serve
```

### 3. 開発サーバの起動
```bash
serve -s public
```

ブラウザで以下にアクセスしてください:  
```
http://localhost:3000
```

---

## 🛠 PWABuilder でのビルド

1. [PWABuilder](https://www.pwabuilder.com/) にアクセス  
2. デプロイ済みの `manifest.json` の URL を入力  
   - 例: `https://yourdomain.com/manifest.json`
3. 「Generate」から **Windows (MSIX)** を選択  
4. ダウンロードしたパッケージをインストール  

---

## 📧 既定のアプリとして設定

1. Windows 設定を開く  
2. **アプリ > 既定のアプリ** に移動  
3. **メール** の項目を選択し、この Gmail PWA を指定  

これで Gmail PWA が Windows の既定メールアプリとして利用可能です。  

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
