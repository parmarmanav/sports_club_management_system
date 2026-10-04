import api from './client';

export const bookingsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/bookings${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/v1/bookings/${id}`),
  create: (data) => api.post('/v1/bookings', data),
  cancel: (id) => api.post(`/v1/bookings/${id}/cancel`),
};

export const sportsApi = {
  getAll: () => api.get('/v1/sports'),
};

export const courtsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/courts${qs ? `?${qs}` : ''}`);
  },
};

export const slotsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/slots${qs ? `?${qs}` : ''}`);
  },
  getAvailability: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const result = await api.get(`/v1/slots${qs ? `?${qs}` : ''}`);
    // The real backend returns { data: { date, courts: [...] } }
    // We unwrap it so the React component receives an array directly, matching the old mock.
    const courtsArray = result.data?.courts || [];
    
    // Map backend field names to the frontend's expected format
    const mappedCourts = courtsArray.map(court => ({
      ...court,
      slots: court.slots?.map(slot => ({
        ...slot,
        id: slot.slot_id,
        start: slot.start_time,
        is_available: slot.available
      }))
    }));

    return {
      success: true,
      data: mappedCourts
    };
  },
};
