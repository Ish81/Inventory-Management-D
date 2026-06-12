/**
 * src/services/axiosInstance.js — Configured API Client
 * ======================================================
 *
 * WHAT IS THIS FILE?
 * This creates a pre-configured Axios instance that ALL API calls use.
 * Instead of typing the base URL everywhere, you configure it once here.
 *
 * WITHOUT this file (BAD):
 *   axios.get("http://localhost:5000/api/v1/warehouses")
 *   axios.get("http://localhost:5000/api/v1/stock")
 *   // URL repeated everywhere! If it changes, you update 50 files!
 *
 * WITH this file (GOOD):
 *   api.get("/warehouses")
 *   api.get("/stock")
 *   // Base URL configured once. Change it here, fixed everywhere.
 *
 * WHAT IS AXIOS?
 * Axios is a library that makes HTTP requests (GET, POST, PUT, DELETE)
 * from JavaScript. It's like the browser's fetch() but with more features:
 *   - Automatic JSON parsing
 *   - Request/response interceptors
 *   - Better error handling
 *   - Timeout support
 */

import axios from "axios";

// Read the base URL from environment variable (.env file)
// Falls back to localhost:5000 if not set
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

/**
 * Create a pre-configured Axios instance.
 *
 * Every request made with this instance will:
 * 1. Automatically prepend the base URL
 * 2. Set Content-Type to JSON
 * 3. Have a 10-second timeout
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds — if the server doesn't respond, stop waiting
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 *
 * Runs BEFORE every request is sent.
 * Use case: Attach authentication tokens (will be added when Module 4 integrates).
 *
 * For now, it just passes the request through unchanged.
 */
api.interceptors.request.use(
  (config) => {
    // Future: Add auth token from Module 4
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 *
 * Runs AFTER every response is received.
 * Use case: Handle common errors (401 unauthorized, 500 server error).
 *
 * If the server returns a 401, we could redirect to the login page.
 * For now, we just pass errors through.
 */
api.interceptors.response.use(
  (response) => {
    // Request succeeded — return the response
    return response;
  },
  (error) => {
    // Request failed — log and pass the error through
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request was sent but no response received (server down?)
      console.error("Network Error: Server is not responding");
    }
    return Promise.reject(error);
  }
);

export default api;
