// 新規会員登録API
export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // 新規登録画面表示
    return showRegistrationForm(req, res);
  } else if (req.method === 'POST') {
    // 新規登録処理
    return processRegistration(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * 新規登録画面表示
 */
function showRegistrationForm(req, res) {
  const lineId = req.query.lineId || '';
  
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新規会員登録</title>
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
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .btn {
            background: linear-gradient(45deg, #00C851, #00A142);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .required {
            color: #ff6b6b;
        }
        .info-box {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚗 新規会員登録</h1>
        
        <div class="info-box">
            <p>✨ ご利用ありがとうございます！</p>
            <p>送迎予約サービスの会員登録を行います。</p>
        </div>
        
        <form id="registrationForm" onsubmit="submitRegistration(event)">
            <input type="hidden" name="lineId" value="${lineId}">
            
            <div class="form-group">
                <label for="name">お名前 <span class="required">*</span></label>
                <input type="text" id="name" name="name" placeholder="例：田中太郎" required>
            </div>
            
            <div class="form-group">
                <label for="address1">住所1（出発地） <span class="required">*</span></label>
                <input type="text" id="address1" name="address1" placeholder="例：東京駅" required>
            </div>
            
            <div class="form-group">
                <label for="address2">住所2（目的地）</label>
                <input type="text" id="address2" name="address2" placeholder="例：羽田空港">
            </div>
            
            <div class="form-group">
                <label for="address3">住所3（経由地）</label>
                <input type="text" id="address3" name="address3" placeholder="例：品川駅経由">
            </div>
            
            <div class="form-group">
                <label for="notes">備考</label>
                <textarea id="notes" name="notes" rows="3" placeholder="その他ご要望等"></textarea>
            </div>
            
            <button type="submit" class="btn">🚗 会員登録を完了</button>
        </form>
    </div>

    <script>
        async function submitRegistration(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('会員登録が完了しました！');
                    // TOP Menuに移動
                    window.location.href = '/api/top-menu?lineId=' + encodeURIComponent('${lineId}');
                } else {
                    alert('登録に失敗しました: ' + result.error);
                }
            } catch (error) {
                alert('エラーが発生しました: ' + error.message);
            }
        }
        
        // ページ読み込み時の処理
        window.addEventListener('load', function() {
            console.log('新規登録画面読み込み完了');
            console.log('LINE ID:', '${lineId}');
        });
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}

/**
 * 新規登録処理
 */
async function processRegistration(req, res) {
  const { lineId, name, address1, address2, address3, notes } = req.body;
  
  if (!lineId || !name || !address1) {
    return res.status(400).json({
      success: false,
      error: 'LINE ID、お名前、住所1は必須です'
    });
  }
  
  try {
    // GAS APIに新規ユーザー登録
    const result = await registerNewUser({
      lineID: lineId,
      予約ID: '', // 空欄（今後の予約で使用）
      日付: '',
      時刻: '',
      利用者ID: `user_${Date.now()}`, // 自動生成
      住所1: address1,
      住所2: address2 || '',
      住所3: address3 || '',
      備考: notes || '',
      ステータス: '登録完了',
      車両ID: ''
    });
    
    return res.status(201).json({
      success: true,
      data: result,
      message: '会員登録が完了しました',
      redirectUrl: `/api/top-menu?lineId=${encodeURIComponent(lineId)}`
    });
    
  } catch (error) {
    console.error('登録処理エラー:', error);
    return res.status(500).json({
      success: false,
      error: '登録処理中にエラーが発生しました'
    });
  }
}

/**
 * GAS APIで新規ユーザー登録
 */
async function registerNewUser(userData) {
  const GAS_CRUD_API_URL = process.env.GAS_CRUD_API_URL;
  
  if (!GAS_CRUD_API_URL) {
    throw new Error('GAS_CRUD_API_URL が設定されていません');
  }
  
  try {
    const response = await fetch(GAS_CRUD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'create',
        sheet: 'reservations',
        data: userData
      })
    });

    return await response.json();
    
  } catch (error) {
    console.error('GAS API呼び出しエラー:', error);
    throw error;
  }
}