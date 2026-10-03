import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, XCircle } from 'lucide-react';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get(`/v1/bookings?member_id=${user.id}`);
      setBookings(res.data?.data || []);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancelLoading(true);
      await api.post(`/v1/bookings/${bookingId}/cancel`);
      
      // Update local state
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in w-full">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">My Bookings</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      {loading ? (
        <div className="p-12 text-center animate-pulse text-gray-500">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-brand-dark" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
          <p className="text-gray-500 mb-6">You haven't made any court bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                  <span className="text-gray-400 text-sm">ID: {booking.id.substring(0, 8)}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-brand-gold mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Court</p>
                      <p className="font-medium text-gray-900">{booking.court_name || 'Court'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="text-brand-gold mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{booking.booking_date || booking.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="text-brand-gold mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{booking.start_time?.substring(0,5)} - {booking.end_time?.substring(0,5)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancelLoading}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded transition-colors disabled:opacity-50 border border-red-100"
                >
                  <XCircle size={18} />
                  <span className="font-medium">Cancel</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
