import api from './client';

export const membersApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/members${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/v1/members/${id}`),
  getEntitlements: (id) => api.get(`/v1/members/${id}/entitlements`),
  getHistory: (id) => api.get(`/v1/members/${id}/history`),
  create: (data) => api.post('/v1/members', data),
  update: (id, data) => api.patch(`/v1/members/${id}`, data),
  renew: (id, data) => api.post(`/v1/members/${id}/renew`, data),
};

export const plansApi = {
  getAll: () => api.get('/v1/plans'),
  getById: (id) => api.get(`/v1/plans/${id}`),
};

export const leadsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/leads${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/v1/leads/${id}`),
  create: (data) => api.post('/v1/leads', data),
  update: (id, data) => api.patch(`/v1/leads/${id}`, data),
  convert: (id, data) => api.post(`/v1/leads/${id}/convert`, data),
};
