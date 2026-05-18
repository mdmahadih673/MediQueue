import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to inject JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mediqueue-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 / 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        // Token has expired or is invalid
        console.warn('Session expired or unauthorized. Logging out user...');
        
        // Clear local storage session
        localStorage.removeItem('mediqueue-token');
        localStorage.removeItem('mediqueue-user');
        
        // Redirect to login if on a private page
        const isPublicPage = ['/login', '/register', '/'].includes(window.location.pathname);
        if (!isPublicPage) {
          window.location.href = `/login?expired=true`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
