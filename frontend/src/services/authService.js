import api from './api';

export const authService = {
  /**
   * Log in user with email and password
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Get the current authenticated user's profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user and purge local session cache
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
