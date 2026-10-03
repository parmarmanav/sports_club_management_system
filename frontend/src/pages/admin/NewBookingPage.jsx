import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { sportsApi, courtsApi, slotsApi, bookingsApi } from '../../api/bookings';
import { formatCurrency } from '../../utils/formatters';
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

  return (
    <div className="max-w-3xl mx-auto page-enter">
      <button onClick={() => navigate('/app/bookings')} className="flex items-center gap-2 text-sm text-brand-muted hover:text-slate-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </button>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-brand-accent text-white' : 'bg-slate-100 text-slate-400'
            }`}>{step > s ? <Check className="w-4 h-4" /> : s}</div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-brand-accent' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-brand-border p-6">
        {/* Step 1: Select Sport & Date */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Select Sport & Date</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sports.map(s => (
                <button key={s.id} onClick={() => setSportId(s.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    sportId === s.id ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border hover:border-slate-300'
                  }`}>
                  <p className="text-sm font-medium text-slate-800">{s.name}</p>
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today}
                className="w-full max-w-xs px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
            </div>

            {sportId && date && (
              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-semibold text-slate-700">Available Slots</h3>
                {slotsLoading ? (
                  <p className="text-sm text-brand-muted">Loading slots...</p>
                ) : availability.length === 0 ? (
                  <p className="text-sm text-brand-muted">No courts available for this sport on this date.</p>
                ) : (
                  availability.map(court => (
                    <div key={court.court_id} className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">{court.court_name}</p>
                      <div className="flex flex-wrap gap-2">
                        {court.slots?.map(slot => (
                          <button key={slot.id || slot.start} disabled={!slot.is_available}
                            onClick={() => { setSelectedSlot({ ...slot, court_name: court.court_name }); setStep(2); }}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                              !slot.is_available
                                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                                : selectedSlot?.start === slot.start
                                  ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                                  : 'border-brand-border hover:border-brand-accent/50 text-slate-600'
                            }`}>
                            {new Date(slot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {slot.is_social && ' 🤝'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Who is booking? */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Who is booking?</h2>
            <p className="text-sm text-brand-muted">Slot: {selectedSlot?.court_name} at {selectedSlot?.start ? new Date(selectedSlot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</p>

            <div className="flex gap-3">
              {['member', 'walkin'].map(t => (
                <button key={t} onClick={() => setBookingType(t)}
                  className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    bookingType === t ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500'
                  }`}>{t === 'member' ? 'Club Member' : 'Walk-in Guest'}</button>
              ))}
            </div>

            {bookingType === 'member' ? (
              <input type="text" placeholder="Member ID (UUID)" value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Guest Name" value={walkerName}
                  onChange={(e) => setWalkerName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                <input type="tel" placeholder="Guest Phone" value={walkerPhone}
                  onChange={(e) => setWalkerPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isTrial} onChange={(e) => setIsTrial(e.target.checked)}
                className="rounded border-brand-border" />
              <span className="text-sm text-slate-700">This is a trial session</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-brand-border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Pay */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-800">Confirm Booking</h2>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-brand-muted">Court</span><span className="text-slate-800 font-medium">{selectedSlot?.court_name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-brand-muted">Time</span><span className="text-slate-800 font-medium">{selectedSlot?.start ? new Date(selectedSlot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-brand-muted">Type</span><span className="text-slate-800 font-medium">{bookingType === 'member' ? 'Member' : 'Walk-in'}{isTrial ? ' (Trial)' : ''}</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      paymentMethod === m ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500'
                    }`}>{capitalize(m)}</button>
                ))}
              </div>
            </div>

            {error && <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">{error}</div>}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-brand-border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Back</button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
