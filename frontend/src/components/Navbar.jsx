import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #eee', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Link to="/" style={{ fontWeight: '800', fontSize: '22px', color: '#e60023', textDecoration: 'none' }}>Pinterest</Link>
      <div style={{ flex: 1 }} />
      {user ? (
        <>
          <Link to="/create" style={{ padding: '9px 18px', background: '#111', color: '#fff', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>+ Create</Link>
          <Link to={`/profile/${user.id}`} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e60023', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
            {user.username[0].toUpperCase()}
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '8px 14px', borderRadius: '20px', border: '1.5px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: '13px' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ padding: '9px 18px', borderRadius: '20px', border: '1.5px solid #ddd', textDecoration: 'none', color: '#333', fontSize: '14px', fontWeight: '500' }}>Log in</Link>
          <Link to="/register" style={{ padding: '9px 18px', background: '#111', color: '#fff', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Sign up</Link>
        </>
      )}
    </nav>
  );
}