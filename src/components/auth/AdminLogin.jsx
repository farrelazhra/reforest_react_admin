import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // CSS yang kamu kasih sebelumnya

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/auth';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Login gagal');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess && onLoginSuccess();
        navigate('/home');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
