// LINE ID表示用API
export default function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const lineId = req.query.lineId || 'パラメータが指定されていません';
    const timestamp = new Date().toString();
    
    console.log('LINE ID取得:', lineId);
    console.log('アクセス時刻:', timestamp);
    
    // HTMLレスポンス
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LINE ID チェッカー - Vercel版</title>
    <style>
        body {
            font-family: 'Hiragino Kaku Gothic ProN', 'Helvetica Neue', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #00B900;
            text-align: center;
            margin-bottom: 30px;
        }
        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        .line-id {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            word-break: break-all;
            background-color: #e8f5e8;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #00B900;
        }
        .timestamp {
            color: #666;
            font-size: 14px;
        }
        .success-badge {
            background-color: #28a745;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            margin-bottom: 15px;
            display: inline-block;
        }
        .btn {
            background-color: #00B900;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        .btn:hover {
            background-color: #009900;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 LINE ID チェッカー</h1>
        
        <div class="success-badge">✅ Vercel - 匿名アクセス成功</div>
        
        <div class="info-box">
            <h3>🆔 あなたのLINE ID:</h3>
            <div class="line-id" id="lineIdDisplay">${lineId}</div>
        </div>
        
        <div class="info-box">
            <h3>⏰ 取得時刻:</h3>
            <div class="timestamp">${timestamp}</div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn" onclick="copyLineId()">📋 LINE IDをコピー</button>
            <button class="btn" onclick="location.reload()">🔄 リロード</button>
        </div>
        
        <div class="footer">
            <p>🎉 認証なしで正常にアクセスできています！</p>
            <p>Powered by Vercel</p>
        </div>
    </div>

    <script>
        // ページ読み込み時にコンソールに出力
        console.log('=== LINE ID チェッカー (Vercel版) ===');
        console.log('LINE ID:', '${lineId}');
        console.log('取得時刻:', '${timestamp}');
        console.log('匿名アクセス: 成功');
        console.log('==============================');
        
        function copyLineId() {
            const lineId = document.getElementById('lineIdDisplay').textContent;
            navigator.clipboard.writeText(lineId).then(function() {
                alert('LINE IDをクリップボードにコピーしました: ' + lineId);
                console.log('コピー完了:', lineId);
            }).catch(function(err) {
                console.error('コピーに失敗:', err);
                alert('コピーに失敗しました');
            });
        }
        
        // ページ読み込み完了を通知
        window.addEventListener('load', function() {
            console.log('Vercel版ページ読み込み完了 - 認証なし!');
        });
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}