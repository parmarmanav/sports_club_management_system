import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { sportsApi, slotsApi } from '../../api/bookings';
import { Link } from 'react-router-dom';

export default function CourtsPublicPage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [sportId, setSportId] = useState('');

  const { data: sportsData } = useApi(() => sportsApi.getAll());
  const sports = sportsData || [];

  const { data: availData, loading } = useApi(
    () => sportId && date ? slotsApi.getAvailability({ sport_id: sportId, date }) : Promise.resolve({ data: [] }),
    [sportId, date]
  );
  const availability = availData || [];

  const shiftDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="page-enter">
      <section className="relative py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Book</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Court Availability</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Check available slots and plan your next session.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sport selector */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {sports.map(s => (
              <button key={s.id} onClick={() => setSportId(s.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  sportId === s.id ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-600 hover:border-slate-300'
                }`}>{s.name}</button>
            ))}
          </div>

          {sportId && (
            <>
              {/* Date picker */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <button onClick={() => shiftDate(-1)} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 bg-brand-surface px-4 py-2.5 rounded-xl border border-brand-border">
                  <Calendar className="w-4 h-4 text-brand-muted" />
                  <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                    className="text-sm font-medium text-slate-800 bg-transparent focus:outline-none" />
                </div>
                <button onClick={() => shiftDate(1)} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Availability */}
              {loading ? (
                <div className="text-center py-16 text-brand-muted text-sm">Loading availability...</div>
              ) : availability.length === 0 ? (
                <div className="text-center py-16 text-brand-muted text-sm">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p>No courts available for this sport on this date.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {availability.map(court => (
                    <div key={court.court_id} className="bg-brand-surface rounded-2xl border border-brand-border p-6">
                      <h3 className="font-semibold text-slate-800 mb-4">{court.court_name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {court.slots?.map((slot, i) => (
                          <div key={i}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                              slot.is_available
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 bg-slate-100 text-slate-400 line-through'
                            }`}>
                            {new Date(slot.start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {slot.is_available && slot.is_social && ' 🤝'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Link to="/login" className="inline-flex items-center gap-2 bg-brand-accent text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-brand-accent/90 transition-all">
                      Sign in to Book
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {!sportId && (
            <div className="text-center py-16 text-brand-muted text-sm">
              <p className="text-4xl mb-3">🎾</p>
              <p>Select a sport above to view court availability.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
