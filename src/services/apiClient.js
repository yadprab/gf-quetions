import { API_CONFIG } from '../config/constants.js';

let authToken = localStorage.getItem('token') || '';

export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('token', token);
};

export const getAuthToken = () => authToken;

const getBaseURL = () => API_CONFIG.BASE_URL;

const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

const makeRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${getBaseURL()}${endpoint}`;
  
  const config = {
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Request failed for ${url}:`, error);
    throw error;
  }
};

export const api = {
  get: async (endpoint, params = {}) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${getBaseURL()}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    return makeRequest(url.toString(), { method: 'GET' });
  },

  post: async (endpoint, data) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async (endpoint, data) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (endpoint, data) => {
    return makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (endpoint) => {
    return makeRequest(endpoint, { method: 'DELETE' });
  },
};

export default api;