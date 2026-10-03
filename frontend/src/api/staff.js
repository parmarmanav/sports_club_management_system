import api from './client';

export const staffApi = {
  getAll: () => api.get('/v1/staff'),
  getById: (id) => api.get(`/v1/staff/${id}`),
  create: (data) => api.post('/v1/staff', data),
  update: (id, data) => api.patch(`/v1/staff/${id}`, data),
};

export const shiftsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/shifts${qs ? `?${qs}` : ''}`);
  },
  create: (data) => api.post('/v1/shifts', data),
  update: (id, data) => api.patch(`/v1/shifts/${id}`, data),
  remove: (id) => api.delete(`/v1/shifts/${id}`),
};

export const leaveApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/leave${qs ? `?${qs}` : ''}`);
  },
  create: (data) => api.post('/v1/leave', data),
  update: (id, data) => api.patch(`/v1/leave/${id}`, data),
};

export const payrollApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/payroll${qs ? `?${qs}` : ''}`);
  },
  generate: (month) => api.post('/v1/payroll/generate', { month }),
  update: (id, data) => api.patch(`/v1/payroll/${id}`, data),
};
