import api from './axiosInstance';

const stockService = {
  getAll: async (params = {}) => {
    const response = await api.get('/stock', { params });
    return response.data;
  },
  
  getByWarehouse: async (warehouseId) => {
    const response = await api.get(`/stock/${warehouseId}`);
    return response.data;
  },

  addStock: async (data) => {
    const response = await api.post('/stock/add', data);
    return response.data;
  },

  removeStock: async (data) => {
    const response = await api.post('/stock/remove', data);
    return response.data;
  },

  transferStock: async (data) => {
    const response = await api.post('/stock/transfer', data);
    return response.data;
  }
};

export default stockService;
