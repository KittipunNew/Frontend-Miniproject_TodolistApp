import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    try {
      const response = await axios.post(backendUrl + '/login', {
        email,
        password,
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setError(response.data.message || 'เข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      console.error('❌ Error:', err);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 h-96">
      <h1 className="text-5xl font-bold">Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          className="input input-bordered input-info w-full max-w-xs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          className="input input-bordered input-info w-full max-w-xs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="btn btn-success text-white">Login</button>
      </form>
      <h1>
        Don't have an account yet ?{' '}
        <Link to={'/register'} className="text-blue-400 hover:text-blue-600">
          Register
        </Link>
      </h1>
    </div>
  );
};
export default Login;
