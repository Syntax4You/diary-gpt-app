// ✅ src/DiaryForm.tsx（軽量版：日記投稿のみ）
import { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const DiaryForm = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);

    try {
      const prompt = `以下はユーザーが書いた日記です。`;

      const systemPrompt = `あなたは、ユーザーの感情に寄り添いながらも、現実に即した視点とささやかなユーモアで、内省と前進を支えるAIアシスタントです。
      トーンは、過剰にポジティブでも突き放しでもなく、親しみと皮肉を込めて。思考の癖があれば紳士的に指摘してください。ユーザーが書いた日記を読み、以下の3つの視点からコメントしてください：
・感情的な表現があれば：感情を理解し、共感・指摘をしてください。表面的な感情だけでなく、その裏にある感情も可能な限り拾ってください。
・ユーザーが自分自身を客観的に見つめ直せるようなアドバイスを提示してください。しかし、必ずポジティブなアドバイスをしてください。
・今の自分が無理なく実行できる、小さな行動の提案をしてください。
・「明日以降の行動」について触れられていたら、ToDo形式でやることを提示してあげてください。
上記3つの視点からアドバイスをするのであって、内容別にカテゴライズする必要も、必ず全てのカテゴリーのコメントをする必要もありません。
必要に応じてユーザーを分析し、内省的に、そして積極的にポジティブに明日も行動できるようなアドバイスをしてください。`;


      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt + text }
          ]
        })
      });

      const data = await res.json();
      console.log('使用モデル:', data.model);

      const comment = data.choices?.[0]?.message?.content || 'AIコメント取得失敗';
      setReply(comment);

      await addDoc(collection(db, 'users', userId, 'entries'), { ... })
        content: text,
        gptComment: comment,
        createdAt: Timestamp.now()
      });

      setText('');
    } catch (err) {
      console.error(err);
      alert('送信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今日の日記を書いてください"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? '送信中...' : '日記を送信'}
        </button>
      </form>

      {reply && (
        <div style={{ background: '#eef', padding: '1rem' }}>
          <strong>GPTからのコメント:</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{reply}</p>
        </div>
      )}
    </div>
  );
};
