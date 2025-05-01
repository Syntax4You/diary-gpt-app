import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Login } from './Login';
import { DiaryForm } from './DiaryForm';
import { DiaryLogs } from './DiaryLogs';
import { DiaryLogsGrouped } from './DiaryLogsGrouped';
import { Auth } from './Auth';

function App() {
  import type { User } from 'firebase/auth';
const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
  return () => unsubscribe();
}, []);

  if (!user) return <Login />;

  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <Auth user={user} setUser={setUser} />
        <nav style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <Link to="/">日記を書く</Link>
          <Link to="/logs">一覧</Link>
          <Link to="/logs-grouped">月日別</Link>
        </nav>

        <Routes>
          <Route path="/" element={<DiaryForm user={user} />} />
          <Route path="/logs" element={<DiaryLogs />} />
          <Route path="/logs-grouped" element={<DiaryLogsGrouped />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
