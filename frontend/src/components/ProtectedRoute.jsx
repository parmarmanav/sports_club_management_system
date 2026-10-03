import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-3">
        <p className="text-5xl">🚫</p>
        <h2 className="text-xl font-semibold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
