import axios from 'axios';

// In production, frontend is served from same Express server → use relative URLs
// In development, use proxy (set in package.json) or explicit localhost
const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────
export const authAPI = {
  login:          (creds) => api.post('/auth/login', creds),
  getMe:          ()      => api.get('/auth/me'),
  changePassword: (data)  => api.put('/auth/change-password', data),
};

// ─── Users ────────────────────────────────────────────
export const usersAPI = {
  getAll:  ()        => api.get('/users'),
  getById: (id)      => api.get(`/users/${id}`),
  create:  (data)    => api.post('/users', data),
  update:  (id,data) => api.put(`/users/${id}`, data),
  delete:  (id)      => api.delete(`/users/${id}`),
};

// ─── Ticket Classes ───────────────────────────────────
export const ticketClassesAPI = {
  getAll:  ()        => api.get('/ticket-classes'),
  create:  (data)    => api.post('/ticket-classes', data),
  update:  (id,data) => api.put(`/ticket-classes/${id}`, data),
  delete:  (id)      => api.delete(`/ticket-classes/${id}`),
};

// ─── Tickets ──────────────────────────────────────────
export const ticketsAPI = {
  issue:  (data)   => api.post('/tickets/issue', data),
  getAll: (params) => api.get('/tickets', { params }),
  getLast:()       => api.get('/tickets/last'),
  void:   (id)     => api.put(`/tickets/${id}/void`),
};

// ─── Reports ──────────────────────────────────────────
export const reportsAPI = {
  get:         (params) => api.get('/reports', { params }),
  exportExcel: (params) => api.get('/reports/export', { params, responseType: 'blob' }),
};

export default api;
