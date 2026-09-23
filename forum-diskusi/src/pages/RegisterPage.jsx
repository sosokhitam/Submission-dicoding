import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncRegister } from '../states/authUser/slice.js';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.authUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(asyncRegister({ name, email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  useEffect(() => {
    setSuccess(false);
  }, []);

  return (
    <div className="auth-wrap">
      <form onSubmit={onSubmit} className="form-card">
        <h2>Daftar Akun</h2>
        <p className="muted">Buat akun untuk mulai berdiskusi.</p>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Pendaftaran berhasil! Mengalihkan ke login…</p>}
        <label className="field">
          Nama
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
            required
          />
        </label>
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
          Password (min. 6 karakter)
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Mendaftar…' : 'Register'}
        </button>
        <p className="muted-sm">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
