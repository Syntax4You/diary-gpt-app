// src/Auth.tsx
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from './firebase';

export const Auth = ({ user, setUser }: any) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
      alert('ログインに失敗しました');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <>
          <p>ログイン中: {user.displayName}</p>
          <button onClick={handleLogout}>ログアウト</button>
        </>
      ) : (
        <button onClick={handleLogin}>Googleでログイン</button>
      )}
    </div>
  );
};
