import api from '../apiClient.js';

export const customersAPI = {
  getCustomers: async (params = {}) => {
    return api.get('/customers', params);
  },

  getCustomer: async (customerId) => {
    return api.get(`/customers/${customerId}`);
  },

  createCustomer: async (customerData) => {
    return api.post('/customers', customerData);
  },

  updateCustomer: async (customerId, customerData) => {
    return api.put(`/customers/${customerId}`, customerData);
  },

  deleteCustomer: async (customerId) => {
    return api.delete(`/customers/${customerId}`);
  },
};