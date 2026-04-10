import React, { useState, useEffect } from 'react';
import { ticketClassesAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const COLORS = ['#3FB950', '#58A6FF', '#BC8CFF', '#E3B341', '#FF7B72', '#F78166'];
const emptyForm = { name: '', price: '', currentSerialNumber: '', color: '#58A6FF' };

export default function TicketClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await ticketClassesAPI.getAll();
      setClasses(res.data.data);
    } catch { toast.error('Failed to load ticket classes'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal('form'); };
  const openEdit = (tc) => {
    setForm({ name: tc.name || '', price: tc.price, currentSerialNumber: tc.currentSerialNumber, color: tc.color || '#58A6FF' });
    setEditId(tc._id); setModal('form');
  };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    if (!form.price) return toast.error('Price is required');
    setSaving(true);
    try {
      if (editId) {
        await ticketClassesAPI.update(editId, {
          name: form.name || `₹${form.price} Ticket`,
          price: Number(form.price),
          currentSerialNumber: Number(form.currentSerialNumber),
          color: form.color
        });
        toast.success('Ticket class updated');
      } else {
        await ticketClassesAPI.create({
          name: form.name || `₹${form.price} Ticket`,
          price: Number(form.price),
          currentSerialNumber: Number(form.currentSerialNumber) || 0,
          color: form.color
        });
        toast.success('Ticket class created');
      }
      closeModal(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket class?')) return;
    try {
      await ticketClassesAPI.delete(id);
      toast.success('Deleted');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleActive = async (tc) => {
    try {
      await ticketClassesAPI.update(tc._id, { isActive: !tc.isActive });
      toast.success(`${tc.isActive ? 'Deactivated' : 'Activated'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Ticket Classes</h1>
          <p style={{ color: 'var(--text2)' }}>Manage pricing and serial numbers</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Class</button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {loading ? (
          <p style={{ color: 'var(--text3)' }}>Loading…</p>
        ) : classes.map(tc => (
          <div key={tc._id} className="card" style={{ borderTop: `3px solid ${tc.color}`, position: 'relative' }}>
            {!tc.isActive && (
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className="badge badge-red">Inactive</span>
              </div>
            )}
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: "'Space Mono', monospace", color: tc.color, marginBottom: 4 }}>
              ₹{tc.price}
            </div>
            <div style={{ fontWeight: 600, marginBottom: 12, color: 'var(--text2)', fontSize: '0.9rem' }}>{tc.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text3)' }}>Current Serial</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: tc.color }}>#{tc.currentSerialNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text3)' }}>Next Serial</span>
                <span style={{ fontFamily: "'Space Mono', monospace" }}>#{tc.currentSerialNumber + 1}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(tc)}>Edit</button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: tc.isActive ? 'var(--yellow)' : 'var(--green)' }}
                onClick={() => toggleActive(tc)}
              >
                {tc.isActive ? 'Disable' : 'Enable'}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(tc._id)}>Del</button>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <h3 style={{ marginBottom: 16, fontWeight: 700 }}>All Ticket Classes</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Current Serial</th>
                <th>Next Serial</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(tc => (
                <tr key={tc._id}>
                  <td>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: tc.color, marginRight: 8 }} />
                    <strong>{tc.name}</strong>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{tc.price}</td>
                  <td style={{ fontFamily: "'Space Mono', monospace" }}>#{tc.currentSerialNumber}</td>
                  <td style={{ fontFamily: "'Space Mono', monospace", color: 'var(--blue)' }}>#{tc.currentSerialNumber + 1}</td>
                  <td><span className={`badge ${tc.isActive ? 'badge-green' : 'badge-red'}`}>{tc.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(tc)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(tc._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal === 'form' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editId ? 'Edit Ticket Class' : 'New Ticket Class'}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label>Display Name (optional)</label>
              <input placeholder="e.g. Standard Parking" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" placeholder="e.g. 10" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} min="1" />
            </div>
            <div className="form-group">
              <label>{editId ? 'Update Serial Number' : 'Starting Serial Number'}</label>
              <input type="number" placeholder="e.g. 400" value={form.currentSerialNumber} onChange={e => setForm(f => ({ ...f, currentSerialNumber: e.target.value }))} min="0" />
            </div>
            <div className="form-group">
              <label>Color</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                    width: 32, height: 32, borderRadius: '50%', background: c, border: `3px solid ${form.color === c ? 'white' : 'transparent'}`,
                    cursor: 'pointer', outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2
                  }} />
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
