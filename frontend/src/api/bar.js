import api from './client';

export const barApi = {
  getCategories: () => api.get('/v1/bar/categories'),
  getMenu: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/bar/menu${qs ? `?${qs}` : ''}`);
  },
  getTables: () => api.get('/v1/bar/tables'),
  openTab: (data) => api.post('/v1/bar/orders', data),
  addItem: (orderId, data) => api.post(`/v1/bar/orders/${orderId}/items`, data),
  closeTab: (orderId, data) => api.post(`/v1/bar/orders/${orderId}/close`, data),
  getKitchen: () => api.get('/v1/bar/kitchen'),
  updateKitchenStatus: (itemId, kitchen_status) => api.patch(`/v1/bar/kitchen/${itemId}`, { kitchen_status }),
};
