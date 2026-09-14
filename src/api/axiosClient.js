import axios from 'axios';
import { mockAdapterHandler } from '../mocks/mockAdapter';

const isMockEnabled = import.meta.env.VITE_USE_MOCK !== 'false';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // If mock mode is active, use the mockAdapterHandler
  adapter: isMockEnabled ? mockAdapterHandler : undefined,
});

// Request interceptor for auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('geobharat_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]:', error.response || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
