// LINE ID処理・GAS検索・分岐API
export default async function handler(req, res) {
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
    
    // テスト用やパラメータ不足の場合は従来の表示
    if (lineId === 'test' || lineId === 'パラメータが指定されていません') {
      return showOriginalPage(req, res, lineId, timestamp);
    }
    
    // 実際のLINE IDの場合：GAS検索・分岐処理
    try {
      const userExists = await checkUserExists(lineId);
      
      if (userExists) {
        // 既存ユーザー → TOP Menu
        const topMenuUrl = `https://${req.headers.host}/api/top-menu?lineId=${encodeURIComponent(lineId)}`;
        console.log('既存ユーザー検出、TOP Menuにリダイレクト:', topMenuUrl);
        return res.redirect(302, topMenuUrl);
      } else {
        // 新規ユーザー → 新規登録画面
        const registerUrl = `https://${req.headers.host}/api/register?lineId=${encodeURIComponent(lineId)}`;
        console.log('新規ユーザー検出、登録画面にリダイレクト:', registerUrl);
        return res.redirect(302, registerUrl);
      }
      
    } catch (error) {
      console.error('GAS検索エラー:', error);
      
      // エラー時は従来の表示に戻す
      return showErrorPage(req, res, lineId, error.message);
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * GASでユーザー存在チェック
 */
async function checkUserExists(lineId) {
  const GAS_CRUD_API_URL = process.env.GAS_CRUD_API_URL;
  
  if (!GAS_CRUD_API_URL) {
    console.log('GAS_CRUD_API_URL が設定されていません。従来動作に戻します。');
    return false; // GAS未設定の場合は新規扱い
  }
  
  try {
    // GAS CRUD APIで検索
    const url = new URL(GAS_CRUD_API_URL);
    url.searchParams.append('action', 'read');
    url.searchParams.append('sheet', 'reservations'); // 予約シート名
    
    console.log('GAS検索URL:', url.toString());
    
    const response = await fetch(url.toString());
    const result = await response.json();
    
    console.log('GAS検索結果:', result);
    
    // A列（lineID）で該当データを検索
    if (result.rows && result.rows.length > 0) {
      const matchingUsers = result.rows.filter(row => row.lineID === lineId);
      console.log(`LINE ID "${lineId}" マッチング結果:`, matchingUsers);
      return matchingUsers.length > 0;
    }
    
    return false;
    
  } catch (error) {
    console.error('GAS検索API呼び出しエラー:', error);
    throw error;
  }
}

/**
 * 従来のLINE ID表示ページ（テスト用）
 */
function showOriginalPage(req, res, lineId, timestamp) {
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
        .test-badge {
            background-color: #17a2b8;
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
        .note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 LINE ID チェッカー</h1>
        
        <div class="test-badge">🧪 テストモード</div>
        
        <div class="info-box">
            <h3>🆔 LINE ID:</h3>
            <div class="line-id" id="lineIdDisplay">${lineId}</div>
        </div>
        
        <div class="info-box">
            <h3>⏰ 取得時刻:</h3>
            <div class="timestamp">${timestamp}</div>
        </div>
        
        <div class="note">
            <h4>💡 動作説明:</h4>
            <p>実際のLINE IDの場合：</p>
            <ul>
                <li>✅ <strong>ユーザー登録済み</strong> → TOP Menuに自動移動</li>
                <li>🆕 <strong>新規ユーザー</strong> → 新規登録画面に自動移動</li>
            </ul>
            <p>テストIDや無効な場合は、この画面が表示されます。</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button class="btn" onclick="copyLineId()">📋 LINE IDをコピー</button>
            <button class="btn" onclick="location.reload()">🔄 リロード</button>
        </div>
        
        <div class="footer">
            <p>🎉 認証なしで正常にアクセスできています！</p>
            <p>Powered by Vercel + GAS Integration</p>
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

/**
 * エラー表示ページ
 */
function showErrorPage(req, res, lineId, errorMessage) {
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LINE ID チェッカー - エラー</title>
    <style>
        body {
            font-family: 'Hiragino Kaku Gothic ProN', Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
        }
        .error-badge {
            background-color: #dc3545;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-bottom: 20px;
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚫 一時的なエラー</h1>
        
        <div class="error-badge">⚠️ 検索システムエラー</div>
        
        <p><strong>LINE ID:</strong> ${lineId}</p>
        <p><strong>エラー詳細:</strong> ${errorMessage}</p>
        
        <p>申し訳ございません。一時的なエラーが発生しました。<br>
        しばらく後にもう一度お試しください。</p>
        
        <button class="btn" onclick="location.reload()">🔄 再試行</button>
        <button class="btn" onclick="history.back()">← 戻る</button>
    </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}