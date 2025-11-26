// TOP Menu API
export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return showTopMenu(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * TOP Menu画面表示
 */
function showTopMenu(req, res) {
  const lineId = req.query.lineId || '';
  
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>予約システム - メインメニュー</title>
    <style>
        body {
            font-family: 'Hiragino Kaku Gothic ProN', Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }
        h1 {
            text-align: center;
            margin-bottom: 10px;
        }
        .welcome {
            text-align: center;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .menu-item {
            background: rgba(255, 255, 255, 0.1);
            margin: 15px 0;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s ease, background 0.2s ease;
            border: 2px solid transparent;
        }
        .menu-item:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .menu-item h3 {
            margin: 0 0 10px 0;
            font-size: 1.5em;
        }
        .menu-item p {
            margin: 0;
            opacity: 0.8;
            font-size: 14px;
        }
        .user-info {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 12px;
            opacity: 0.7;
        }
        .quick-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .quick-btn {
            flex: 1;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            padding: 10px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
        }
        .quick-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 予約システム</h1>
        <p class="welcome">お帰りなさい！ご利用ありがとうございます。</p>
        
        <div class="user-info">
            <p>👤 LINE ID: ${lineId}</p>
            <p>📱 メニューからご希望のサービスをお選びください</p>
        </div>
        
        <div class="menu-item" onclick="createNewReservation()">
            <h3>📅 新しい予約</h3>
            <p>送迎の新規予約を行います</p>
        </div>
        
        <div class="menu-item" onclick="viewMyReservations()">
            <h3>📋 予約一覧</h3>
            <p>これまでの予約を確認・変更します</p>
        </div>
        
        <div class="menu-item" onclick="editProfile()">
            <h3>👤 プロフィール編集</h3>
            <p>住所・連絡先などの情報を更新します</p>
        </div>
        
        <div class="menu-item" onclick="showHelp()">
            <h3>❓ ヘルプ</h3>
            <p>使い方やお問い合わせはこちら</p>
        </div>
        
        <div class="quick-actions">
            <button class="quick-btn" onclick="location.reload()">🔄 更新</button>
            <button class="quick-btn" onclick="goToLineChat()">💬 LINE</button>
        </div>
    </div>

    <script>
        const lineId = '${lineId}';
        
        // 新規予約
        function createNewReservation() {
            // 新規予約画面に移動（未実装）
            alert('新規予約機能を実装中です。\\n\\n📅 日付・時刻・住所を選択して予約を作成できるようになります。');
            console.log('新規予約:', lineId);
        }
        
        // 予約一覧
        function viewMyReservations() {
            // 予約一覧画面に移動（未実装）
            loadUserReservations();
        }
        
        // プロフィール編集
        function editProfile() {
            // プロフィール編集画面に移動（未実装）
            alert('プロフィール編集機能を実装中です。\\n\\n👤 住所や連絡先情報を更新できるようになります。');
            console.log('プロフィール編集:', lineId);
        }
        
        // ヘルプ
        function showHelp() {
            alert('🚗 送迎予約システム\\n\\n📞 お困りの際は以下までご連絡ください：\\n- LINE Bot: 「ヘルプ」とメッセージ\\n- 緊急時: システム管理者まで');
        }
        
        // LINEチャットに戻る
        function goToLineChat() {
            if (window.liff) {
                window.liff.closeWindow();
            } else {
                alert('📱 LINEアプリでご利用ください');
            }
        }
        
        // ユーザーの予約一覧を取得
        async function loadUserReservations() {
            try {
                // GAS APIでLINE IDに紐づく予約を検索（未実装）
                alert('予約一覧機能を実装中です。\\n\\n📋 これまでの予約履歴と今後の予約を確認できるようになります。');
                console.log('予約一覧取得:', lineId);
                
                // TODO: 実装例
                // const response = await fetch(\`/api/reservations?lineId=\${encodeURIComponent(lineId)}\`);
                // const result = await response.json();
                // displayReservations(result.data);
                
            } catch (error) {
                console.error('予約一覧取得エラー:', error);
                alert('予約一覧の取得でエラーが発生しました');
            }
        }
        
        // ページ読み込み時の処理
        window.addEventListener('load', function() {
            console.log('=== TOP Menu 読み込み完了 ===');
            console.log('LINE ID:', lineId);
            console.log('利用可能機能: 新規予約、予約一覧、プロフィール編集、ヘルプ');
            console.log('===============================');
        });
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}