import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create a configured axios instance
// All API files import THIS, not axios directly
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor — runs before every request
// When Module 4 adds authentication, the JWT token gets attached here
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — runs after every response
// Handles global errors like 401 Unauthorized, 500 Server Error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect to prevent redirect loops
      // Components should handle 401 errors appropriately
      console.warn('Unauthorized — login required');
    }
    return Promise.reject(error);
  }
);

export default apiClient;