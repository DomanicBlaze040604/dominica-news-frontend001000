import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-af44.up.railway.app';

console.log('🔗 API Base URL:', API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to true if backend uses cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response.data as any;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }
    
    // Log CORS errors specifically
    if (error.message === 'Network Error' || !error.response) {
      console.error('🚫 CORS or Network Error - Check backend CORS configuration');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
