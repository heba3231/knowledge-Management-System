// client/src/services/api.js
import axios from 'axios';

// استخدام متغير البيئة أو localhost للتطوير المحلي
const API_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة التوكن تلقائياً لكل الطلبات إذا كان موجوداً
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;