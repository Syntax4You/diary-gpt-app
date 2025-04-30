import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('ログイン失敗:', err);
    }
  };

  return (
    <button onClick={handleLogin}>
      Googleでログイン
    </button>
  );
};
