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

// Response interceptor: automatically fall back to mockAdapter if real backend is asleep or times out
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.error('[API Error]:', error.response || error.message);

    // If network error, timeout (ECONNABORTED / timeout of 10000ms exceeded), or backend 502/503/504
    const isNetworkOrTimeout =
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      !error.response ||
      error.message?.includes('timeout') ||
      error.response?.status >= 502;

    if (isNetworkOrTimeout && error.config && !error.config._fallbackTried) {
      console.warn('[API Fallback]: Backend unreachable or timed out. Falling back to local data adapter.');
      try {
        const fallbackConfig = { ...error.config, _fallbackTried: true };
        const mockResponse = await mockAdapterHandler(fallbackConfig);
        return mockResponse.data;
      } catch (mockErr) {
        console.error('[Mock Fallback Error]:', mockErr);
      }
    }

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
