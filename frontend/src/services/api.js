import axios from 'axios';
import toast from 'react-hot-toast';

// Base URL read from environment variable
// Create frontend/.env with: REACT_APP_API_URL=http://localhost:5000
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds — fail fast instead of hanging forever
});

// Response interceptor — runs on EVERY response before it reaches the page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (Flask server not running)
    if (!error.response) {
      toast.error('Cannot connect to server. Is the backend running?');
      return Promise.reject(error);
    }

    // Server returned an error response (4xx, 5xx)
    const message = error.response?.data?.message || 'Something went wrong';

    // Don't show toast for 404s — pages handle those themselves
    if (error.response.status !== 404) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;