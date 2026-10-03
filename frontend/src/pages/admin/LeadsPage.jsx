import { useState } from 'react';
import { Search, Plus, UserPlus, ArrowRight, X } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { leadsApi, plansApi } from '../../api/members';
import { statusColor, capitalize, formatDate } from '../../utils/formatters';
import { LEAD_STATUSES, LEAD_SOURCES, PAYMENT_METHODS } from '../../utils/constants';

// ─── Create Lead Modal ───
function CreateLeadModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', message: '', source: 'walk_in' });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leadsApi.create(form);
      onCreated();
      onClose();
      setForm({ full_name: '', phone: '', email: '', message: '', source: 'walk_in' });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">New Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Full Name *" value={form.full_name}
            onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <input type="tel" required placeholder="Phone *" value={form.phone}
            onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <select value={form.source} onChange={(e) => setForm(p => ({ ...p, source: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent">
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
          </select>
          <textarea placeholder="Message / Notes" value={form.message} rows={2}
            onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent resize-none" />
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Creating...' : 'Create Lead'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Convert Lead Modal ───
function ConvertModal({ open, lead, onClose, onConverted }) {
  const { data: plansData } = useApi(() => plansApi.getAll());
  const plans = plansData || [];
  const [planId, setPlanId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);

  if (!open || !lead) return null;

  const handleConvert = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leadsApi.convert(lead.id, { plan_id: planId, payment_method: paymentMethod });
      onConverted();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Convert to Member</h2>
        <p className="text-sm text-brand-muted mb-5">Converting: {lead.full_name}</p>
        <form onSubmit={handleConvert} className="space-y-4">
          <select value={planId} onChange={(e) => setPlanId(e.target.value)} required
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent">
            <option value="">Select a plan *</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
          </select>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  paymentMethod === m ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-600'
                }`}>{capitalize(m)}</button>
            ))}
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {submitting ? 'Converting...' : 'Convert to Member'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Leads Page ───
export default function LeadsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [convertLead, setConvertLead] = useState(null);

  const params = {};
  if (statusFilter) params.status = statusFilter;

  const { data, loading, refetch } = useApi(() => leadsApi.getAll(params), [statusFilter]);
  const leads = data || [];

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Leads & Enquiries</h1>
          <p className="text-sm text-brand-muted">Track and convert prospects</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">
          <Plus className="w-4 h-4" /> New Lead
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!statusFilter ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500 hover:border-slate-300'}`}>
          All
        </button>
        {LEAD_STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${statusFilter === s ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500 hover:border-slate-300'}`}>
            {capitalize(s)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <p className="text-4xl mb-3">📋</p><p>No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden lg:table-cell">Source</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800">{l.full_name}</p>
                      {l.email && <p className="text-xs text-brand-muted">{l.email}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{l.phone}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell capitalize">{l.source?.replace('_', ' ')}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">{formatDate(l.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(l.status)}`}>
                        {capitalize(l.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {l.status !== 'converted' && l.status !== 'lost' && (
                        <button onClick={() => setConvertLead(l)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
                          <UserPlus className="w-3.5 h-3.5" /> Convert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateLeadModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={refetch} />
      <ConvertModal open={!!convertLead} lead={convertLead} onClose={() => setConvertLead(null)} onConverted={refetch} />
    </div>
  );
}
