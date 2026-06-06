import api from './api';

const ENDPOINT = '/api/v1/products/';

const productService = {

  getAll: async (params = {}) => {
    // params can be: { search: 'keyboard', category_id: 2, supplier_id: 1 }
    const response = await api.get(ENDPOINT, { params });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`${ENDPOINT}${id}`);
    return response.data.data;
  },

  create: async (payload) => {
    const response = await api.post(ENDPOINT, payload);
    return response.data.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`${ENDPOINT}${id}`, payload);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${ENDPOINT}${id}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get(`${ENDPOINT}dashboard/stats`);
    return response.data.data;
  },
};

export default productService;