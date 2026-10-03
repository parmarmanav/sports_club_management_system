import { useState } from 'react';
import { Plus, X, Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { shiftsApi, staffApi } from '../../api/staff';
import { capitalize } from '../../utils/formatters';

function CreateShiftModal({ open, onClose, onCreated }) {
  const { data: staffData } = useApi(() => staffApi.getAll());
  const staff = staffData || [];
  const [form, setForm] = useState({ staff_id: '', shift_date: '', start_time: '09:00', end_time: '17:00' });
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await shiftsApi.create(form);
      onCreated();
      onClose();
      setForm({ staff_id: '', shift_date: '', start_time: '09:00', end_time: '17:00' });
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Add Shift</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={form.staff_id} onChange={(e) => setForm(p => ({ ...p, staff_id: e.target.value }))} required
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent">
            <option value="">Select Staff *</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.full_name} ({capitalize(s.role)})</option>)}
          </select>
          <input type="date" required value={form.shift_date}
            onChange={(e) => setForm(p => ({ ...p, shift_date: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-brand-muted mb-1">Start</label>
              <input type="time" value={form.start_time} onChange={(e) => setForm(p => ({ ...p, start_time: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1">End</label>
              <input type="time" value={form.end_time} onChange={(e) => setForm(p => ({ ...p, end_time: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Saving...' : 'Add Shift'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ShiftsPage() {
  const getWeekStart = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date.toISOString().split('T')[0];
  };

  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [createOpen, setCreateOpen] = useState(false);

  const weekEnd = (() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  })();

  const { data, loading, refetch } = useApi(
    () => shiftsApi.getAll({ start_date: weekStart, end_date: weekEnd }),
    [weekStart]
  );
  const shifts = data || [];

  const shiftWeek = (days) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + days);
    setWeekStart(d.toISOString().split('T')[0]);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this shift?')) return;
    try { await shiftsApi.remove(id); refetch(); }
    catch (err) { alert(err.message); }
  };

  const getShiftsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(s => s.shift_date === dateStr);
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Shift Schedule</h1>
          <p className="text-sm text-brand-muted">Weekly staff schedule</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Shift
        </button>
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-brand-border px-4 py-3">
        <button onClick={() => shiftWeek(-7)} className="p-1 text-slate-400 hover:text-slate-700"><ChevronLeft className="w-5 h-5" /></button>
        <span className="text-sm font-medium text-slate-800">
          {new Date(weekStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} — {new Date(weekEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <button onClick={() => shiftWeek(7)} className="p-1 text-slate-400 hover:text-slate-700"><ChevronRight className="w-5 h-5" /></button>
        <button onClick={() => setWeekStart(getWeekStart(new Date()))} className="ml-auto text-xs font-medium text-brand-accent">This Week</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayShifts = getShiftsForDay(day);
            const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
            return (
              <div key={day.toISOString()} className={`bg-white rounded-xl border p-3 min-h-[160px] ${isToday ? 'border-brand-accent/30 ring-1 ring-brand-accent/10' : 'border-brand-border'}`}>
                <p className={`text-xs font-medium mb-2 ${isToday ? 'text-brand-accent' : 'text-brand-muted'}`}>
                  {day.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit' })}
                </p>
                <div className="space-y-1.5">
                  {dayShifts.map(s => (
                    <div key={s.id} className="bg-brand-accent/5 border border-brand-accent/10 rounded-lg px-2 py-1.5 group relative">
                      <p className="text-xs font-medium text-slate-800 truncate">{s.staff?.full_name || 'Staff'}</p>
                      <p className="text-[10px] text-brand-muted">{s.start_time?.slice(0,5)} – {s.end_time?.slice(0,5)}</p>
                      <button onClick={() => handleDelete(s.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {dayShifts.length === 0 && <p className="text-[10px] text-slate-300 text-center pt-4">No shifts</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateShiftModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
    </div>
  );
}
