import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboardAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats?.stats.totalProducts || 0}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.stats.totalOrders || 0}</h3>
          <p>Custom Orders</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.stats.totalLeads || 0}</h3>
          <p>Total Leads</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.stats.totalReviews || 0}</h3>
          <p>Total Reviews</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Recent Orders */}
        <div className="table-container">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--wood-brown)' }}>
            <h3>Recent Orders</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.customer_name}</td>
                    <td>{order.product_type}</td>
                    <td>
                      <span className={`badge badge-${
                        order.status === 'Pending' ? 'warning' :
                        order.status === 'In Progress' ? 'info' :
                        order.status === 'Completed' ? 'success' : 'danger'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <Link to="/admin/orders" className="btn btn-secondary btn-small">View All</Link>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="table-container">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--wood-brown)' }}>
            <h3>Recent Leads</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentLeads?.length > 0 ? (
                stats.recentLeads.map(lead => (
                  <tr key={lead._id}>
                    <td>{lead.name}</td>
                    <td>{lead.phone}</td>
                    <td>
                      <span className={`badge badge-${lead.status === 'New' ? 'info' : 'success'}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No recent leads</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <Link to="/admin/leads" className="btn btn-secondary btn-small">View All</Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ 
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
        <Link to="/admin/add-product" className="btn btn-primary">+ Add New Product</Link>
        <Link to="/admin/add-blog" className="btn btn-primary">+ Add New Blog</Link>
        <Link to="/admin/products" className="btn btn-secondary">Manage Products</Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
