import api, { setAuthToken } from '../apiClient.js';

export const authAPI = {
  login: async (email, password) => {
    const data = await api.post('/login', { email, password });
    setAuthToken(data.token);
    return data.user;
  },

  logout: async () => {
    await api.post('/auth/logout');
    setAuthToken('');
  },

  refreshToken: async () => {
    const data = await api.post('/auth/refresh');
    setAuthToken(data.token);
    return data;
  },

  getCurrentUser: async () => {
    return api.get('/user');
  },
};