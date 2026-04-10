import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CARD_ACCENTS = [
  { color: '#7C5CBF', light: '#EDE8F8', icon: '🎟️' },
  { color: '#4CAF6E', light: '#D4F0DD', icon: '💰' },
  { color: '#4ECDC4', light: '#D0F5F3', icon: '📦' },
  { color: '#F4C842', light: '#FEF5D0', icon: '👷' },
];

const StatCard = ({ label, value, sub, idx = 0 }) => {
  const a = CARD_ACCENTS[idx % CARD_ACCENTS.length];
  return (
    <div style={{ background: a.light, border: `1.5px solid ${a.color}30`, borderRadius: 16, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position:'absolute', top:-16, right:-16, width:72, height:72, borderRadius:'50%', background:a.color, opacity:0.12 }} />
      <div style={{ fontSize:'1.5rem', marginBottom:8 }}>{a.icon}</div>
      <div style={{ color: a.color, fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:'2rem', fontWeight:900, color:'#1A1A2A', fontFamily:"'Space Mono',monospace" }}>{value}</div>
      {sub && <div style={{ color:'#5A5870', fontSize:'0.75rem', marginTop:4 }}>{sub}</div>}
    </div>
  );
};

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await reportsAPI.get({ filter:'daily' }); setReport(res.data.data); } catch {}
      setLoading(false);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div style={{ color:'var(--text2)', padding:40, textAlign:'center' }}>Loading dashboard…</div>;

  const byClass = report?.byClass || [];
  const byOp    = report?.byOperator || [];
  const s       = report?.summary || {};

  return (
    <div style={{ animation:'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:900, color:'var(--text)', marginBottom:4 }}>Dashboard</h1>
        <p style={{ color:'var(--text2)', fontSize:'0.88rem' }}>Today's overview · auto-refreshes every 30s</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:28 }}>
        <StatCard idx={0} label="Tickets Today"    value={s.totalTickets  ?? 0} />
        <StatCard idx={1} label="Revenue Today"    value={`₹${s.totalRevenue ?? 0}`} />
        <StatCard idx={2} label="Ticket Classes"   value={byClass.length} />
        <StatCard idx={3} label="Active Operators" value={byOp.length} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        {/* Chart */}
        <div className="card">
          <h3 style={{ fontWeight:800, marginBottom:20, color:'var(--text)' }}>Revenue by Class</h3>
          {byClass.length === 0
            ? <p style={{ color:'var(--text3)', textAlign:'center', padding:'32px 0' }}>No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={byClass.map(c => ({ name:`₹${c.ticketClass.price}`, revenue:c.revenue }))}>
                  <XAxis dataKey="name" tick={{ fill:'var(--text2)', fontSize:12, fontWeight:700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:10, fontFamily:'Nunito', boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="revenue" radius={[6,6,0,0]}>
                    {byClass.map((c, i) => <Cell key={i} fill={c.ticketClass.color || '#7C5CBF'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Operators */}
        <div className="card">
          <h3 style={{ fontWeight:800, marginBottom:20, color:'var(--text)' }}>Operator Performance</h3>
          {byOp.length === 0
            ? <p style={{ color:'var(--text3)', textAlign:'center', padding:'32px 0' }}>No data yet</p>
            : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {byOp.map((op,i) => {
                  const maxRev = Math.max(...byOp.map(o => o.revenue));
                  const pct    = (op.revenue / maxRev) * 100;
                  return (
                    <div key={i}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <span style={{ fontWeight:700, color:'var(--text)' }}>{op.operator.name}</span>
                        <span style={{ color:'#4CAF6E', fontWeight:800 }}>₹{op.revenue}</span>
                      </div>
                      <div style={{ background:'var(--bg3)', borderRadius:6, height:8, overflow:'hidden' }}>
                        <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#4CAF6E,#4ECDC4)', borderRadius:6, transition:'width 0.6s ease' }} />
                      </div>
                      <div style={{ color:'var(--text3)', fontSize:'0.73rem', marginTop:3 }}>{op.count} tickets</div>
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>
      </div>

      {/* Breakdown table */}
      <div className="card">
        <h3 style={{ fontWeight:800, marginBottom:18, color:'var(--text)' }}>Today's Class Breakdown</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Class</th><th>Price</th><th>Tickets Sold</th><th>Revenue</th><th>Share</th></tr>
            </thead>
            <tbody>
              {byClass.length === 0
                ? <tr><td colSpan={5} style={{ textAlign:'center', color:'var(--text3)', padding:28 }}>No tickets today</td></tr>
                : byClass.map((c,i) => {
                  const totalRev = s.totalRevenue || 1;
                  return (
                    <tr key={i}>
                      <td>
                        <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:c.ticketClass.color, marginRight:8 }} />
                        <strong>{c.ticketClass.name}</strong>
                      </td>
                      <td>₹{c.ticketClass.price}</td>
                      <td><strong>{c.count}</strong></td>
                      <td><span style={{ color:'#2D8A4E', fontWeight:800 }}>₹{c.revenue}</span></td>
                      <td><span className="badge badge-purple">{Math.round((c.revenue/totalRev)*100)}%</span></td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
