import { useState } from 'react';
import { Plus, X, UserCog } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { staffApi } from '../../api/staff';
import { capitalize } from '../../utils/formatters';

const ROLE_OPTIONS = ['manager', 'front_desk', 'bar_staff', 'kitchen_staff', 'shop_staff'];

function CreateStaffModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', role: 'front_desk', monthly_salary: '' });
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (payload.monthly_salary) payload.monthly_salary = parseFloat(payload.monthly_salary);
      else delete payload.monthly_salary;
      if (!payload.phone) delete payload.phone;
      await staffApi.create(payload);
      onCreated();
      onClose();
      setForm({ full_name: '', email: '', phone: '', role: 'front_desk', monthly_salary: '' });
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Add Staff</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Full Name *" value={form.full_name}
            onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <input type="email" required placeholder="Email *" value={form.email}
            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <input type="tel" placeholder="Phone" value={form.phone}
            onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <select value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent">
            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{capitalize(r)}</option>)}
          </select>
          <input type="number" placeholder="Monthly Salary (₹)" value={form.monthly_salary}
            onChange={(e) => setForm(p => ({ ...p, monthly_salary: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Adding...' : 'Add Staff Member'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StaffPage() {
  const { data, loading, refetch } = useApi(() => staffApi.getAll());
  const staff = data || [];
  const [createOpen, setCreateOpen] = useState(false);

  const roleColor = (role) => {
    const map = {
      owner: 'bg-purple-50 text-purple-700 border-purple-200',
      admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      manager: 'bg-sky-50 text-sky-700 border-sky-200',
      front_desk: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bar_staff: 'bg-amber-50 text-amber-700 border-amber-200',
      kitchen_staff: 'bg-orange-50 text-orange-700 border-orange-200',
      shop_staff: 'bg-teal-50 text-teal-700 border-teal-200',
    };
    return map[role] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Staff</h1>
          <p className="text-sm text-brand-muted">Employee roster</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <UserCog className="w-10 h-10 mb-3 text-slate-300" /><p>No staff records</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden lg:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
                          {s.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-slate-800">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{s.email}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">{s.phone || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleColor(s.role)}`}>
                        {capitalize(s.role)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateStaffModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
    </div>
  );
}
