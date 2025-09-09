import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
  submitForm: (formData) => {
    return api.post('/forms', formData);
  },

  // Get form by unique ID
  getForm: (uniqueId) => {
    return api.get(`/forms/${uniqueId}`);
  },


  // Health check
  healthCheck: () => {
    return api.get('/health');
  }
};

export default api;