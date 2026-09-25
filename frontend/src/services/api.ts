import axios from 'axios';
import { cacheData, getCachedData } from './offlineStorage';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('rainguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with automatic offline cache fallback
apiClient.interceptors.response.use(
  (response) => {
    // Automatically cache GET responses for offline resilience
    if (response.config.method === 'get' && response.config.url) {
      cacheData(response.config.url, response.data).catch(() => {});
    }
    return response;
  },
  async (error) => {
    // If network error (offline), attempt to read from IndexedDB cache
    if (!error.response && error.config && error.config.method === 'get' && error.config.url) {
      const cached = await getCachedData(error.config.url);
      if (cached) {
        return { data: cached, status: 200, statusText: 'OK (Offline Cache)', headers: {}, config: error.config };
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
