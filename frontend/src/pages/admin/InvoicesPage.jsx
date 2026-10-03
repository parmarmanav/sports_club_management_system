import { useState } from 'react';
import { FileText, Plus, X, DollarSign } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { invoicesApi } from '../../api/finance';
import { formatCurrency, formatDate, statusColor, capitalize } from '../../utils/formatters';
import { INVOICE_STATUSES, PAYMENT_METHODS } from '../../utils/constants';

function PayModal({ open, invoice, onClose, onPaid }) {
  const [method, setMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  if (!open || !invoice) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await invoicesApi.pay(invoice.id, { payment_method: method });
      onPaid();
      onClose();
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Record Payment</h2>
        <p className="text-sm text-brand-muted mb-4">Amount: {formatCurrency(invoice.total)}</p>
        <form onSubmit={handlePay} className="space-y-4">
          <div className="flex gap-2">
            {PAYMENT_METHODS.map(m => (
              <button key={m} type="button" onClick={() => setMethod(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                  method === m ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500'
                }`}>{capitalize(m)}</button>
            ))}
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {submitting ? 'Processing...' : 'Mark as Paid'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const params = {};
  if (statusFilter) params.status = statusFilter;

  const { data, loading, refetch } = useApi(() => invoicesApi.getAll(params), [statusFilter]);
  const invoices = data || [];
  const [payInvoice, setPayInvoice] = useState(null);

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Invoices</h1>
        <p className="text-sm text-brand-muted">Invoice management</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...INVOICE_STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              statusFilter === s ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500 hover:border-slate-300'
            }`}>{s ? capitalize(s) : 'All'}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <FileText className="w-10 h-10 mb-3 text-slate-300" /><p>No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 font-mono text-xs">#{inv.id?.slice(0, 8)}</td>
                    <td className="px-5 py-3.5 text-slate-600">{inv.members?.full_name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{formatDate(inv.created_at)}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{formatCurrency(inv.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(inv.status)}`}>
                        {capitalize(inv.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {(inv.status === 'sent' || inv.status === 'overdue') && (
                        <button onClick={() => setPayInvoice(inv)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                          <DollarSign className="w-3.5 h-3.5" /> Pay
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

      <PayModal open={!!payInvoice} invoice={payInvoice} onClose={() => setPayInvoice(null)} onPaid={refetch} />
    </div>
  );
}
