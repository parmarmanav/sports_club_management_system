import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { plansApi } from '../../api/members';
import { formatCurrency } from '../../utils/formatters';

export default function AdminPlansPage() {
  const { data: plans, loading, error, refetch } = useApi(() => plansApi.getAll());
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration_months: 12,
    court_rate: 0,
    shop_discount_pct: 0,
    bar_discount_pct: 0,
    daily_booking_limit: 2,
    is_junior: false,
    trial_rate: 0,
  });

  const handleOpenForm = (plan = null) => {
    if (plan) {
      setFormData(plan);
      setCurrentPlan(plan);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration_months: 12,
        court_rate: 0,
        shop_discount_pct: 0,
        bar_discount_pct: 0,
        daily_booking_limit: 2,
        is_junior: false,
        trial_rate: 0,
      });
      setCurrentPlan(null);
    }
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentPlan(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPlan) {
        await plansApi.update(currentPlan.id, formData);
      } else {
        await plansApi.create(formData);
      }
      refetch();
      handleCloseForm();
    } catch (err) {
      alert('Failed to save plan: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await plansApi.delete(id);
      refetch();
    } catch (err) {
      alert('Failed to delete plan: ' + err.message);
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Plans</h1>
          <p className="text-sm text-brand-muted">Manage membership plans and pricing</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">
            <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mr-3" />
            Loading plans...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-500 text-sm gap-2">
            <p>Failed to load plans</p>
            <button onClick={refetch} className="text-brand-accent hover:underline text-xs">Retry</button>
          </div>
        ) : !plans || plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <p className="text-4xl mb-3">📋</p>
            <p>No plans found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Duration</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Discounts (Shop/Bar)</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{p.name} {p.is_junior && <span className="text-xs ml-2 text-brand-accent">(Junior)</span>}</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatCurrency(p.price)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.duration_months} mo</td>
                    <td className="px-5 py-3.5 text-slate-600">{p.shop_discount_pct}% / {p.bar_discount_pct}%</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenForm(p)} className="p-1.5 text-slate-400 hover:text-brand-accent transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-800">{currentPlan ? 'Edit Plan' : 'New Plan'}</h2>
              <button onClick={handleCloseForm} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto shrink">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows="2" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Months)</label>
                    <input type="number" required value={formData.duration_months} onChange={(e) => setFormData({...formData, duration_months: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shop Discount (%)</label>
                    <input type="number" step="0.01" value={formData.shop_discount_pct} onChange={(e) => setFormData({...formData, shop_discount_pct: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bar Discount (%)</label>
                    <input type="number" step="0.01" value={formData.bar_discount_pct} onChange={(e) => setFormData({...formData, bar_discount_pct: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Court Rate</label>
                    <input type="number" step="0.01" value={formData.court_rate} onChange={(e) => setFormData({...formData, court_rate: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Daily Booking Limit</label>
                    <input type="number" value={formData.daily_booking_limit} onChange={(e) => setFormData({...formData, daily_booking_limit: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-brand-border text-sm focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="is_junior" checked={formData.is_junior} onChange={(e) => setFormData({...formData, is_junior: e.target.checked})} className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                  <label htmlFor="is_junior" className="text-sm font-medium text-slate-700">Junior Plan (Under 18)</label>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={handleCloseForm} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-accent rounded-lg hover:bg-brand-accent/90">Save Plan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
