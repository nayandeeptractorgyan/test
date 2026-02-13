import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 style={{ color: 'var(--gold)' }}>✦ Admin Panel</h2>
      </div>
      <ul className="admin-sidebar-menu">
        <li>
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className={isActive('/admin/products')}>
            📦 Products
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className={isActive('/admin/orders')}>
            🛒 Custom Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/leads" className={isActive('/admin/leads')}>
            📨 Leads
          </Link>
        </li>
        <li>
          <Link to="/admin/reviews" className={isActive('/admin/reviews')}>
            ⭐ Reviews
          </Link>
        </li>
        <li>
          <Link to="/admin/blog" className={isActive('/admin/blog')}>
            📝 Blog Posts
          </Link>
        </li>
        <li>
          <Link to="/" target="_blank">
            🌐 View Website
          </Link>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} style={{ color: '#dc3545' }}>
            🚪 Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
