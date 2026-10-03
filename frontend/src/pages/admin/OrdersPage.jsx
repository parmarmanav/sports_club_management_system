import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { shopApi } from '../../api/shop';
import { formatCurrency, formatDateTime, statusColor, capitalize } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const params = {};
  if (statusFilter) params.status = statusFilter;

  const { data, loading, refetch } = useApi(() => shopApi.getOrders(params), [statusFilter]);
  const orders = data || [];

  const handleStatusChange = async (id, status) => {
    try {
      await shopApi.updateOrderStatus(id, status);
      refetch();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-brand-muted">Shop order history</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              statusFilter === s ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500 hover:border-slate-300'
            }`}>{s ? capitalize(s) : 'All'}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <ShoppingCart className="w-10 h-10 mb-3 text-slate-300" /><p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Channel</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-800">{formatDateTime(o.created_at)}</td>
                    <td className="px-5 py-3.5 text-slate-600 capitalize hidden md:table-cell">{o.channel?.replace('_', ' ')}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{formatCurrency(o.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(o.status)}`}>
                        {capitalize(o.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-brand-border text-xs focus:outline-none">
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
