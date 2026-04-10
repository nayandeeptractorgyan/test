import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import OperatorPanel from './pages/OperatorPanel';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import TicketClassesPage from './pages/admin/TicketClassesPage';
import ReportsPage from './pages/admin/ReportsPage';
import LiveMonitorPage from './pages/admin/LiveMonitorPage';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'superadmin' ? '/admin' : '/operator'} replace />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FEFCF8',
            color: '#1A1A2A',
            border: '1.5px solid #DDD8CE',
            borderRadius: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          },
          success: { iconTheme: { primary: '#4CAF6E', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#E05C5C', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/operator" element={<PrivateRoute role="operator"><OperatorPanel /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute role="superadmin"><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="ticket-classes" element={<TicketClassesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="monitor" element={<LiveMonitorPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
