import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, CreditCard, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [memberInfo, setMemberInfo] = useState(null);
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch member details
        const [memberRes, entitlementsRes] = await Promise.all([
          api.get(`/v1/members/${user.id}`).catch(() => ({ data: { data: null } })),
          api.get(`/v1/members/${user.id}/entitlements`).catch(() => ({ data: { data: null } }))
        ]);
        
        setMemberInfo(memberRes.data?.data);
        setEntitlements(entitlementsRes.data?.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Welcome, {memberInfo?.full_name || user?.email?.split('@')[0]}</h1>
          <p className="text-gray-600">Here's your sports club overview.</p>
        </div>
        <Link to="/courts" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark px-6 py-2 rounded font-medium transition-colors hidden md:block">
          Book a Court
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-brand-bg p-3 rounded-lg text-brand-dark">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Membership Status</p>
            <p className="font-bold text-lg text-gray-900 capitalize">
              {memberInfo?.status || 'Active'}
            </p>
            {memberInfo?.plans && <p className="text-xs text-brand-gold font-medium mt-1">{memberInfo.plans.name}</p>}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-brand-bg p-3 rounded-lg text-brand-dark">
            <Calendar size={24} />
          </div>
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">My Bookings</p>
            <Link to="/member/bookings" className="flex items-center justify-between group">
              <span className="font-bold text-lg text-gray-900 group-hover:text-brand-dark transition-colors">Manage Bookings</span>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-brand-dark transition-colors" />
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="bg-brand-bg p-3 rounded-lg text-brand-dark">
            <CreditCard size={24} />
          </div>
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">My Profile</p>
            <Link to="/member/profile" className="flex items-center justify-between group">
              <span className="font-bold text-lg text-gray-900 group-hover:text-brand-dark transition-colors">Account Details</span>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-brand-dark transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-brand-dark mb-6">Entitlements & Benefits</h2>
          {entitlements ? (
            <ul className="space-y-4">
              {Object.entries(entitlements).map(([key, value]) => (
                <li key={key} className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-gray-900">{String(value)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
              No specific entitlements found for your current plan.
            </div>
          )}
        </div>
        
        <div className="bg-brand-dark text-white rounded-xl shadow-md p-8 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold text-brand-gold mb-4">Ready to Play?</h2>
          <p className="text-gray-300 mb-8">Book your favorite court instantly and enjoy premium facilities.</p>
          <Link to="/courts" className="bg-white text-brand-dark hover:bg-brand-gold hover:text-brand-dark px-8 py-3 rounded font-medium transition-all shadow-md w-full sm:w-auto">
            View Court Availability
          </Link>
        </div>
      </div>
    </div>
  );
}
