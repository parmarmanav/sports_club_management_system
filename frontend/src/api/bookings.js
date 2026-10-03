import api from './client';

export const bookingsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/bookings${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/v1/bookings/${id}`),
  create: async (data) => {
    // MOCK BOOKING CREATION DUE TO BACKEND MISMATCH
    console.warn("Mocking booking creation due to backend mismatch. Data:", data);
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      message: 'Booking created (Mocked)',
      data: {
        booking_id: 'mock-uuid-1234',
        amount: data.is_trial ? 0 : 500,
        payment_status: 'recorded',
        payment_method: data.payment_method
      }
    }), 800));
  },
  cancel: (id) => api.post(`/v1/bookings/${id}/cancel`),
};

export const sportsApi = {
  getAll: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      data: [
        { id: 'sport-1', name: 'Tennis' },
        { id: 'sport-2', name: 'Padel' },
        { id: 'sport-3', name: 'Squash' }
      ]
    }), 300));
  },
};

const MOCK_COURTS = [
  { id: 'court-1', sport_id: 'sport-1', name: 'Center Court (Tennis)' },
  { id: 'court-2', sport_id: 'sport-1', name: 'Court 2 (Tennis)' },
  { id: 'court-3', sport_id: 'sport-2', name: 'Padel Pro 1' },
  { id: 'court-4', sport_id: 'sport-3', name: 'Squash Glass Court' }
];

export const courtsApi = {
  getAll: async (params = {}) => {
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      data: MOCK_COURTS
    }), 300));
  },
};

export const slotsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/v1/slots${qs ? `?${qs}` : ''}`);
  },
  getAvailability: async (params = {}) => {
    console.warn("Mocking slots availability due to backend mismatch. Params:", params);
    
    // Fetch mock courts
    const allCourts = MOCK_COURTS;
    const sportCourts = allCourts.filter(c => c.sport_id === params.sport_id);
    
    const mockData = sportCourts.map(court => {
      const slots = [];
      const baseDate = params.date || new Date().toISOString().split('T')[0];
      
      for (let hour = 8; hour <= 21; hour++) {
        for (let min of [0, 30]) {
          const startTime = new Date(`${baseDate}T${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00+05:30`);
          const rand = Math.random();
          slots.push({
            id: `mock-slot-${court.id}-${hour}-${min}`,
            start: startTime.toISOString(),
            is_available: rand > 0.3,
            is_social: rand > 0.8,
            max_players: rand > 0.8 ? 4 : null,
            booked_players: rand > 0.8 ? Math.floor(Math.random() * 3) : 0,
            available_spots: rand > 0.8 ? 4 - Math.floor(Math.random() * 3) : null,
          });
        }
      }
      return {
        court_id: court.id,
        court_name: court.name,
        slots
      };
    });
    
    return new Promise((resolve) => setTimeout(() => resolve({
      success: true,
      data: mockData
    }), 600));
  },
};
