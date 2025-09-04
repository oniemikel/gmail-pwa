# Gmail PWA

Gmail をシンプルな PWA (Progressive Web App) として利用できるようにしたラッパーアプリケーションです。  
このプロジェクトは、PWABuilder を通して Windows 向けの **署名済み MSIX パッケージ** を提供し、既定のメールアプリとして設定できることを目的としています。

---

## 📦 プロジェクト構造

```
gmail-pwa/
├─ public/                  # 公開リソース用ディレクトリ
│   ├─ handler/             # mailto リンクなどの HTML ハンドラ
│   │   ├─ compose.html     # メール作成画面へのリダイレクト
│   │   └─ mailto.html      # mailto ハンドリング用ページ
│   ├─ icons/               # PWA 用アイコン
│   │   ├─ icon-192.png
│   │   ├─ icon-512.png
│   │   ├─ maskable-192.png
│   │   ├─ maskable-512.png
│   │   └─ monochrome.svg
│   ├─ manifest.json        # Web App Manifest
│   └─ offline.html         # オフライン表示用ページ
├─ index.html               # PWA 起動・Gmail へのリダイレクト
├─ main.js                  # Service Worker 登録スクリプト
├─ service-worker.js        # オフライン対応 Service Worker
├─ README.md                # この説明書
├─ LICENSE                  # MIT ライセンス
└─ tree.txt                 # ディレクトリツリーの記録
```

---

## 🚀 インストールと利用

1. Windows 上で署名済みの MSIX パッケージをダウンロード  
   - 提供済みのパッケージは署名済みなので、そのままインストール可能です
2. ダウンロードしたパッケージをダブルクリック、または PowerShell で以下のようにインストールします：

```powershell
Add-AppxPackage -Path "Gmail PWA.sideload.msix"
```

3. Windows の設定で Gmail PWA を既定のメールアプリとして設定できます：
   - 設定 > アプリ > 既定のアプリ > メール で選択

---

## 🛠 PWABuilder でのパッケージ生成（参考）

将来的に自身でパッケージを生成したい場合や、他のプラットフォーム向けビルドの参考として：

1. [PWABuilder](https://www.pwabuilder.com/) にアクセス  
2. デプロイ済みの `manifest.json` の URL を入力  
   - 例: `https://yourdomain.com/manifest.json`
3. 「Generate」から **Windows (MSIX)** など希望のプラットフォームを選択  
4. 署名済みパッケージを取得して配布することも可能  
   - 本リポジトリでは **既に署名済みパッケージを提供しています**

> ⚠️ 注意  
> - MSIX を自分で生成する場合、署名が必要です。署名なしでは Windows にインストールできません。  
> - signtool.exe を使用して署名する必要があります（Windows 10 SDK に含まれます）。  
> - 自己署名証明書を利用する場合、Windows に「信頼済み」として登録する必要があります。

---

## 🔏 自分で署名したい場合（任意）

通常は不要ですが、独自署名を行いたい場合は以下の手順を参考にしてください。

### 1. 必要なツール

- [Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-10-sdk/)  
  - signtool.exe が含まれます

### 2. 証明書の作成（自己署名）

PowerShell で自己署名証明書を作成します：

```powershell
$pwd = ConvertTo-SecureString -String "YourPasswordHere" -Force -AsPlainText
$cert = New-SelfSignedCertificate -Type Custom -Subject "CN=Gmail PWA" `
    -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature
Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" `
    -FilePath "C:\GmailPWA\GmailPWA.pfx" -Password $pwd
```

### 3. MSIX パッケージへの署名

PowerShell またはコマンドプロンプトで signtool を使って署名します：

```powershell
signtool sign /fd SHA256 /a /f "C:\GmailPWA\GmailPWA.pfx" /p YourPasswordHere "Gmail PWA.sideload.msix"
```

### 4. インストール

```powershell
Add-AppxPackage -Path "Gmail PWA.sideload.msix"
```

> ⚠️ 注意  
> - 自己署名証明書は Windows に「信頼済み」として登録されていない場合、インストール時に警告が出ます。  
> - 提供済みの署名済みパッケージを利用すれば、この手順はほとんどのユーザーで不要です。

---

## 📄 使用技術

- **Web App Manifest v3** 準拠  
- **Service Worker** によるオフライン対応  
- **PWABuilder** によるクロスプラットフォーム配布  
- **Windows MSIX / Sideload** による PWA 配布

---

## ⚠️ 注意事項

- 本アプリは **Gmail 本体のコピーではなく、公式 Gmail へのラッパー** です。  
- Gmail は Google LLC の商標です。  
- 本リポジトリは MIT ライセンスの下で公開されています。

---

## 📜 ライセンス

このリポジトリは **MIT License** の下で公開されています。  
詳細は [LICENSE](./LICENSE) を参照してください。
