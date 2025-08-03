import api from '../apiClient.js';

export const invoicesAPI = {
  getInvoices: async (params = {}) => {
    return api.get('/invoices', params);
  },

  getInvoice: async (invoiceId) => {
    return api.get(`/invoices/${invoiceId}`);
  },

  createInvoice: async (invoiceData) => {
    return api.post('/invoices', invoiceData);
  },

  updateInvoice: async (invoiceId, invoiceData) => {
    return api.put(`/invoices/${invoiceId}`, invoiceData);
  },

  updateInvoiceStatus: async (invoiceId, status) => {
    return api.patch(`/invoices/${invoiceId}`, { status });
  },

  deleteInvoice: async (invoiceId) => {
    return api.delete(`/invoices/${invoiceId}`);
  },

  bulkDeleteInvoices: async (invoiceIds) => {
    return api.post('/invoices/bulk-delete', { ids: invoiceIds });
  },
};