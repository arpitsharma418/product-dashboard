import api from './axios';

export const authApi = {

  login: async ({ username, password }) => {
    const response = await api.post('/auth/login', {
      username: username.trim(),
      password: password.trim(),
      expiresInMins: 120,
    });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

