import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      config.headers['X-Dev-Role'] = 'front_desk';
      config.headers['X-Dev-Staff-Id'] = user.id;
    } catch(e) {}
  }
  
  return config;
});
