import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Calendar as CalIcon, User, CreditCard, ChevronRight, Clock, Users } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { sportsApi, slotsApi, bookingsApi } from '../../api/bookings';
import { PAYMENT_METHODS } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';

export default function NewBookingPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [sportId, setSportId] = useState('');
  const [date, setDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingType, setBookingType] = useState('member');
  const [memberId, setMemberId] = useState('');
  const [walkerName, setWalkerName] = useState('');
  const [walkerPhone, setWalkerPhone] = useState('');
  const [isTrial, setIsTrial] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { data: sportsData } = useApi(() => sportsApi.getAll());
  const sports = sportsData || [];

  const { data: availData, loading: slotsLoading } = useApi(
    () => sportId && date ? slotsApi.getAvailability({ sport_id: sportId, date }) : Promise.resolve({ data: [] }),
    [sportId, date]
  );
  const availability = availData || [];

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        slot_id: selectedSlot.id,
        payment_method: paymentMethod,
        is_trial: isTrial,
      };
      if (bookingType === 'member' && memberId) payload.member_id = memberId;
      if (bookingType === 'walkin') {
        payload.walker_name = walkerName;
        payload.walker_phone = walkerPhone;
      }
      await bookingsApi.create(payload);
      navigate('/app/bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const stepIcons = [CalIcon, User, CreditCard];
  const stepTitles = ["Date & Time", "Details", "Payment"];

  return (
    <div className="max-w-5xl mx-auto page-enter pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate('/app/bookings')} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Bookings
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Booking</h1>
        </div>
      </div>

      {/* Modern Stepper */}
      <div className="mb-10 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-accent -translate-y-1/2 rounded-full z-0 transition-all duration-500 ease-out"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        ></div>
        
        <div className="relative z-10 flex justify-between">
          {[1, 2, 3].map((s, idx) => {
            const Icon = stepIcons[idx];
            const isCompleted = step > s;
            const isCurrent = step === s;
            return (
              <div key={s} className="flex flex-col items-center gap-3 bg-brand-surface px-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-brand-accent text-white shadow-md shadow-brand-accent/20' 
                    : isCurrent 
                      ? 'bg-white border-2 border-brand-accent text-brand-accent shadow-lg shadow-brand-accent/10'
                      : 'bg-white border border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                  {stepTitles[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        {/* Step 1: Select Sport & Date */}
        {step === 1 && (
          <div className="p-8 sm:p-10 page-enter">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CalIcon className="w-5 h-5 text-brand-accent" /> Select Sport & Date
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {sports.map(s => (
                <button key={s.id} onClick={() => setSportId(s.id)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                    sportId === s.id 
                      ? 'border-brand-accent bg-brand-accent/5 shadow-inner' 
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                  <p className={`text-sm font-bold ${sportId === s.id ? 'text-brand-accent' : 'text-slate-700'}`}>{s.name}</p>
                </button>
              ))}
            </div>
            
            <div className="mb-10">
              <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today}
                className="w-full max-w-sm px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all cursor-pointer" />
            </div>

            {sportId && date && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Available Slots</h3>
                {slotsLoading ? (
                  <div className="flex items-center gap-3 text-brand-muted p-4">
                    <div className="w-5 h-5 border-2 border-slate-200 border-t-brand-accent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium">Loading slots...</span>
                  </div>
                ) : availability.length === 0 ? (
                  <p className="text-sm font-medium text-slate-500 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">No courts available for this sport on this date.</p>
                ) : (
                  <div className="space-y-8">
                    {availability.map((court, index) => (
                      <div key={court.court_id} className="animate-[pageEnter_0.3s_ease-out_forwards]" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-6 bg-brand-accent rounded-full"></div>
                          <p className="text-sm font-bold text-slate-700">{court.court_name}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {court.slots?.map((slot, slotIndex) => {
                            const isSelected = selectedSlot?.id === slot.id;
                            const timeString = new Date(slot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                            
                            const isPast = new Date(slot.start) < new Date();
                            
                            const isTrulyAvailable = (idx) => {
                              if (idx < 0 || idx >= court.slots.length) return false;
                              const currentAvailable = court.slots[idx].is_available;
                              const prevAvailable = idx > 0 ? court.slots[idx - 1].is_available : true;
                              return currentAvailable && prevAvailable;
                            };

                            const isAvailableForBooking = isTrulyAvailable(slotIndex) && isTrulyAvailable(slotIndex + 1) && !isPast;

                            return (
                              <button key={slot.id || slot.start} disabled={!isAvailableForBooking}
                                onClick={() => { setSelectedSlot({ ...slot, court_name: court.court_name }); setStep(2); }}
                                className={`relative px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all hover-lift ${
                                  !isAvailableForBooking
                                    ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 line-through'
                                    : isSelected
                                      ? 'border-brand-accent bg-brand-accent/10 text-brand-accent ring-4 ring-brand-accent/10'
                                      : slot.is_social
                                        ? 'border-indigo-100 bg-indigo-50/50 hover:border-indigo-300 text-slate-700'
                                        : 'border-slate-200 hover:border-brand-accent hover:text-brand-accent text-slate-700'
                                }`}>
                                {timeString}
                                {slot.is_social && <span className="absolute -top-2 -right-2 bg-indigo-100 text-indigo-700 p-1 rounded-full"><Users className="w-3 h-3" /></span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Who is booking? */}
        {step === 2 && (
          <div className="p-8 sm:p-10 page-enter">
            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-accent" /> Booking Details
            </h2>
            
            <div className="inline-flex items-center gap-3 bg-brand-accent/5 border border-brand-accent/20 px-4 py-2 rounded-lg mb-8">
              <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">{selectedSlot?.court_name}</span>
              <span className="w-1 h-1 bg-brand-accent/40 rounded-full"></span>
              <span className="text-sm font-semibold text-slate-800">{selectedSlot?.start ? new Date(selectedSlot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            </div>

            <div className="flex gap-4 mb-8">
              {['member', 'walkin'].map(t => (
                <button key={t} onClick={() => setBookingType(t)}
                  className={`flex-1 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                    bookingType === t ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}>{t === 'member' ? 'Club Member' : 'Walk-in Guest'}</button>
              ))}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
              {bookingType === 'member' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Member ID or UUID</label>
                  <input type="text" placeholder="e.g. MEM-1042" value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Guest Name</label>
                    <input type="text" placeholder="Full Name" value={walkerName}
                      onChange={(e) => setWalkerName(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" placeholder="Mobile Number" value={walkerPhone}
                      onChange={(e) => setWalkerPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all" />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer mt-6 p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-accent/30 transition-all">
                <input type="checkbox" checked={isTrial} onChange={(e) => setIsTrial(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Trial Session</p>
                  <p className="text-xs text-slate-500 font-medium">Mark this booking as a free trial session.</p>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="px-8 py-3.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md">
                Continue to Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Pay */}
        {step === 3 && (
          <div className="p-8 sm:p-10 page-enter">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-accent" /> Confirm & Pay
            </h2>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                  <span className="text-sm font-medium text-slate-600">Facility</span>
                  <span className="text-sm font-bold text-slate-900">{selectedSlot?.court_name}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                  <span className="text-sm font-medium text-slate-600">Date & Time</span>
                  <span className="text-sm font-bold text-slate-900">{selectedSlot?.start ? new Date(selectedSlot.start).toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Client Info</span>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-slate-900">{bookingType === 'member' ? 'Club Member' : walkerName || 'Walk-in Guest'}</span>
                    {isTrial && <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Free Trial</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`py-3.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      paymentMethod === m 
                        ? 'border-brand-accent bg-brand-accent/5 text-brand-accent shadow-sm' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                    }`}>{capitalize(m)}</button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-5 py-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700 mb-6 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">!</div>
                <p>{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="px-8 py-3.5 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Back</button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-3.5 bg-gradient-to-r from-brand-accent to-emerald-500 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-brand-accent/30 disabled:opacity-70 transition-all">
                {submitting ? 'Processing Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
