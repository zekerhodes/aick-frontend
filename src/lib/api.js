import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('aick_user');
  if (stored) {
    try {
      const u = JSON.parse(stored);
      if (u?.token) config.headers.Authorization = `Bearer ${u.token}`;
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // token invalid — clear and redirect
      localStorage.removeItem('aick_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const formatKSh = (amount) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount || 0);

/**
 * Convert any axios/FastAPI error into a user-readable string.
 */
export const formatApiError = (err, fallback = 'Something went wrong') => {
  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const field = Array.isArray(d.loc) ? d.loc.filter((x) => x !== 'body').join('.') : '';
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join('; ');
  }
  if (err?.message) return err.message;
  return fallback;
};
