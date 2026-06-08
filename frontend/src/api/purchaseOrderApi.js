import apiClient from './axiosConfig';

// All Purchase Order API calls in one place
// Components never call axios directly — they use these functions

export const purchaseOrderApi = {
  // GET /api/v1/purchase-orders?page=1&per_page=10&status=draft&search=abc
  getAll: (params = {}) => apiClient.get('/purchase-orders', { params }),

  // GET /api/v1/purchase-orders/5
  getById: (id) => apiClient.get(`/purchase-orders/${id}`),

  // POST /api/v1/purchase-orders
  create: (data) => apiClient.post('/purchase-orders', data),

  // PATCH /api/v1/purchase-orders/5/status
  updateStatus: (id, status) =>
    apiClient.patch(`/purchase-orders/${id}/status`, { status }),

  // DELETE /api/v1/purchase-orders/5
  delete: (id) => apiClient.delete(`/purchase-orders/${id}`),
};