import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { leadAPI } from '../../services/api';

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await leadAPI.updateStatus(id, { status });
      loadLeads();
    } catch (error) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(id);
        loadLeads();
        alert('Lead deleted');
      } catch (error) {
        alert('Error deleting lead');
      }
    }
  };

  return (
    <AdminLayout title="Leads Management">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No leads found</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead._id}>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.phone}</td>
                    <td>{lead.message.substring(0, 50)}...</td>
                    <td><span className="badge badge-info">{lead.source}</span></td>
                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                        className="form-control"
                        style={{ padding: '0.5rem' }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(lead._id)}
                        className="btn btn-delete btn-small"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminLeads;
