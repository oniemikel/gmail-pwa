# Gmail PWA

Gmail をシンプルな PWA (Progressive Web App) として利用できるラッパーアプリケーションです。  
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
└─ LICENSE                  # MIT ライセンス
```

---

## 🚀 インストールと利用

1. Windows 上で署名済みの MSIX パッケージをダウンロード  
   - 本リポジトリの [Release ページ](https://github.com/oniemikel/gmail-pwa/releases) で提供済みの署名済みパッケージを入手可能です
2. ダウンロードしたパッケージをダブルクリック、または PowerShell で以下を実行：

```powershell
Add-AppxPackage -Path "Gmail PWA.sideload.msix"
```

3. Windows の設定で Gmail PWA を既定のメールアプリとして設定：

- 「設定」を開く  
- 「アプリ」 > 「既定のアプリ」を選択  
- 下の方にある「リンクの種類で規定値を選択する」をクリック  
- 「mailto」項目で Gmail PWA を選択

---

## 🛠 MSIX パッケージの生成・署名（参考）

将来的に自身で MSIX パッケージを生成したい場合や、他のプラットフォーム向けビルドの参考として：

1. [PWABuilder](https://www.pwabuilder.com/) にアクセス  
2. デプロイ済みの `manifest.json` の URL を入力  
   - 例: `https://yourdomain.com/manifest.json`
3. 「Generate」から希望のプラットフォーム（Windows/MSIXなど）を選択  
4. 以下の方法で署名します

---

### **署名方法 1: signtool.exe を使用する（自己署名・開発用）**

> ⚠️ 注意  
> - 第三者の認証はありません。**自己責任**で使用してください  
> - <u>**PFX は絶対に公開してはいけません**</u>

**手順:**

1. **必要なツール**

- Windows 10 SDK  
  - signtool.exe が含まれます

2. **証明書の作成（自己署名）**

```powershell
$pwd = ConvertTo-SecureString -String "YourPasswordHere" -Force -AsPlainText
$cert = New-SelfSignedCertificate -Type Custom -Subject "CN=Gmail PWA" `
    -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature
Export-PfxCertificate -Cert "Cert:\CurrentUser\My\$($cert.Thumbprint)" `
    -FilePath "C:\GmailPWA\GmailPWA.pfx" -Password $pwd
```

- `.pfx` には秘密鍵 + 公開鍵が含まれます  
- CER（公開鍵のみ）では署名できません。CER は署名の検証用です

3. **MSIX パッケージへの署名**

```powershell
signtool sign /fd SHA256 /a /f "C:\GmailPWA\GmailPWA.pfx" /p YourPasswordHere "Gmail PWA.sideload.msix"
```

4. **インストール**

```powershell
Add-AppxPackage -Path "Gmail PWA.sideload.msix"
```

---

### **署名方法 2: MSIX Packaging Tool を使用する（GUI・独自署名用）**

- [MSIX Packaging Tool (Microsoft Store)](https://www.microsoft.com/store/productId/9n5lw3jbcxkf) を使用して、GUI 上で MSIX を生成・署名可能  
- 独自署名を設定可能で、署名後は自己責任で配布できます

**手順:**

1. MSIX Packaging Tool を起動  
2. 「パッケージエディタ」を選択  
3. 署名するパッケージを選択  
4. 「Signing」から独自署名を指定（`.pfx`ファイル）  
5. パッケージを生成後、Sideload または内部配布可能

> ⚠️ 注意  
> - PFX を絶対に公開してはいけません  
> - 自己署名のため、Windows に「信頼済み」として登録する必要があります

---

### **署名方法 3: Microsoft Store GUI アプリで署名（公式配布用）**

- PWABuilder で生成した MSIX を Microsoft Store 用アプリに取り込み、GUI で署名・配布可能  
- 署名は自動的に行われ、第三者認証付きとなるため、ユーザーは安心してインストール可能です

---

## 📄 使用技術

- **Web App Manifest v3** 準拠  
- **Service Worker** によるオフライン対応  
- **PWABuilder** によるクロスプラットフォーム配布  
- **Windows MSIX / Sideload** による PWA 配布

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
