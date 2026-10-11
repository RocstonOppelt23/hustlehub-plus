import axios from 'axios';

// All requests go to /api, which Vite proxies to the backend in development
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach the JWT to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired, clear it and send the user back to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.startsWith('/auth/login') || err.config?.url?.startsWith('/auth/register');
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('hh_token');
      localStorage.removeItem('hh_user');
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

// Pull a safe, readable message out of an API error
export function errorMessage(err) {
  return err.response?.data?.message || 'Something went wrong. Please try again.';
}

export default api;
