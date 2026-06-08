import apiClient from './axiosConfig';

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard'),
};