import React, { useState, useEffect, useCallback } from 'react';
import { reportsAPI, usersAPI } from '../../utils/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const PIE_COLORS = ['#58A6FF','#3FB950','#BC8CFF','#E3B341','#FF7B72','#F78166'];

const StatCard = ({ label, value, sub, color = 'var(--blue)', icon }) => (
  <div className="card" style={{ borderTop: `3px solid ${color}`, position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: 'var(--text2)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: '1.9rem', fontWeight: 800, fontFamily: "'Space Mono', monospace", color }}>{value}</div>
        {sub && <div style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: 4 }}>{sub}</div>}
      </div>
      {icon && <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>{icon}</span>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: '0.82rem' }}>
      <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.name === 'Revenue' ? `₹${p.value}` : p.value}</div>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [operators, setOperators] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState({
    type: 'daily', startDate: '', endDate: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    operatorId: ''
  });

  useEffect(() => {
    usersAPI.getAll().then(r => setOperators(r.data.data)).catch(() => {});
    fetchReport();
  }, []);

  const buildParams = (f = filter) => {
    const p = { filter: f.type };
    if (f.operatorId) p.operatorId = f.operatorId;
    if (f.type === 'range') { p.startDate = f.startDate; p.endDate = f.endDate; }
    if (f.type === 'monthly') { p.month = f.month; p.year = f.year; }
    if (f.type === 'yearly') p.year = f.year;
    return p;
  };

  const fetchReport = async (f = filter) => {
    setLoading(true);
    try {
      const res = await reportsAPI.get(buildParams(f));
      setReport(res.data.data);
    } catch { toast.error('Failed to load report'); }
    setLoading(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await reportsAPI.exportExcel(buildParams());
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `parking-report-${Date.now()}.xlsx`;
      a.click(); window.URL.revokeObjectURL(url);
      toast.success('Excel report downloaded!');
    } catch { toast.error('Export failed'); }
    setExporting(false);
  };

  const trendData = (report?.dailyTrend || []).map(d => ({
    date: `${d._id.day}/${d._id.month}`,
    Tickets: d.count,
    Revenue: d.revenue
  }));

  const hourlyData = Array.from({ length: 24 }, (_, h) => {
    const found = (report?.hourlyBreakdown || []).find(d => d._id.hour === h);
    return { hour: `${h}h`, Tickets: found?.count || 0, Revenue: found?.revenue || 0 };
  });

  const pieData = (report?.byClass || []).map((c, i) => ({
    name: `₹${c.ticketClass.price}`,
    value: c.revenue,
    color: c.ticketClass.color || PIE_COLORS[i % PIE_COLORS.length]
  }));

  const s = report?.summary || {};
  const peakH = report?.peakHour;

  const tabs = ['overview', 'trends', 'breakdown', 'operators'];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Reports & Analytics</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>In-depth sales performance and ticket data</p>
        </div>
        <button className="btn btn-success" onClick={handleExport} disabled={exporting} style={{ gap: 8 }}>
          {exporting ? '⏳ Exporting…' : '📥 Export Excel'}
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>Period</label>
            <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} style={{ width: 140 }}>
              <option value="daily">Today</option>
              <option value="range">Date Range</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {filter.type === 'range' && <>
            <div><label>From</label><input type="date" value={filter.startDate} onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))} style={{ width: 150 }} /></div>
            <div><label>To</label><input type="date" value={filter.endDate} onChange={e => setFilter(f => ({ ...f, endDate: e.target.value }))} style={{ width: 150 }} /></div>
          </>}
          {filter.type === 'monthly' && <>
            <div><label>Month</label>
              <select value={filter.month} onChange={e => setFilter(f => ({ ...f, month: e.target.value }))} style={{ width: 110 }}>
                {MONTHS.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div><label>Year</label>
              <select value={filter.year} onChange={e => setFilter(f => ({ ...f, year: e.target.value }))} style={{ width: 95 }}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </>}
          {filter.type === 'yearly' && (
            <div><label>Year</label>
              <select value={filter.year} onChange={e => setFilter(f => ({ ...f, year: e.target.value }))} style={{ width: 95 }}>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
          <div>
            <label>Operator</label>
            <select value={filter.operatorId} onChange={e => setFilter(f => ({ ...f, operatorId: e.target.value }))} style={{ width: 150 }}>
              <option value="">All Operators</option>
              {operators.map(op => <option key={op._id} value={op._id}>{op.name}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => fetchReport()} disabled={loading}>
            {loading ? '…' : '🔍 Apply'}
          </button>
          <button className="btn btn-ghost" onClick={() => { const f = { type:'daily', startDate:'', endDate:'', month: new Date().getMonth()+1, year: new Date().getFullYear(), operatorId:'' }; setFilter(f); fetchReport(f); }}>
            Reset
          </button>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Tickets" value={s.totalTickets ?? 0} icon="🎟️" color="var(--blue)" sub={`${s.avgPerDay ?? 0}/day avg`} />
        <StatCard label="Total Revenue" value={`₹${s.totalRevenue ?? 0}`} icon="💰" color="var(--green)" sub={`₹${s.revenuePerDay ?? 0}/day avg`} />
        <StatCard label="Avg Ticket Value" value={`₹${s.avgTicketValue ? s.avgTicketValue.toFixed(0) : 0}`} icon="📊" color="var(--purple)" />
        <StatCard label="Voided Tickets" value={s.voidedCount ?? 0} icon="🚫" color="var(--red)" sub="not counted in revenue" />
        <StatCard label="Peak Hour" value={peakH ? `${peakH._id.hour}:00` : '—'} icon="⏰" color="var(--yellow)" sub={peakH ? `${peakH.count} tickets` : 'no data'} />
        <StatCard label="Top Class" value={report?.topClass ? `₹${report.topClass.ticketClass.price}` : '—'} icon="🏆" color="var(--accent)" sub={report?.topClass ? `₹${report.topClass.revenue} revenue` : ''} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 18px', fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600,
            color: activeTab === t ? 'var(--blue)' : 'var(--text2)',
            borderBottom: `2px solid ${activeTab === t ? 'var(--blue)' : 'transparent'}`,
            marginBottom: -1, textTransform: 'capitalize', transition: 'all 0.15s'
          }}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Revenue trend */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 18 }}>Revenue & Ticket Trend</h3>
            {trendData.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={trendData}>
                  <XAxis dataKey="date" tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text2)' }} />
                  <Line yAxisId="left" type="monotone" dataKey="Revenue" stroke="var(--green)" strokeWidth={2.5} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="Tickets" stroke="var(--blue)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Class breakdown table */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Ticket Class Performance</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Class</th><th>Price</th><th>Tickets</th><th>Revenue</th><th>Share</th><th>Progress</th></tr>
                </thead>
                <tbody>
                  {(report?.byClass || []).length === 0
                    ? <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text3)', padding:32 }}>No data for this period</td></tr>
                    : report.byClass.map((c, i) => (
                      <tr key={i}>
                        <td>
                          <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background: c.ticketClass.color, marginRight:8 }} />
                          <strong>{c.ticketClass.name}</strong>
                        </td>
                        <td>₹{c.ticketClass.price}</td>
                        <td>{c.count}</td>
                        <td style={{ color:'var(--green)', fontWeight:700 }}>₹{c.revenue}</td>
                        <td><span className="badge badge-blue">{c.share}%</span></td>
                        <td style={{ minWidth: 100 }}>
                          <div style={{ background:'var(--bg3)', borderRadius:4, height:6 }}>
                            <div style={{ width:`${c.share}%`, height:'100%', background: c.ticketClass.color, borderRadius:4 }} />
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TRENDS TAB ── */}
      {activeTab === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Hourly heatmap/bar */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <h3 style={{ fontWeight:700 }}>Tickets by Hour of Day</h3>
              {peakH && <span className="badge badge-yellow">Peak: {peakH._id.hour}:00 ({peakH.count} tickets)</span>}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData} barSize={18}>
                <XAxis dataKey="hour" tick={{ fill:'var(--text2)', fontSize:10 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fill:'var(--text2)', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Tickets" radius={[3,3,0,0]}>
                  {hourlyData.map((d, i) => (
                    <Cell key={i} fill={d.Tickets === Math.max(...hourlyData.map(h => h.Tickets)) && d.Tickets > 0 ? 'var(--yellow)' : 'var(--blue)'} fillOpacity={d.Tickets === 0 ? 0.2 : 0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekday pattern */}
          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:18 }}>Tickets by Day of Week</h3>
            {(report?.weekdayData || []).length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={report.weekdayData}>
                  <XAxis dataKey="day" tick={{ fill:'var(--text2)', fontSize:12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Tickets" fill="var(--purple)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* ── BREAKDOWN TAB ── */}
      {activeTab === 'breakdown' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {/* Pie chart */}
          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:18 }}>Revenue Distribution</h3>
            {pieData.length === 0 ? <Empty /> : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={v => `₹${v}`} contentStyle={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8 }} />
                    <Legend formatter={v => <span style={{ color:'var(--text2)', fontSize:'0.8rem' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:d.color, flexShrink:0 }} />
                      <span style={{ fontSize:'0.85rem', flex:1 }}>{d.name}</span>
                      <span style={{ fontWeight:700, color:d.color }}>₹{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tickets vs Revenue bar */}
          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:18 }}>Tickets vs Revenue by Class</h3>
            {(report?.byClass || []).length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(report?.byClass || []).map(c => ({ name:`₹${c.ticketClass.price}`, Tickets:c.count, Revenue:c.revenue }))}>
                  <XAxis dataKey="name" tick={{ fill:'var(--text2)', fontSize:12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize:'0.8rem' }} />
                  <Bar dataKey="Tickets" fill="var(--blue)" radius={[3,3,0,0]} />
                  <Bar dataKey="Revenue" fill="var(--green)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* ── OPERATORS TAB ── */}
      {activeTab === 'operators' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Leaderboard */}
          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:20 }}>Operator Leaderboard</h3>
            {(report?.byOperator || []).length === 0 ? <Empty /> : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {report.byOperator.map((op, i) => {
                  const maxRev = Math.max(...report.byOperator.map(o => o.revenue));
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:16 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background: i === 0 ? 'var(--yellow)' : i === 1 ? 'var(--text2)' : 'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.8rem', color: i < 2 ? '#000' : 'var(--text2)', flexShrink:0 }}>
                        {i+1}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                          <span style={{ fontWeight:600 }}>{op.operator.name}</span>
                          <div style={{ display:'flex', gap:16, fontSize:'0.85rem' }}>
                            <span style={{ color:'var(--text2)' }}>{op.count} tickets</span>
                            <span style={{ color:'var(--green)', fontWeight:700 }}>₹{op.revenue}</span>
                          </div>
                        </div>
                        <div style={{ background:'var(--bg3)', borderRadius:4, height:7, overflow:'hidden' }}>
                          <div style={{ width:`${(op.revenue/maxRev)*100}%`, height:'100%', background: i === 0 ? 'var(--yellow)' : 'var(--green)', borderRadius:4, transition:'width 0.6s ease' }} />
                        </div>
                        <div style={{ color:'var(--text3)', fontSize:'0.75rem', marginTop:3 }}>
                          Avg: ₹{op.avgValue ? op.avgValue.toFixed(0) : 0}/ticket
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Operator comparison bar chart */}
          {(report?.byOperator || []).length > 0 && (
            <div className="card">
              <h3 style={{ fontWeight:700, marginBottom:18 }}>Operator Revenue Comparison</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={report.byOperator.map(op => ({ name: op.operator.name, Revenue: op.revenue, Tickets: op.count }))}>
                  <XAxis dataKey="name" tick={{ fill:'var(--text2)', fontSize:12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'var(--text2)', fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize:'0.8rem' }} />
                  <Bar dataKey="Revenue" fill="var(--green)" radius={[4,4,0,0]} />
                  <Bar dataKey="Tickets" fill="var(--blue)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Detailed table */}
          <div className="card">
            <h3 style={{ fontWeight:700, marginBottom:16 }}>Detailed Operator Stats</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Rank</th><th>Operator</th><th>Username</th><th>Tickets</th><th>Revenue</th><th>Avg/Ticket</th></tr>
                </thead>
                <tbody>
                  {(report?.byOperator || []).map((op, i) => (
                    <tr key={i}>
                      <td>
                        <span style={{ fontWeight:700, color: i===0 ? 'var(--yellow)' : 'var(--text2)' }}>#{i+1}</span>
                      </td>
                      <td><strong>{op.operator.name}</strong></td>
                      <td style={{ color:'var(--text2)', fontFamily:"'Space Mono',monospace", fontSize:'0.82rem' }}>{op.operator.username}</td>
                      <td>{op.count}</td>
                      <td style={{ color:'var(--green)', fontWeight:700 }}>₹{op.revenue}</td>
                      <td style={{ color:'var(--text2)' }}>₹{op.avgValue ? op.avgValue.toFixed(0) : 0}</td>
                    </tr>
                  ))}
                  {(report?.byOperator || []).length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text3)', padding:32 }}>No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty() {
  return <div style={{ textAlign:'center', color:'var(--text3)', padding:'40px 0', fontSize:'0.9rem' }}>No data for this period</div>;
}
