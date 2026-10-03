import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/v1/members/${user.id}`);
        setProfile(res.data?.data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in w-full">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">My Profile</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-brand-bg p-8 flex items-center gap-6 border-b border-gray-100">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-gold">
            <User size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{profile?.full_name || user?.email?.split('@')[0]}</h2>
            <p className="text-gray-500 capitalize">{profile?.status || 'Active Member'}</p>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Contact Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{profile?.email || user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{profile?.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <MapPin className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{profile?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">To update your profile information, please contact the front desk.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
