import api from './client';

export const dashboardApi = {
  getSummary: () => api.get('/v1/dashboard/summary'),
  getRevenue: (period = 'month') => api.get(`/v1/dashboard/revenue?period=${period}`),
  getLowStock: () => api.get('/v1/dashboard/low-stock'),
  getMemberStatus: () => api.get('/v1/dashboard/members'),
};
