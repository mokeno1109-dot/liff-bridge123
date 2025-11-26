// LINE Webhook受信用API
export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const events = req.body.events;
      
      if (!events || events.length === 0) {
        return res.status(200).json({ status: 'no events' });
      }

      for (const event of events) {
        if (event.type === 'message' && event.message.type === 'text') {
          const userId = event.source.userId;
          const messageText = event.message.text;
          
          console.log('LINE User ID:', userId);
          console.log('メッセージ:', messageText);
          
          // 「ID確認」メッセージに反応
          if (messageText.includes('ID') || messageText.includes('確認')) {
            const vercelUrl = `https://${req.headers.host}/api/lineId?lineId=${encodeURIComponent(userId)}`;
            
            // LINE Messaging APIで返信
            const replyMessage = {
              type: 'text',
              text: `あなたのLINE IDを確認できます！\n\n🔗 ${vercelUrl}\n\n📱 上記URLをタップしてください。匿名でアクセスできます。`
            };

            // LINE返信処理
            await replyToLine(event.replyToken, replyMessage);
          }
        }
      }
      
      return res.status(200).json({ status: 'ok' });
      
    } catch (error) {
      console.error('Webhook エラー:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

// LINE返信関数
async function replyToLine(replyToken, message) {
  const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
  
  if (!LINE_ACCESS_TOKEN) {
    console.error('LINE_ACCESS_TOKEN が設定されていません');
    return;
  }
  
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [message]
      })
    });
    
    if (response.ok) {
      console.log('LINE返信完了');
    } else {
      console.error('LINE返信エラー:', response.status, await response.text());
    }
  } catch (error) {
    console.error('LINE返信例外:', error);
  }
}