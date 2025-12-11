import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const adminApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include admin auth token if available
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
adminApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Admin token expired or invalid
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('admin');
      // Redirect to admin login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      console.error('Admin API Error:', message, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', 'No response from server');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const adminEndpoints = {
  login: '/admin/login',
  checkLogin: '/admin/checklogin',
  users: '/admin/users',
  workouts: '/admin/workouts',
  stats: '/admin/stats',
};

