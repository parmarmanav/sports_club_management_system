import { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { payrollApi } from '../../api/staff';
import { formatCurrency, capitalize, formatDate } from '../../utils/formatters';
import { statusColor } from '../../utils/formatters';

export default function PayrollPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const { data, loading, refetch } = useApi(() => payrollApi.getAll({ month: `${month}-01` }), [month]);
  const payrolls = data || [];
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await payrollApi.generate(`${month}-01`);
      refetch();
    } catch (err) { alert(err.message); }
    finally { setGenerating(false); }
  };

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payroll</h1>
          <p className="text-sm text-brand-muted">Salary management</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <button onClick={handleGenerate} disabled={generating}
            className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            <Plus className="w-4 h-4" /> {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : payrolls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <Receipt className="w-10 h-10 mb-3 text-slate-300" /><p>No payroll records for this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Staff</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Salary</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Deductions</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Net</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrolls.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{p.staff?.full_name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatCurrency(p.base_salary)}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{formatCurrency(p.deductions)}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{formatCurrency(p.net_salary)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(p.status)}`}>
                        {capitalize(p.status)}
                      </span>
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
