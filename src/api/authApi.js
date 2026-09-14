import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Mock login endpoint
   */
  login: (credentials) => axiosClient.post('/auth/login', credentials),

  /**
   * Citizen signup endpoint
   */
  signup: (userData) => axiosClient.post('/auth/signup', userData),

  /**
   * Citizen service requests
   */
  getCitizenRequests: () => axiosClient.get('/citizen/requests'),
  createCitizenRequest: (payload) => axiosClient.post('/citizen/requests', payload),

  /**
   * Official department queue & actions
   */
  getOfficialQueue: () => axiosClient.get('/official/queue'),
  takeOfficialAction: (itemId, actionPayload) =>
    axiosClient.post(`/official/queue/${itemId}/action`, actionPayload),

  /**
   * Official analytics
   */
  getAnalytics: () => axiosClient.get('/official/analytics'),
};

export default authApi;
