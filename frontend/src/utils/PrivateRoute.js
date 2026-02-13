import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#1a0f0a'
      }}>
        <div style={{ color: '#d4af37', fontSize: '20px' }}>Loading...</div>
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
