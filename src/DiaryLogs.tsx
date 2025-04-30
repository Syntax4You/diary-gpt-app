import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export const DiaryLogs = () => {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'diaries'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    });
  }, []);

  const formatDate = (ts: any) => {
    return ts?.toDate().toLocaleString('ja-JP', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div>
      <h2>過去の日記一覧</h2>
      {entries.map(entry => (
        <div key={entry.id} style={{ background: '#f8f8f8', marginBottom: '1rem', padding: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#555' }}>{formatDate(entry.createdAt)}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</div>
          <div style={{ marginTop: '0.5rem', background: '#eef', padding: '0.5rem' }}>
            <strong>GPTからのコメント:</strong>
            <p style={{ whiteSpace: 'pre-wrap' }}>{entry.gptComment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
