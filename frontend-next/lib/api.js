import axios from 'axios';
import { createClient } from '@/lib/supabase';

const API = '/api';

// Create axios instance with token handling
const api = axios.create({
  baseURL: API,
});

// Add token to requests — get from Supabase session instead of localStorage
api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Service APIs
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  update: (id, data) => api.put(`/services/${id}`, data),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, null, { params: { status } }),
};

// Pricing API
export const pricingAPI = {
  calculate: (data) => api.post('/pricing/calculate', data),
};

// Payment API
export const paymentAPI = {
  createCheckoutSession: (orderId) => api.post('/payments/create-checkout-session', { order_id: orderId }),
  getSubscriptionStatus: () => api.get('/payments/subscription-status'),
};

// Enquiry APIs
export const enquiryAPI = {
  create: (data) => api.post('/enquiries', data),
  getAll: () => api.get('/enquiries'),
  updateStatus: (id, status) => api.put(`/enquiries/${id}/status`, null, { params: { status } }),
};

// Blog APIs
export const blogAPI = {
  getAll: (publishedOnly = true) => api.get('/blogs', { params: { published_only: publishedOnly } }),
  getById: (id) => api.get(`/blogs/${id}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
};

export default api;
