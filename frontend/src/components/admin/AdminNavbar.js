import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminNavbar = ({ title }) => {
  const { admin } = useContext(AuthContext);

  return (
    <div className="admin-navbar">
      <h2 style={{ margin: 0 }}>{title}</h2>
      <div style={{ color: 'var(--text-light)' }}>
        Welcome, <span style={{ color: 'var(--gold)' }}>{admin?.name}</span>
      </div>
    </div>
  );
};

export default AdminNavbar;
