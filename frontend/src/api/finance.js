import api from './client';

export const invoicesApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/invoices${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/v1/invoices/${id}`),
  create: (data) => api.post('/v1/invoices', data),
  update: (id, data) => api.patch(`/v1/invoices/${id}`, data),
  pay: (id, data) => api.post(`/v1/invoices/${id}/pay`, data),
};

export const paymentsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/payments${qs ? `?${qs}` : ''}`);
  },
};
