import client from './client';

export const customerApi = {
  getProfile: () => client.get('/v1/customer/profile'),
  getPlans: () => client.get('/v1/customer/plans'),
  buyPlan: (plan_id) => client.post('/v1/customer/buy-plan', { plan_id }),
};
