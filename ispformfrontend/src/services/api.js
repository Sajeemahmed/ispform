import axios from 'axios';

// Use environment variable for base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const formAPI = {
  // Submit form
  submitForm: (formData) => api.post('/forms', formData),

  // Get form by unique ID
  getForm: (uniqueId) => api.get(`/forms/${uniqueId}`),

  // Health check
  healthCheck: () => api.get('/health'),
};

export default api;
