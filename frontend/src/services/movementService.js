import api from './axiosInstance';

const movementService = {
  getAll: async (params = {}) => {
    const response = await api.get('/movements', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/movements/${id}`);
    return response.data;
  }
};

export default movementService;
