import api from './axiosInstance';

const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data; // The structure is { success, message, data }
  },
};

export default dashboardService;
