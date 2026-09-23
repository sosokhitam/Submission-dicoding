import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncLogin } from '../states/authUser/slice.js';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.authUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncLogin({ email, password }));
  };

  return (
    <div className="auth-wrap">
      <form onSubmit={onSubmit} className="form-card">
        <h2>Masuk</h2>
        <p className="muted">Selamat datang kembali di Forum Diskusi.</p>
        {error && <p className="error">{error}</p>}
        <label className="field">
          Email
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
          />
        </label>
        <label className="field">
          Password
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Memproses…' : 'Login'}
        </button>
        <p className="muted-sm">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
