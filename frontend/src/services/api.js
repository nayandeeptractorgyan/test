import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Set base URL
axios.defaults.baseURL = API_URL;

// Products API
export const productAPI = {
  getAll: (params) => axios.get('/api/products', { params }),
  getById: (id) => axios.get(`/api/products/${id}`),
  create: (formData) => axios.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => axios.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axios.delete(`/api/products/${id}`)
};

// Orders API
export const orderAPI = {
  getAll: () => axios.get('/api/orders'),
  getById: (id) => axios.get(`/api/orders/${id}`),
  create: (data) => axios.post('/api/orders', data),
  updateStatus: (id, data) => axios.put(`/api/orders/${id}`, data),
  delete: (id) => axios.delete(`/api/orders/${id}`)
};

// Leads API
export const leadAPI = {
  getAll: () => axios.get('/api/leads'),
  getById: (id) => axios.get(`/api/leads/${id}`),
  create: (data) => axios.post('/api/leads', data),
  updateStatus: (id, data) => axios.put(`/api/leads/${id}`, data),
  delete: (id) => axios.delete(`/api/leads/${id}`)
};

// Reviews API
export const reviewAPI = {
  getAll: (params) => axios.get('/api/reviews', { params }),
  getById: (id) => axios.get(`/api/reviews/${id}`),
  create: (data) => axios.post('/api/reviews', data),
  updateStatus: (id, data) => axios.put(`/api/reviews/${id}`, data),
  delete: (id) => axios.delete(`/api/reviews/${id}`)
};

// Blogs API
export const blogAPI = {
  getAll: (params) => axios.get('/api/blogs', { params }),
  getById: (id) => axios.get(`/api/blogs/${id}`),
  getBySlug: (slug) => axios.get(`/api/blogs/slug/${slug}`),
  create: (formData) => axios.post('/api/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => axios.put(`/api/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => axios.delete(`/api/blogs/${id}`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => axios.get('/api/dashboard/stats')
};

export default {
  productAPI,
  orderAPI,
  leadAPI,
  reviewAPI,
  blogAPI,
  dashboardAPI
};