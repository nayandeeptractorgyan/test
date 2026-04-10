import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(user.role === 'superadmin' ? '/admin' : '/operator');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      {/* Decorative blobs */}
      <div style={{ ...S.blob, top: -80, right: -80, width: 320, height: 320, background: '#D4EBD4', opacity: 0.6 }} />
      <div style={{ ...S.blob, bottom: -60, left: -60, width: 260, height: 260, background: '#E8E0F4', opacity: 0.5 }} />
      <div style={{ ...S.blob, top: '40%', left: '10%', width: 160, height: 160, background: '#FDEFC3', opacity: 0.4 }} />

      <div style={S.card}>
        {/* Logo */}
        <div style={S.logoWrap}>
          <div style={S.logoCircle}>
            <span style={{ fontSize: '2rem' }}>🅿️</span>
          </div>
        </div>

        <h1 style={S.title}>ParkTicket</h1>
        <p style={S.sub}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. operator1"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoFocus required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 8, borderRadius: 12 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div style={S.hint}>
          <div style={S.hintBox}>
            <span style={S.hintLabel}>Demo credentials</span>
            <code style={S.hintCode}>superadmin / admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:20, position:'relative', overflow:'hidden' },
  blob: { position:'fixed', borderRadius:'50%', filter:'blur(40px)', pointerEvents:'none' },
  card: { background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:24, padding:'44px 40px', width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.08)', position:'relative', zIndex:1, animation:'fadeIn 0.4s ease' },
  logoWrap: { display:'flex', justifyContent:'center', marginBottom:16 },
  logoCircle: { width:72, height:72, borderRadius:22, background:'linear-gradient(135deg, #7C5CBF, #4ECDC4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(124,92,191,0.25)' },
  title: { textAlign:'center', fontSize:'1.9rem', fontWeight:900, color:'var(--text)', marginBottom:4 },
  sub: { textAlign:'center', color:'var(--text2)', fontSize:'0.92rem' },
  hint: { marginTop:24 },
  hintBox: { background:'var(--bg3)', borderRadius:10, padding:'10px 14px', display:'flex', flexDirection:'column', gap:4 },
  hintLabel: { fontSize:'0.7rem', fontWeight:800, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em' },
  hintCode: { fontSize:'0.82rem', color:'var(--purple)', fontFamily:"'Space Mono',monospace", fontWeight:700 },
};
