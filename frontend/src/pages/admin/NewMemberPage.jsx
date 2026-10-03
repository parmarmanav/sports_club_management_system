import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { membersApi, plansApi } from '../../api/members';
import { PAYMENT_METHODS } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';

export default function NewMemberPage() {
  const navigate = useNavigate();
  const { data: plansData } = useApi(() => plansApi.getAll());
  const plans = plansData || [];

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    plan_id: '',
    client_type: 'individual',
    address: '',
    payment_method: 'cash',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;
      if (!payload.date_of_birth) delete payload.date_of_birth;
      if (!payload.plan_id) delete payload.plan_id;
      if (!payload.address) delete payload.address;

      await membersApi.create(payload);
      navigate('/app/members');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-brand-muted hover:text-slate-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </button>

      <div className="bg-white rounded-xl border border-brand-border p-6">
        <h1 className="text-lg font-bold text-slate-800 mb-1">Register New Member</h1>
        <p className="text-sm text-brand-muted mb-6">Add a new member to Champions Club.</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text" required value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
              <input
                type="tel" required value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Email & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email" value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
              <input
                type="date" value={form.date_of_birth}
                onChange={(e) => update('date_of_birth', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
              />
            </div>
          </div>

          {/* Plan & Client Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Membership Plan</label>
              <select
                value={form.plan_id}
                onChange={(e) => update('plan_id', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
              >
                <option value="">No plan (walk-in)</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Type</label>
              <select
                value={form.client_type}
                onChange={(e) => update('client_type', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
              >
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          {/* Payment & Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m} type="button"
                  onClick={() => update('payment_method', m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.payment_method === m
                      ? 'border-brand-accent bg-brand-accent/5 text-brand-accent'
                      : 'border-brand-border text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {capitalize(m)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent resize-none"
              placeholder="Street address, city..."
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Registering...' : 'Register Member'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 border border-brand-border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
