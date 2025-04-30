import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Login } from './Login';
import { DiaryForm } from './DiaryForm';
import { DiaryLogs } from './DiaryLogs'; 
import { DiaryLogsGrouped } from './DiaryLogsGrouped';

<Route path="/logs-grouped" element={<DiaryLogsGrouped />} />


function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (!user) return <Login />;

  return (
    <Router>
<nav style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/">日記を書く</Link>
        <Link to="/logs">一覧</Link>
        <Link to="/logs-grouped">月日別</Link>
</nav>

      <Routes>
        <Route path="/" element={<DiaryForm />} />
        <Route path="/logs" element={<DiaryLogs />} />
        <Route path="/logs-grouped" element={<DiaryLogsGrouped />} />
      </Routes>
    </Router>
  );
}

export default App;
