import api from './client';

export const shopApi = {
  getCategories: () => api.get('/v1/shop/categories'),
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/shop/products${qs ? `?${qs}` : ''}`);
  },
  createProduct: (data) => api.post('/v1/shop/products', data),
  updateProduct: (id, data) => api.patch(`/v1/shop/products/${id}`, data),
  adjustStock: (id, adjustment) => api.patch(`/v1/shop/products/${id}/stock`, { adjustment }),
  checkout: (data) => api.post('/v1/shop/orders', data),
  getOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/shop/orders${qs ? `?${qs}` : ''}`);
  },
  updateOrderStatus: (id, status) => api.patch(`/v1/shop/orders/${id}/status`, { status }),
};
