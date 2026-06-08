import apiClient from './axiosConfig';

export const salesOrderApi = {
  getAll: (params = {}) => apiClient.get('/sales-orders', { params }),
  getById: (id) => apiClient.get(`/sales-orders/${id}`),
  create: (data) => apiClient.post('/sales-orders', data),
  updateStatus: (id, status) =>
    apiClient.patch(`/sales-orders/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/sales-orders/${id}`),
};