// Legacy API file - now uses unified API service
import { setAuthToken } from './apiClient.js';
import { authAPI, customersAPI } from './index.js';

// Legacy function wrappers for backward compatibility
const setToken = (token) => {
  setAuthToken(token);
};

const login = async (email, password) => {
  return authAPI.login(email, password);
};

const fetchCustomers = async (params = {}) => {
  return customersAPI.getCustomers(params);
};

const updateCustomer = async (customerId, customerData) => {
  return customersAPI.updateCustomer(customerId, customerData);
};

export {
  login,
  setToken,
  fetchCustomers,
  updateCustomer
};
