import api from './api';

const ENDPOINT = '/api/v1/suppliers/';

const supplierService = {

  getAll: async () => {
    const response = await api.get(ENDPOINT);
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
};

export default supplierService;