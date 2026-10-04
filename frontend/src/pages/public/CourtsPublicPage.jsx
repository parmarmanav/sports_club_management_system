import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { sportsApi, slotsApi, bookingsApi } from '../../api/bookings';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CourtsPublicPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [sportId, setSportId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPastBookings, setShowPastBookings] = useState(false);

  const { data: sportsData } = useApi(() => sportsApi.getAll());
  const sports = sportsData || [];

  const { data: bookingsData, loading: bookingsLoading } = useApi(
    () => (user && showPastBookings) ? bookingsApi.getAll() : Promise.resolve({ data: [] }),
    [user, showPastBookings, bookingSuccess]
  );
  const myBookings = bookingsData || [];

  const { data: availData, loading } = useApi(
    () => sportId && date ? slotsApi.getAvailability({ sport_id: sportId, date }) : Promise.resolve({ data: [] }),
    [sportId, date]
  );
  const availability = availData || [];

  const shiftDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
    setSelectedSlot(null);
    setBookingSuccess(false);
  };

  const handleSportChange = (id) => {
    setSportId(id);
    setSelectedSlot(null);
    setBookingSuccess(false);
  };

  const handleSlotClick = (court, slot, isAvailable) => {
    if (user && isAvailable) {
      setSelectedSlot({ court, slot });
      setBookingSuccess(false);
    }
  };

  const handleBook = () => {
    if (!selectedSlot) return;
    navigate('/checkout', {
      state: {
        type: 'court',
        title: 'Court Booking Checkout',
        item: {
          court_id: selectedSlot.court.court_id,
          slot_id: selectedSlot.slot.id,
          date,
          time: selectedSlot.slot.start,
          name: `${selectedSlot.court.court_name}`,
          desc: `${new Date(selectedSlot.slot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
          price: 500 // Base price, discount applied at checkout
        }
      }
    });
  };

  // Pre-select first sport if loaded and none selected
  if (sports.length > 0 && !sportId) {
    setSportId(sports[0].id);
  }

  return (
    <div className="page-enter bg-brand-surface min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 bg-brand-primary">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-brand-accent/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent-light text-xs font-bold tracking-widest uppercase mb-6">
            Book a session
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Reserve Your <span className="text-gradient">Court</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience premium facilities. Choose your sport, pick a time, and secure your spot at Champions Club.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-10 pb-24 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="glass-dark rounded-2xl p-2 sm:p-3 mb-10 flex flex-wrap justify-center gap-2 max-w-fit mx-auto shadow-2xl">
            {sports.map(s => (
              <button key={s.id} onClick={() => handleSportChange(s.id)}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  sportId === s.id 
                    ? 'bg-gradient-to-r from-brand-accent to-emerald-600 text-white shadow-[0_0_15px_rgba(13,148,136,0.4)]' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}>
                {s.name}
              </button>
            ))}
          </div>

          {sportId && (
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              
              {/* Date Control */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Select Date & Time</h2>
                  <p className="text-sm text-slate-500 mt-1">Real-time availability for courts</p>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-end">
                  {user && (
                    <button 
                      onClick={() => setShowPastBookings(!showPastBookings)} 
                      className="text-sm font-semibold text-brand-accent hover:text-brand-accent-light underline underline-offset-4 mr-2"
                    >
                      {showPastBookings ? 'Back to Booking' : 'View Past Bookings'}
                    </button>
                  )}
                  {!showPastBookings && (
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <button onClick={() => shiftDate(-1)} className="p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 px-3">
                      <Calendar className="w-4 h-4 text-brand-accent" />
                      <input type="date" value={date} min={today} onChange={(e) => {
                        setDate(e.target.value);
                        setSelectedSlot(null);
                        setBookingSuccess(false);
                      }}
                        className="text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer" />
                    </div>
                    <button onClick={() => shiftDate(1)} className="p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  )}
                </div>
              </div>

              {/* View Toggle */}
              {showPastBookings ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Your Past Bookings</h3>
                  {bookingsLoading ? (
                    <p className="text-sm text-slate-500">Loading your bookings...</p>
                  ) : myBookings.length === 0 ? (
                    <p className="text-sm text-slate-500">You have no bookings yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.map(b => (
                        <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                          <div>
                            <p className="font-bold text-slate-800">{b.court_slots?.courts?.name || 'Court'}</p>
                            <p className="text-xs text-slate-500">{new Date(b.court_slots?.start_time || new Date()).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 mb-1">
                              {b.status}
                            </span>
                            <p className="text-sm font-bold text-emerald-600">₹{b.price_charged || 500}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Availability Grid */}
                  {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-brand-muted">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-accent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-medium animate-pulse">Loading real-time availability...</p>
                </div>
              ) : availability.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">No courts available</h3>
                  <p className="text-sm text-slate-500">All slots are fully booked for this date. Try selecting another date.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {availability.map((court, index) => (
                    <div key={court.court_id} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-8 bg-brand-accent rounded-full"></div>
                        <h3 className="text-lg font-bold text-slate-800">{court.court_name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {court.slots?.map((slot, i) => {
                          const timeString = new Date(slot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                          const isSelected = selectedSlot?.slot?.id === slot.id;
                          
                          const isPast = new Date(slot.start) < new Date();
                          const isTrulyAvailable = (idx) => {
                            if (idx < 0 || idx >= court.slots.length) return false;
                            const currentAvailable = court.slots[idx].is_available;
                            const prevAvailable = idx > 0 ? court.slots[idx - 1].is_available : true;
                            return currentAvailable && prevAvailable;
                          };
                          
                          const isAvailableForBooking = isTrulyAvailable(i) && isTrulyAvailable(i + 1) && !isPast;

                          return (
                            <button key={i}
                              disabled={!user || !isAvailableForBooking}
                              onClick={() => handleSlotClick(court, slot, isAvailableForBooking)}
                              className={`relative overflow-hidden px-1 py-3 rounded-xl text-center border-2 transition-all duration-300 ${
                                isSelected 
                                  ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105 z-10' 
                                  : isAvailableForBooking
                                    ? slot.is_social 
                                        ? `border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 ${user ? 'cursor-pointer' : ''}` 
                                        : `border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 ${user ? 'hover-lift cursor-pointer' : ''}`
                                    : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                              }`}>
                              
                              <p className={`text-sm font-bold ${isSelected ? 'text-white' : isAvailableForBooking ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                                {timeString}
                              </p>
                              
                              {isAvailableForBooking && (
                                <div className="mt-1 flex justify-center items-center gap-1">
                                  {slot.is_social ? (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-100' : 'text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-md'}`}>
                                      <Users className="w-3 h-3" /> Social
                                    </span>
                                  ) : (
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-100' : 'text-emerald-600'}`}>
                                      <Clock className="w-3 h-3" /> 60m
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Booking CTA Section */}
                  {!user ? (
                    <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-white mb-2">Ready to play?</h4>
                        <p className="text-slate-400 text-sm">Sign in to book these slots and manage your reservations.</p>
                      </div>
                      <Link to="/login" className="relative z-10 flex items-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-100 hover-lift hover-glow transition-all">
                        Sign in to Book <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : bookingSuccess ? (
                    <div className="mt-12 p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                      <div className="relative z-10 flex items-center gap-4 text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-1">Booking Confirmed!</h4>
                          <p className="text-emerald-100 text-sm">Your court has been successfully reserved.</p>
                        </div>
                      </div>
                      <button onClick={() => { setBookingSuccess(false); setShowPastBookings(true); }} className="relative z-10 flex items-center gap-2 bg-white text-emerald-900 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-100 hover-lift transition-all">
                        View My Bookings <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : selectedSlot ? (
                    <div className="mt-12 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden border-2 border-emerald-500/50">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10 text-center sm:text-left text-white">
                        <h4 className="text-xl font-bold mb-2">Proceed to Checkout</h4>
                        <p className="text-slate-300 text-sm mb-1">
                          Booking <span className="font-bold text-emerald-400">{selectedSlot.court.court_name}</span> at <span className="font-bold text-emerald-400">{new Date(selectedSlot.slot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                      <div className="relative z-10 flex flex-wrap gap-3 justify-center sm:justify-end">
                        <button onClick={() => setSelectedSlot(null)} className="px-6 py-3.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all">
                          Cancel
                        </button>
                        <button onClick={handleBook} className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all hover-lift">
                          Checkout <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-12 p-8 bg-gradient-to-br from-brand-primary to-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl"></div>
                      <div className="relative z-10 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-white mb-2">Ready to play?</h4>
                        <p className="text-slate-300 text-sm">Select an available slot above to book instantly.</p>
                      </div>
                    </div>
                  )}
                </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
