import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Log in</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={onChange} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={onChange} required />

        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p>No account? <Link to="/register">Sign up</Link></p>
    </div>
  );
}
