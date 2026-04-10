import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const emptyForm = { username: '', password: '', name: '', isActive: true };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data.data);
    } catch { toast.error('Failed to load users'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setModal('form'); };
  const openEdit = (u) => {
    setForm({ username: u.username, name: u.name, password: '', isActive: u.isActive });
    setEditId(u._id); setModal('form');
  };
  const closeModal = () => { setModal(null); setForm(emptyForm); setEditId(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editId) {
        const payload = { name: form.name, isActive: form.isActive };
        if (form.password) payload.password = form.password;
        await usersAPI.update(editId, payload);
        toast.success('Operator updated');
      } else {
        await usersAPI.create(form);
        toast.success('Operator created');
      }
      closeModal(); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete operator "${name}"? This cannot be undone.`)) return;
    try {
      await usersAPI.delete(id);
      toast.success('Operator deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleActive = async (u) => {
    try {
      await usersAPI.update(u._id, { isActive: !u.isActive });
      toast.success(`Operator ${!u.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Operators</h1>
          <p style={{ color: 'var(--text2)' }}>Manage operator accounts</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Operator</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>No operators yet</td></tr>
              ) : users.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', color: 'var(--text2)' }}>{u.username}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>Edit</button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: u.isActive ? 'var(--yellow)' : 'var(--green)' }}
                        onClick={() => toggleActive(u)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => handleDelete(u._id, u.name)}>Delete</button>
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
              <span className="modal-title">{editId ? 'Edit Operator' : 'New Operator'}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input placeholder="Ramesh Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            {!editId && (
              <div className="form-group">
                <label>Username</label>
                <input placeholder="operator1" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
            )}
            <div className="form-group">
              <label>{editId ? 'New Password (leave blank to keep)' : 'Password'}</label>
              <input type="password" placeholder={editId ? '••••••••' : 'min 4 characters'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            {editId && (
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: 'auto' }} />
                  Active
                </label>
              </div>
            )}

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
