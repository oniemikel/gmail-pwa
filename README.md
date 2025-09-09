# Gmail PWA

Gmail をシンプルな PWA (Progressive Web App) として利用できるラッパーアプリケーションです。  
Windows 上で Gmail を既定のメールアプリとして使いたい場合に便利です。

---

## 🎯 推奨（一般ユーザー向け）導入方法

もっとも簡単で安全な方法です。URL を開いて、表示される「アプリとしてインストール」ボタンをクリックするだけで導入できます。

1. 以下のリンクをクリックして Gmail PWA を開く  
   [Gmail PWA を開く](https://oniemikel.github.io/gmail-pwa/)
2. ブラウザのインストール案内に従い「アプリとしてインストール」を選択
3. Windows の設定で Gmail PWA を既定のメールアプリとして設定  
   - 「設定」 > 「アプリ」 > 「既定のアプリ」  
   - 「mailto」リンクの規定アプリとして Gmail PWA を選択

> ✅ この方法なら署名やコマンド操作は不要です

---

## 🛠 上級者向け（カスタム MSIX パッケージ生成・署名）

開発者や自己署名パッケージを扱いたい方向けの方法です。  
PWABuilder や signtool/MSIX Packaging Tool を利用して、独自の MSIX パッケージを作成・署名できます。

### 📦 プロジェクト構造（参考）

```
gmail-pwa/
├─ public/                  # 公開リソース用ディレクトリ
│   ├─ handler/             # mailto リンクなどの HTML ハンドラ
│   │   ├─ compose.html     # メール作成画面へのリダイレクト
│   │   ├─ mailto-handler.js
│   │   └─ mailto.html      # mailto ハンドリング用ページ
│   ├─ icons/               # PWA 用アイコン
│   │   ├─ icon-192.png
│   │   ├─ icon-512.png
│   │   ├─ maskable-192.png
│   │   ├─ maskable-512.png
│   │   └─ monochrome.svg
│   └─ manifest.json        # Web App Manifest
├─ offline.html             # オフライン表示用ページ
├─ index.html               # PWA 起動・Gmail へのリダイレクト
├─ main.js                  # Service Worker 登録スクリプト
├─ service-worker.js        # オフライン対応 Service Worker
├─ README.md                # この説明書
└─ LICENSE                  # MIT ライセンス
```

### 手順の概要

1. **PWABuilder で MSIX を生成**  
   - `manifest.json` の URL を指定して Windows 向けパッケージを生成
2. **署名方法を選択**
   - **自己署名（signtool.exe / PowerShell）**  
     - 開発用や個人利用向け  
     ```powershell
     $pwd = ConvertTo-SecureString -String "YourPasswordHere" -Force -AsPlainText
     $cert = New-SelfSignedCertificate -Type Custom -Subject "CN=Gmail PWA" `
         -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature
     Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" `
         -FilePath "C:\GmailPWA\GmailPWA.pfx" -Password $pwd

     signtool sign /fd SHA256 /a /f "C:\GmailPWA\GmailPWA.pfx" /p YourPasswordHere "Gmail PWA.sideload.msix"
     ```
   - **MSIX Packaging Tool（GUI）**  
     - 独自署名付きで MSIX を生成可能
   - **Microsoft Store 配布用署名**  
     - 公式署名付きで第三者配布可能
3. **署名済み MSIX をインストール**  
   ```powershell
   Add-AppxPackage -Path "Gmail PWA.sideload.msix"
   ```
4. Windows の既定メールアプリに設定（mailto リンク用）

> ⚠️ 注意  
> - 自己署名の PFX は絶対に公開しないこと  
> - この方法は上級者向けです。操作ミスによりインストールに失敗する場合があります

---

## 📄 使用技術

- **Web App Manifest v3** 準拠  
- **Service Worker** によるオフライン対応  
- **PWABuilder** によるクロスプラットフォーム配布  
- **Windows MSIX / Sideload** による PWA 配布
- アイコン画像は ChatGPT により作成

---

## ⚠️ 注意事項

- 本アプリは **Gmail 本体のコピーではなく、公式 Gmail へのラッパー** です  
- Gmail は Google LLC の商標です  
- 自己署名パッケージを利用する場合は、第三者による保証はなく、**自己責任**での使用となります  
- **PFX を配布してはいけません**  
- 本リポジトリは MIT ライセンスの下で公開されています

---

## 📜 ライセンス

このリポジトリは **MIT License** の下で公開されています  
詳細は [LICENSE](./LICENSE) を参照してください
