import api from '../apiClient.js';

export const commentsAPI = {
  getComments: async (invoiceId) => {
    return api.get('/comments', { invoiceId });
  },

  addComment: async (invoiceId, text, author = 'Current User') => {
    return api.post('/comments', {
      invoiceId,
      author,
      text,
      timestamp: new Date().toISOString(),
    });
  },

  updateComment: async (commentId, text) => {
    return api.patch(`/comments/${commentId}`, { text });
  },

  deleteComment: async (commentId) => {
    return api.delete(`/comments/${commentId}`);
  },
};