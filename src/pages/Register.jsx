import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/register`, { name, email, password });
      navigate('/login');
    } catch (err) {
      setError('สมัครสมาชิกล้มเหลว โปรดลองอีกครั้ง');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 p-10">
      <h2 className="text-5xl font-bold">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleRegister} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input input-bordered input-info w-full max-w-xs"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input input-bordered input-info w-full max-w-xs"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input input-bordered input-info w-full max-w-xs"
        />
        <button type="submit" className="btn btn-success text-white">
          Register
        </button>
      </form>
      <h1>
        have an account ?{' '}
        <Link to={'/login'} className="text-blue-400 hover:text-blue-600">
          Login
        </Link>
      </h1>
    </div>
  );
};
export default Register;
