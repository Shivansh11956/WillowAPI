import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add user data to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (user) {
    config.headers['x-user-data'] = user;
  }
  return config;
});

export const auth = {
  signup: (email, password) => api.post('/auth/signup', { email, password }),
  verifySignup: (email, password, otp) => api.post('/auth/verify-signup', { email, password, otp }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

export const apiKeys = {
  list: () => api.get('/keys'),
  create: (name) => api.post('/keys', { name }),
  delete: (keyId) => api.delete(`/keys/${keyId}`),
};

export const analytics = {
  getUsage: () => api.get('/analytics/usage'),
  getStats: () => api.get('/analytics/stats'),
};

export default api;