import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/admin',              label: 'Dashboard',     icon: '📊', end: true },
  { path: '/admin/users',        label: 'Operators',     icon: '👷' },
  { path: '/admin/ticket-classes', label: 'Ticket Classes', icon: '🎟️' },
  { path: '/admin/reports',      label: 'Reports',       icon: '📈' },
  { path: '/admin/monitor',      label: 'Live Monitor',  icon: '🔴' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={S.shell}>
      <aside style={{ ...S.sidebar, width: collapsed ? 68 : 224 }}>
        {/* Brand */}
        <div style={S.brand}>
          <div style={S.brandIcon}>🅿️</div>
          {!collapsed && <span style={S.brandText}>ParkTicket</span>}
          <button style={S.collapseBtn} onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <nav style={S.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) => ({
                ...S.navItem,
                background: isActive ? 'var(--purple-lt)' : 'transparent',
                color: isActive ? 'var(--purple)' : 'var(--text2)',
                fontWeight: isActive ? 800 : 600,
              })}
            >
              <span style={S.navIcon}>{item.icon}</span>
              {!collapsed && <span style={S.navLabel}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={S.sideBottom}>
          {!collapsed && (
            <div style={S.userCard}>
              <div style={S.userAvatar}>{user.name.charAt(0)}</div>
              <div>
                <div style={S.userName}>{user.name}</div>
                <div style={S.userRole}>Superadmin</div>
              </div>
            </div>
          )}
          <button style={S.logoutBtn} onClick={() => { logout(); navigate('/login'); }} title="Logout">🚪</button>
        </div>
      </aside>

      <main style={S.main}>
        <Outlet />
      </main>
    </div>
  );
}

const S = {
  shell: { display:'flex', minHeight:'100vh', background:'var(--bg)' },
  sidebar: { display:'flex', flexDirection:'column', background:'var(--bg2)', borderRight:'1.5px solid var(--border)', transition:'width 0.22s ease', position:'sticky', top:0, height:'100vh', flexShrink:0, zIndex:100, boxShadow:'4px 0 20px rgba(0,0,0,0.04)' },
  brand: { display:'flex', alignItems:'center', gap:10, padding:'20px 14px', borderBottom:'1.5px solid var(--border)' },
  brandIcon: { width:36, height:36, background:'linear-gradient(135deg,#7C5CBF,#4ECDC4)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 },
  brandText: { fontWeight:900, fontSize:'1.05rem', color:'var(--text)', flex:1, whiteSpace:'nowrap' },
  collapseBtn: { background:'var(--bg3)', border:'1.5px solid var(--border)', color:'var(--text2)', borderRadius:7, width:26, height:26, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 },
  nav: { flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:3 },
  navItem: { display:'flex', alignItems:'center', gap:10, padding:'10px 10px', textDecoration:'none', transition:'all 0.15s', fontSize:'0.88rem', borderRadius:10 },
  navIcon: { fontSize:'1.05rem', flexShrink:0, width:22, textAlign:'center' },
  navLabel: { whiteSpace:'nowrap', overflow:'hidden' },
  sideBottom: { padding:'12px 10px', borderTop:'1.5px solid var(--border)', display:'flex', alignItems:'center', gap:10 },
  userCard: { flex:1, display:'flex', alignItems:'center', gap:9, overflow:'hidden' },
  userAvatar: { width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#4CAF6E,#4ECDC4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.95rem', color:'white', flexShrink:0 },
  userName: { fontWeight:700, fontSize:'0.82rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--text)' },
  userRole: { color:'var(--text3)', fontSize:'0.7rem', fontWeight:600 },
  logoutBtn: { background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:8, padding:'6px 8px', cursor:'pointer', fontSize:'0.95rem', flexShrink:0, transition:'background 0.15s' },
  main: { flex:1, overflow:'auto', padding:'32px' },
};
