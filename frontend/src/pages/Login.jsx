import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (e) { setError(e.response?.data?.message || 'Login failed'); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#e60023' }}>Welcome back</h2>
        {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={{ padding: '12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px' }} />
          <input placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={{ padding: '12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px' }} />
          <button type="submit" style={{ padding: '12px', background: '#e60023', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
            Log in
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '13px' }}>
          No account? <Link to="/register" style={{ color: '#e60023' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}