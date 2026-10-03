import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { dashboardApi } from '../../api/dashboard';
import { formatCurrency } from '../../utils/formatters';

export default function ReportsPage() {
  const [period, setPeriod] = useState('month');
  const { data: revenue, loading } = useApi(() => dashboardApi.getRevenue(period), [period]);
  const r = revenue || {};

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  // Simple bar chart using pure CSS
  const maxSourceValue = r.by_source ? Math.max(...Object.values(r.by_source), 1) : 1;

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Revenue Reports</h1>
          <p className="text-sm text-brand-muted">Financial analytics</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-0.5">
          {periods.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                period === p.key ? 'bg-white text-slate-800 shadow-sm' : 'text-brand-muted hover:text-slate-700'
              }`}>{p.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
      ) : (
        <>
          {/* Total revenue hero */}
          <div className="bg-white rounded-xl border border-brand-border p-8 text-center">
            <p className="text-sm text-brand-muted mb-1">Total Revenue</p>
            <p className="text-4xl font-bold text-slate-800">{formatCurrency(r.total)}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* By Source */}
            <div className="bg-white rounded-xl border border-brand-border p-6">
              <h3 className="font-semibold text-slate-800 mb-5">Revenue by Source</h3>
              {r.by_source && Object.entries(r.by_source).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(r.by_source).map(([source, amount]) => {
                    const pct = (amount / maxSourceValue) * 100;
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-slate-600 capitalize">{source.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-semibold text-slate-800">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-accent to-brand-accent-light rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(pct, 3)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-brand-muted text-center py-8">No data</p>
              )}
            </div>

            {/* By Payment Method */}
            <div className="bg-white rounded-xl border border-brand-border p-6">
              <h3 className="font-semibold text-slate-800 mb-5">By Payment Method</h3>
              {r.by_method && Object.entries(r.by_method).length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(r.by_method).map(([method, amount]) => {
                    const pct = r.total > 0 ? ((amount / r.total) * 100).toFixed(1) : 0;
                    return (
                      <div key={method} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-brand-accent capitalize">{method.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 capitalize">{method}</p>
                          <p className="text-xs text-brand-muted">{pct}% of total</p>
                        </div>
                        <p className="text-base font-bold text-slate-800">{formatCurrency(amount)}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-brand-muted text-center py-8">No data</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
