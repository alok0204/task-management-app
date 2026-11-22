import { apiRequest, setAuthToken } from './api';

export const authService = {
  async register(userData) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async login(credentials) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API warning:', e);
    } finally {
      setAuthToken(null);
    }
  },

  async getMe() {
    const res = await apiRequest('/auth/me');
    return res.data?.user;
  },

  async updateProfile(profileData) {
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
    return res.data?.user;
  },
};
