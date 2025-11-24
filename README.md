# 🌉 LIFF Bridge - LINE ID Checker

Vercelを使用した匿名アクセス対応のLINE ID確認サービス

## 🚀 特徴

- ✅ **認証不要** - Googleログイン不要で匿名アクセス可能
- 📱 **LINE対応** - LINEアプリ内でもスムーズに動作
- 🌐 **高速配信** - VercelのCDNで世界中どこでも高速
- 🔒 **セキュア** - HTTPS対応、CORS設定済み

## 📂 プロジェクト構成

```
liff-bridge123/
├── api/
│   ├── webhook.js     # LINE Webhook受信API
│   └── lineId.js      # LINE ID表示API
├── public/
│   └── index.html     # フロントページ
├── package.json       # プロジェクト設定
├── vercel.json        # Vercel設定
└── README.md          # このファイル
```

## 🛠️ セットアップ

### 1. Vercelにデプロイ

1. [Vercel](https://vercel.com/)にログイン
2. GitHubリポジトリを連携
3. 自動デプロイ実行

### 2. 環境変数設定

Vercelの設定画面で以下を設定：

```
LINE_ACCESS_TOKEN=your_channel_access_token_here
```

### 3. LINE Developers設定

```
Webhook URL: https://your-app.vercel.app/api/webhook
```

## 🧪 使用方法

### API エンドポイント

#### 1. Webhook受信
```
POST /api/webhook
```
LINE Messaging API用のWebhook受信

#### 2. LINE ID表示
```
GET /api/lineId?lineId=USER_ID
```
LINE IDを表示するHTMLページを返す

### LINE Botでの使用

1. ボットに「ID確認」メッセージを送信
2. Vercel URLが返信される
3. URLをタップしてLINE IDを確認

## 🎯 GASとの違い

| 項目 | GAS | Vercel |
|------|-----|---------|
| **匿名アクセス** | ❌ 制限あり | ✅ 完全対応 |
| **速度** | 🐌 遅い | ⚡ 高速 |
| **制限** | 多い | 少ない |
| **設定** | 複雑 | シンプル |

## 📝 ライセンス

MIT License

## 👤 作成者

mokeno1109