import { useState } from 'react';
import { CalendarDays, Plus, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { bookingsApi, sportsApi, courtsApi, slotsApi } from '../../api/bookings';
import { statusColor, capitalize, formatDate, formatCurrency } from '../../utils/formatters';

export default function BookingsPage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [statusFilter, setStatusFilter] = useState('');

  const params = { date };
  if (statusFilter) params.status = statusFilter;

  const { data, loading, refetch } = useApi(() => bookingsApi.getAll(params), [date, statusFilter]);
  const bookings = data || [];

  const shiftDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Court Bookings</h1>
          <p className="text-sm text-brand-muted">View and manage court reservations</p>
        </div>
        <a href="/app/bookings/new"
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">
          <Plus className="w-4 h-4" /> New Booking
        </a>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-brand-border px-4 py-3">
        <button onClick={() => shiftDate(-1)} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-brand-muted" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="text-sm font-medium text-slate-800 focus:outline-none" />
        </div>
        <button onClick={() => shiftDate(1)} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={() => setDate(today)}
          className="ml-auto text-xs font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
          Today
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {['', 'confirmed', 'cancelled', 'completed'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              statusFilter === s ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500 hover:border-slate-300'
            }`}>
            {s ? capitalize(s) : 'All'}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <CalendarDays className="w-10 h-10 mb-3 text-slate-300" />
            <p>No bookings for {formatDate(date)}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Time</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Court</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Booked By</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map(b => {
                  const startTime = b.court_slots?.start_time
                    ? new Date(b.court_slots.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    : '—';
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{startTime}</td>
                      <td className="px-5 py-3.5 text-slate-600">{b.court_slots?.courts?.name || '—'}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-slate-800">{b.members?.full_name || b.walker_name || 'Walk-in'}</p>
                        {b.is_trial && <span className="text-xs text-amber-600 font-medium">Trial</span>}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{formatCurrency(b.price_charged)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(b.status)}`}>
                          {capitalize(b.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        {b.status === 'confirmed' && (
                          <button onClick={() => handleCancel(b.id)}
                            className="text-rose-400 hover:text-rose-600 transition-colors" title="Cancel booking">
                            <XIcon className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
