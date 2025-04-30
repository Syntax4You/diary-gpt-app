// ✅ src/DiaryLogsGrouped.tsx（年月→日→日記をアコーディオン表示）
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export const DiaryLogsGrouped = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const q = query(collection(db, 'diaries'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate()
      }));
      setEntries(data);
    });
  }, []);

  const groupByDate = (items: any[]) => {
    const grouped: Record<string, Record<string, any[]>> = {};
    items.forEach(item => {
      const date = item.date;
      const yearMonth = date ? `${date.getFullYear()}年${date.getMonth() + 1}月` : '未分類';
      const day = date ? `${date.getDate()}日` : '不明な日';
      if (!grouped[yearMonth]) grouped[yearMonth] = {};
      if (!grouped[yearMonth][day]) grouped[yearMonth][day] = [];
      grouped[yearMonth][day].push(item);
    });
    return grouped;
  };

  const toggleMonth = (month: string) => {
    setOpenMonths(prev => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDay = (month: string, day: string) => {
    const key = `${month}-${day}`;
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groupedEntries = groupByDate(entries);

  return (
    <div>
      <h2>日記（月 → 日 → 日記）</h2>
      {Object.entries(groupedEntries).map(([month, days]) => (
        <div key={month} style={{ marginBottom: '1rem' }}>
          <h3
            onClick={() => toggleMonth(month)}
            style={{ cursor: 'pointer', color: '#3366cc' }}
          >
            {openMonths[month] ? '▼' : '▶'} {month}
          </h3>

          {openMonths[month] && (
            <div style={{ marginLeft: '1rem' }}>
              {Object.entries(days).map(([day, items]) => {
                const dayKey = `${month}-${day}`;
                return (
                  <div key={day} style={{ marginBottom: '0.5rem' }}>
                    <h4
                      onClick={() => toggleDay(month, day)}
                      style={{ cursor: 'pointer', color: '#558' }}
                    >
                      {openDays[dayKey] ? '▼' : '▶'} {day}
                    </h4>
                    {openDays[dayKey] && (
                      <div style={{ marginLeft: '1rem' }}>
                        {items.map(entry => (
                          <div
                            key={entry.id}
                            style={{
                              background: '#f8f8f8',
                              marginBottom: '0.5rem',
                              padding: '0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            <div style={{ fontSize: '0.85rem', color: '#555' }}>
                              {entry.date.toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</div>
                            <div style={{ marginTop: '0.3rem', background: '#eef', padding: '0.5rem' }}>
                              <strong>GPTからのコメント:</strong>
                              <p style={{ whiteSpace: 'pre-wrap' }}>{entry.gptComment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
