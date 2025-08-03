import api from '../apiClient.js';

export const metricsAPI = {
  getInvoiceMetrics: async () => {
    return api.get('/invoiceMetricsData');
  },

  getRecentActivities: async () => {
    return api.get('/recentActivities');
  },

  getPriorityActions: async () => {
    return api.get('/priorityActions');
  },
};