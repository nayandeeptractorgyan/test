import React, { useState, useEffect, useCallback } from 'react';
import { ticketsAPI, usersAPI, ticketClassesAPI } from '../../utils/api';

export default function LiveMonitorPage() {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ operatorId: '', ticketClassId: '', date: new Date().toISOString().split('T')[0] });
  const [operators, setOperators] = useState([]);
  const [classes, setClasses] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    usersAPI.getAll().then(r => setOperators(r.data.data)).catch(() => {});
    ticketClassesAPI.getAll().then(r => setClasses(r.data.data)).catch(() => {});
  }, []);

  const load = useCallback(async (p = page) => {
    try {
      const params = { page: p, limit: 25, ...filters };
      if (!params.operatorId) delete params.operatorId;
      if (!params.ticketClassId) delete params.ticketClassId;
      if (!params.date) delete params.date;
      const res = await ticketsAPI.getAll(params);
      setTickets(res.data.data);
      setPagination(res.data.pagination);
      setLastUpdate(new Date());
    } catch {}
    setLoading(false);
  }, [page, filters]);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(), 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, [load]);

  const handleFilter = () => { setPage(1); load(1); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
            Live Monitor
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#3FB950', marginLeft: 10, boxShadow: '0 0 8px #3FB950', animation: 'pulse 1.5s infinite' }} />
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
            Auto-refreshes every 10s · Last: {lastUpdate.toLocaleTimeString('en-IN')}
            · Total: <strong>{pagination.total}</strong> tickets
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => load()}>↻ Refresh Now</button>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label>Date</label>
            <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} style={{ width: 160 }} />
          </div>
          <div>
            <label>Operator</label>
            <select value={filters.operatorId} onChange={e => setFilters(f => ({ ...f, operatorId: e.target.value }))} style={{ width: 160 }}>
              <option value="">All</option>
              {operators.map(op => <option key={op._id} value={op._id}>{op.name}</option>)}
            </select>
          </div>
          <div>
            <label>Ticket Class</label>
            <select value={filters.ticketClassId} onChange={e => setFilters(f => ({ ...f, ticketClassId: e.target.value }))} style={{ width: 160 }}>
              <option value="">All</option>
              {classes.map(c => <option key={c._id} value={c._id}>₹{c.price}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleFilter}>Apply</button>
          <button className="btn btn-ghost" onClick={() => { setFilters({ operatorId: '', ticketClassId: '', date: new Date().toISOString().split('T')[0] }); setPage(1); setTimeout(() => load(1), 0); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Serial</th>
                <th>Price</th>
                <th>Class</th>
                <th>Operator</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>Loading…</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No tickets found</td></tr>
              ) : tickets.map((t, i) => {
                const d = new Date(t.createdAt);
                return (
                  <tr key={t._id}>
                    <td style={{ color: 'var(--text3)', fontSize: '0.8rem' }}>{(page - 1) * 25 + i + 1}</td>
                    <td>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: t.ticketClassId?.color || 'var(--blue)' }}>
                        #{t.serialNumber}
                      </span>
                    </td>
                    <td><strong>₹{t.price}</strong></td>
                    <td>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: t.ticketClassId?.color, marginRight: 6 }} />
                      {t.ticketClassId?.name || 'Unknown'}
                    </td>
                    <td>{t.operatorId?.name || 'Unknown'}</td>
                    <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{d.toLocaleDateString('en-IN')}</td>
                    <td style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.82rem', color: 'var(--text2)' }}>
                      {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', padding: '16px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => { setPage(p => p - 1); load(page - 1); }}>← Prev</button>
            <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Page {page} of {pagination.pages}</span>
            <button className="btn btn-ghost btn-sm" disabled={page >= pagination.pages} onClick={() => { setPage(p => p + 1); load(page + 1); }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
