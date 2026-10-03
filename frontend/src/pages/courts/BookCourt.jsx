import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function BookCourt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { slot, court, date } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (!slot || !court || !date) {
      navigate('/courts');
    }
  }, [slot, court, date, navigate]);

  if (!slot || !court || !date) return null;

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/v1/bookings', {
        slot_id: slot.id,
        member_id: user.id,
        payment_method: 'card' // Assuming card payment is handled natively or implicitly
      });
      
      setSuccess(true);
      setBookingData(res.data?.data || { id: 'Confirmed' });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to book the court.';
      if (msg === 'SLOT_TAKEN') {
        setError('Sorry, this slot has just been taken. Please choose another.');
      } else if (msg === 'DAILY_LIMIT_REACHED') {
        setError('You have reached your daily booking limit.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">Your court slot has been successfully booked.</p>
          
          <div className="bg-brand-bg w-full rounded-lg p-6 text-left mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500">Court</div>
              <div className="font-medium text-right text-gray-900">{court.name}</div>
              
              <div className="text-gray-500">Date</div>
              <div className="font-medium text-right text-gray-900">{date}</div>
              
              <div className="text-gray-500">Time</div>
              <div className="font-medium text-right text-gray-900">{slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}</div>
              
              {bookingData?.price_charged !== undefined && (
                <>
                  <div className="text-gray-500">Price</div>
                  <div className="font-medium text-right text-brand-dark">₹{bookingData.price_charged}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 w-full">
            <Link to="/member/bookings" className="flex-1 bg-brand-dark text-white py-3 rounded font-medium hover:bg-opacity-90 transition-colors">
              View My Bookings
            </Link>
            <Link to="/courts" className="flex-1 border border-brand-dark text-brand-dark py-3 rounded font-medium hover:bg-gray-50 transition-colors">
              Book Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in w-full">
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Complete Your Booking</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 flex items-center justify-between">
          <span>{error}</span>
          <Link to="/courts" className="text-red-700 font-medium underline text-sm">Find new slot</Link>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900 text-lg">{court.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="text-brand-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900 text-lg">{date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center shrink-0">
                  <Clock className="text-brand-gold" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium text-gray-900 text-lg">{slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-brand-dark text-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-brand-gold mb-6">Confirm</h2>
            
            {slot.is_social && (
              <div className="bg-white/10 px-3 py-2 rounded text-sm mb-4">
                This is a <strong className="text-brand-gold">Social Play</strong> slot. You may be playing with others.
              </div>
            )}
            
            <div className="border-t border-white/20 pt-4 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-300">Total</span>
                <span className="text-2xl font-bold">₹{court.walk_in_rate}</span>
              </div>
              
              <button 
                onClick={handleBooking} 
                disabled={loading}
                className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold py-3 rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
