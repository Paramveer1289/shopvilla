// Axios API Client Configuration
import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || '/api/v1';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[ShopVilla Warning] VITE_API_URL environment variable is missing on Vercel! Falling back to /api/v1.'
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true, // Enables cookie exchange for sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopvilla_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'An unexpected server error occurred';

    // Handle session expiration: clear local credentials and auto-redirect to login
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'];
      if (!publicPaths.includes(window.location.pathname)) {
        localStorage.removeItem('shopvilla_token');
        localStorage.removeItem('shopvilla_user');
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(new Error(customMessage));
  }
);

export default api;
