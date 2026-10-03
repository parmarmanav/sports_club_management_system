import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const DEV_ROLES = ['owner', 'admin', 'manager', 'front_desk', 'bar_staff', 'kitchen_staff', 'shop_staff'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load persisted session on mount
  useEffect(() => {
    const role = localStorage.getItem('cc_dev_role');
    const staffId = localStorage.getItem('cc_dev_staff_id');
    if (role) {
      setUser({ role, staffId, name: `Dev (${role})` });
    }
    setLoading(false);
  }, []);

  const loginWithDevRole = (role, staffId = null) => {
    localStorage.setItem('cc_dev_role', role);
    if (staffId) localStorage.setItem('cc_dev_staff_id', staffId);
    setUser({ role, staffId, name: `Dev (${role})` });
  };

  const logout = () => {
    localStorage.removeItem('cc_dev_role');
    localStorage.removeItem('cc_dev_staff_id');
    localStorage.removeItem('cc_token');
    setUser(null);
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithDevRole, logout, hasRole, DEV_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
