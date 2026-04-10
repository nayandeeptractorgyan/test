import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ticketClassesAPI, ticketsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import PrintSlip from '../components/PrintSlip';

// Match the reference image: purple badge, green accent, warm bg
const CLASS_THEMES = {
  5:   { bg:'#EDE8F8', border:'#7C5CBF', text:'#7C5CBF', light:'#F4F1FC', pill:'#7C5CBF' },
  10:  { bg:'#D4F0DD', border:'#4CAF6E', text:'#2D8A4E', light:'#E8F8EE', pill:'#4CAF6E' },
  20:  { bg:'#D0F5F3', border:'#4ECDC4', text:'#2A9D96', light:'#E5FAF8', pill:'#4ECDC4' },
  100: { bg:'#FEF5D0', border:'#F4C842', text:'#A07A00', light:'#FFFAE8', pill:'#F4C842' },
};
const getTheme = p => CLASS_THEMES[p] || CLASS_THEMES[10];

export default function OperatorPanel() {
  const { user, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lastTicket, setLastTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [printTicket, setPrintTicket] = useState(null);
  const [now, setNow] = useState(new Date());
  const [todayCount, setTodayCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [recentTickets, setRecentTickets] = useState([]);
  const submitRef = useRef(null);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const loadClasses = useCallback(async () => {
    try { const res = await ticketClassesAPI.getAll(); setClasses(res.data.data); }
    catch { toast.error('Failed to load ticket classes'); }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await ticketsAPI.getAll({ date:today, operatorId:user.id, limit:1000 });
      const tickets = res.data.data;
      setTodayCount(tickets.length);
      setTodayRevenue(tickets.reduce((s,t) => s+t.price, 0));
      setRecentTickets(tickets.slice(0,5));
    } catch {}
  }, [user.id]);

  const loadLast = useCallback(async () => {
    try { const res = await ticketsAPI.getLast(); setLastTicket(res.data.data); } catch {}
  }, []);

  useEffect(() => { loadClasses(); loadStats(); loadLast(); }, [loadClasses, loadStats, loadLast]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Enter' && selected && !submitting) submitRef.current?.click();
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selected, submitting]);

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    try {
      const res = await ticketsAPI.issue({ ticketClassId: selected._id });
      const ticket = res.data.data;
      setPrintTicket(ticket);
      setSelected(null);
      loadStats(); loadLast();
      toast.success(`✅ Ticket #${ticket.serialNumber} issued!`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleVoid = async () => {
    if (!lastTicket || !window.confirm(`Void ticket #${lastTicket.serialNumber}?`)) return;
    try { await ticketsAPI.void(lastTicket._id); toast.success('Voided'); setLastTicket(null); loadStats(); }
    catch (err) { toast.error(err.response?.data?.message || 'Cannot void'); }
  };

  const fmtTime = d => d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const fmtDate = d => d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });

  return (
    <div style={S.page}>
      {/* Warm blobs */}
      <div style={{ ...S.blob, top:-100, right:-100, width:350, height:350, background:'#D4EBD4' }} />
      <div style={{ ...S.blob, bottom:-80, left:-80, width:300, height:300, background:'#E8E0F4' }} />

      {/* Header */}
      <header style={S.header}>
        <div style={S.hLeft}>
          <div style={S.avatar}>{user.name.charAt(0)}</div>
          <div>
            <div style={S.opName}>{user.name}</div>
            <span style={S.opPill}>Operator</span>
          </div>
        </div>

        <div style={S.clock}>
          <div style={S.clockTime}>{fmtTime(now)}</div>
          <div style={S.clockDate}>{fmtDate(now)}</div>
        </div>

        <div style={S.hRight}>
          <div style={S.statCard}>
            <div style={{ textAlign:'center' }}>
              <div style={S.statNum}>{todayCount}</div>
              <div style={S.statLbl}>Tickets</div>
            </div>
            <div style={S.statDiv} />
            <div style={{ textAlign:'center' }}>
              <div style={{ ...S.statNum, color:'#4CAF6E' }}>₹{todayRevenue}</div>
              <div style={S.statLbl}>Revenue</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Body */}
      <div style={S.body}>
        {/* Left */}
        <div style={S.left}>
          <div style={S.secLabel}>Select Ticket Class</div>
          <div style={S.grid}>
            {classes.map(tc => {
              const th = getTheme(tc.price);
              const active = selected?._id === tc._id;
              return (
                <button key={tc._id} onClick={() => setSelected(active ? null : tc)} style={{
                  ...S.tcBtn,
                  background: active ? th.bg : 'var(--bg2)',
                  border: `2px solid ${active ? th.border : 'var(--border)'}`,
                  boxShadow: active ? `0 8px 24px ${th.border}30` : '0 2px 8px rgba(0,0,0,0.05)',
                  transform: active ? 'translateY(-3px)' : 'none',
                }}>
                  {active && <div style={{ ...S.activeDot, background: th.pill }} />}
                  <div style={{ ...S.tcPrice, color: active ? th.text : 'var(--text)' }}>₹{tc.price}</div>
                  <div style={S.tcName}>{tc.name}</div>
                  <div style={{ ...S.tcSerial, background: active ? th.border+'22' : 'var(--bg3)', color: active ? th.text : 'var(--text3)' }}>
                    #{tc.currentSerialNumber + 1}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={S.kbHint}>
            <Kbd>Enter</Kbd> submit &nbsp;·&nbsp; <Kbd>Esc</Kbd> cancel
          </div>
        </div>

        {/* Right */}
        <div style={S.right}>
          {selected ? (
            <div style={{ ...S.selPanel, borderColor: getTheme(selected.price).border, boxShadow: `0 12px 40px ${getTheme(selected.price).border}20` }}>
              <div style={S.selTop}>
                <div style={{ ...S.selBadge, background: getTheme(selected.price).bg, color: getTheme(selected.price).text }}>
                  Selected
                </div>
                <button style={S.selX} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={{ ...S.selPrice, color: getTheme(selected.price).text }}>₹{selected.price}</div>
              <div style={S.selName}>{selected.name}</div>
              <div style={{ ...S.serialRow, background: getTheme(selected.price).bg }}>
                <span style={S.serialLbl}>Next Serial</span>
                <span style={{ ...S.serialVal, color: getTheme(selected.price).text }}>#{selected.currentSerialNumber + 1}</span>
              </div>
              <button ref={submitRef} style={S.submitBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? '⏳ Processing…' : '✅  SUBMIT & PRINT'}
              </button>
              <button style={S.changeBtn} onClick={() => setSelected(null)}>↩ Change Selection</button>
            </div>
          ) : (
            <div style={S.emptyPanel}>
              <div style={S.emptyIcon}>🎟️</div>
              <div style={S.emptyTitle}>No Ticket Selected</div>
              <div style={S.emptySub}>Pick a class from the left to get started</div>
              <div style={{ fontSize:'1.8rem', animation:'bounce 1.5s ease-in-out infinite', color:'var(--purple)' }}>←</div>
            </div>
          )}

          {/* Recent */}
          <div style={S.recentWrap}>
            <div style={S.recentHead}>
              <span style={S.recentTitle}>Recent Tickets</span>
              {lastTicket && <button style={S.undoBtn} onClick={handleVoid}>↩ Undo Last</button>}
            </div>
            {recentTickets.length === 0
              ? <div style={S.recentEmpty}>No tickets yet today</div>
              : recentTickets.map((t, i) => {
                const th = getTheme(t.price);
                return (
                  <div key={t._id} style={S.recentItem}>
                    <span style={{ ...S.recentPill, background: th.bg, color: th.text }}>₹{t.price}</span>
                    <span style={S.recentSer}>#{t.serialNumber}</span>
                    <span style={S.recentTime}>{new Date(t.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {printTicket && <PrintSlip ticket={printTicket} onClose={() => setPrintTicket(null)} />}
    </div>
  );
}

function Kbd({ children }) {
  return <kbd style={{ background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:5, padding:'1px 7px', fontFamily:"'Space Mono',monospace", fontSize:'0.7rem', color:'var(--text2)', fontWeight:700 }}>{children}</kbd>;
}

const S = {
  page: { minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)', position:'relative', overflow:'hidden' },
  blob: { position:'fixed', borderRadius:'50%', filter:'blur(50px)', opacity:0.45, pointerEvents:'none' },
  header: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'var(--bg2)', borderBottom:'1.5px solid var(--border)', position:'sticky', top:0, zIndex:10, gap:16, flexWrap:'wrap', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' },
  hLeft: { display:'flex', alignItems:'center', gap:12 },
  avatar: { width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#7C5CBF,#4ECDC4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'1.15rem', color:'white' },
  opName: { fontWeight:800, fontSize:'0.95rem', color:'var(--text)' },
  opPill: { background:'var(--purple-lt)', color:'var(--purple)', fontSize:'0.68rem', fontWeight:800, padding:'2px 9px', borderRadius:20 },
  clock: { textAlign:'center' },
  clockTime: { fontFamily:"'Space Mono',monospace", fontSize:'1.4rem', fontWeight:700, color:'var(--text)', letterSpacing:'0.04em' },
  clockDate: { color:'var(--text3)', fontSize:'0.76rem', marginTop:1 },
  hRight: { display:'flex', alignItems:'center', gap:12 },
  statCard: { display:'flex', alignItems:'center', gap:12, background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:14, padding:'8px 18px' },
  statNum: { fontSize:'1.1rem', fontWeight:900, fontFamily:"'Space Mono',monospace", color:'var(--purple)' },
  statLbl: { fontSize:'0.62rem', color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' },
  statDiv: { width:1, height:32, background:'var(--border)' },
  body: { flex:1, display:'flex', overflow:'hidden' },
  left: { flex:'0 0 58%', padding:'28px', borderRight:'1.5px solid var(--border)', display:'flex', flexDirection:'column', gap:18 },
  right: { flex:1, padding:'28px', display:'flex', flexDirection:'column', gap:16, overflowY:'auto' },
  secLabel: { fontSize:'0.72rem', fontWeight:800, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.1em' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 },
  tcBtn: { position:'relative', display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 14px', borderRadius:16, cursor:'pointer', transition:'all 0.18s', gap:6, outline:'none', minHeight:140 },
  activeDot: { position:'absolute', top:11, right:11, width:9, height:9, borderRadius:'50%' },
  tcPrice: { fontSize:'2.5rem', fontWeight:900, fontFamily:"'Space Mono',monospace", lineHeight:1, transition:'color 0.18s' },
  tcName: { color:'var(--text3)', fontSize:'0.72rem', fontWeight:600 },
  tcSerial: { padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700, transition:'all 0.18s' },
  kbHint: { display:'flex', alignItems:'center', gap:6, fontSize:'0.76rem', color:'var(--text3)' },
  selPanel: { background:'var(--bg2)', borderRadius:18, border:'2px solid var(--border)', padding:'24px', transition:'all 0.2s' },
  selTop: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  selBadge: { padding:'4px 12px', borderRadius:20, fontSize:'0.7rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em' },
  selX: { background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:'1.1rem', fontWeight:800, padding:'4px 8px', borderRadius:6 },
  selPrice: { fontSize:'4rem', fontWeight:900, fontFamily:"'Space Mono',monospace", lineHeight:1, marginBottom:4 },
  selName: { color:'var(--text2)', fontSize:'0.88rem', marginBottom:18 },
  serialRow: { display:'flex', justifyContent:'space-between', alignItems:'center', borderRadius:12, padding:'12px 16px', marginBottom:22 },
  serialLbl: { fontSize:'0.78rem', fontWeight:700, color:'var(--text2)' },
  serialVal: { fontSize:'1.25rem', fontWeight:900, fontFamily:"'Space Mono',monospace" },
  submitBtn: { width:'100%', padding:'16px', background:'#4CAF6E', color:'white', border:'none', borderRadius:12, cursor:'pointer', fontSize:'1.05rem', fontWeight:900, fontFamily:'inherit', marginBottom:10, boxShadow:'0 4px 16px rgba(76,175,110,0.3)', transition:'all 0.15s' },
  changeBtn: { width:'100%', padding:'11px', background:'transparent', color:'var(--text2)', border:'1.5px solid var(--border)', borderRadius:12, cursor:'pointer', fontSize:'0.86rem', fontFamily:'inherit' },
  emptyPanel: { background:'var(--bg2)', border:'2px dashed var(--border)', borderRadius:18, padding:'36px 24px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10 },
  emptyIcon: { fontSize:'2.8rem', opacity:0.5 },
  emptyTitle: { fontWeight:800, fontSize:'1rem', color:'var(--text2)' },
  emptySub: { color:'var(--text3)', fontSize:'0.82rem' },
  recentWrap: { background:'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:'16px', marginTop:'auto' },
  recentHead: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  recentTitle: { fontSize:'0.7rem', fontWeight:800, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.08em' },
  undoBtn: { background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:'0.76rem', fontWeight:800, fontFamily:'inherit' },
  recentEmpty: { color:'var(--text3)', fontSize:'0.82rem', textAlign:'center', padding:'10px 0' },
  recentItem: { display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid var(--border)' },
  recentPill: { padding:'2px 10px', borderRadius:20, fontSize:'0.76rem', fontWeight:800, flexShrink:0 },
  recentSer: { flex:1, fontFamily:"'Space Mono',monospace", fontSize:'0.8rem', color:'var(--text)' },
  recentTime: { color:'var(--text3)', fontSize:'0.73rem' },
};
