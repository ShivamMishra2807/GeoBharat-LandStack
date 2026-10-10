import axios from 'axios';
import { mockAdapterHandler } from '../mocks/mockAdapter';

const isMockEnabled = import.meta.env.VITE_USE_MOCK !== 'false';

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
if (rawBaseUrl.startsWith('=')) {
  rawBaseUrl = rawBaseUrl.slice(1);
}

const axiosClient = axios.create({
  baseURL: rawBaseUrl,
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
    const data = error.response?.data;
    if (data) {
      if (typeof data === 'string') {
        error.error = data;
      } else if (typeof data.error === 'string') {
        error.error = data.error;
      } else if (typeof data.message === 'string') {
        error.error = data.message;
      } else if (typeof data.detail === 'string') {
        error.error = data.detail;
      } else if (data.message && typeof data.message === 'object' && typeof data.message.message === 'string') {
        error.error = data.message.message;
      }
    }
    return Promise.reject(data || error);
  }
);

export default axiosClient;
