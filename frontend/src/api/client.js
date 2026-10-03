const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get stored auth info
function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  
  // Dev-mode auth
  const devRole = localStorage.getItem('cc_dev_role');
  const devStaffId = localStorage.getItem('cc_dev_staff_id');
  if (devRole) {
    headers['X-Dev-Role'] = devRole;
    if (devStaffId) headers['X-Dev-Staff-Id'] = devStaffId;
    return headers;
  }

  // JWT auth
  const token = localStorage.getItem('cc_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || data.error || 'Request failed');
    err.status = res.status;
    err.code = data.error;
    throw err;
  }

  return data;
}

// Convenience methods
export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
