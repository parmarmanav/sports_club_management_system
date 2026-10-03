import { useState } from 'react';
import {
  Users,
  CalendarDays,
  TrendingUp,
  Beer,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
} from 'lucide-react';
import useApi from '../../hooks/useApi';
import { dashboardApi } from '../../api/dashboard';
import { formatCurrency, statusColor, capitalize } from '../../utils/formatters';

// ─── Summary Card ───
function StatCard({ icon: Icon, label, value, subtitle, color = 'bg-slate-100 text-slate-600' }) {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brand-muted font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-brand-muted mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// ─── Low Stock Alert Row ───
function LowStockItem({ product }) {
  const urgency = product.stock_qty === 0 ? 'Out of stock' : `${product.stock_qty} left`;
  const urgencyColor = product.stock_qty === 0 ? 'text-rose-600' : 'text-amber-600';
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Package className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{product.name}</p>
          <p className="text-xs text-brand-muted">Threshold: {product.low_stock_threshold}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${urgencyColor}`}>{urgency}</span>
    </div>
  );
}

// ─── Revenue Period Picker ───
function PeriodTabs({ value, onChange }) {
  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];
  return (
    <div className="flex bg-slate-100 rounded-lg p-0.5">
      {periods.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            value === p.key
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-brand-muted hover:text-slate-700'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───
export default function DashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState('month');

  const { data: summary, loading: summaryLoading } = useApi(() => dashboardApi.getSummary());
  const { data: revenue, loading: revenueLoading } = useApi(
    () => dashboardApi.getRevenue(revenuePeriod),
    [revenuePeriod]
  );
  const { data: lowStock, loading: lowStockLoading } = useApi(() => dashboardApi.getLowStock());

  const s = summary || {};
  const r = revenue || {};

  return (
    <div className="space-y-6 page-enter">
      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Active Members"
          value={summaryLoading ? '...' : s.active_members}
          subtitle={s.expiring_soon ? `${s.expiring_soon} expiring soon` : null}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={CalendarDays}
          label="Today's Bookings"
          value={summaryLoading ? '...' : s.today_bookings}
          color="bg-sky-50 text-sky-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Revenue"
          value={summaryLoading ? '...' : formatCurrency(s.total_revenue_month)}
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={Beer}
          label="Open Bar Tabs"
          value={summaryLoading ? '...' : s.open_tabs}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ─── Revenue & Low Stock ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Revenue</h3>
              <p className="text-sm text-brand-muted">Breakdown by source</p>
            </div>
            <PeriodTabs value={revenuePeriod} onChange={setRevenuePeriod} />
          </div>

          {revenueLoading ? (
            <div className="flex items-center justify-center h-40 text-brand-muted text-sm">Loading...</div>
          ) : (
            <>
              <p className="text-3xl font-bold text-slate-800 mb-6">{formatCurrency(r.total)}</p>

              {/* Source breakdown as mini-bars */}
              <div className="space-y-3">
                {r.by_source && Object.entries(r.by_source).map(([source, amount]) => {
                  const pct = r.total > 0 ? (amount / r.total) * 100 : 0;
                  return (
                    <div key={source}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600 capitalize">{source.replace('_', ' ')}</span>
                        <span className="text-sm font-medium text-slate-800">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-accent rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment method chips */}
              {r.by_method && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                  {Object.entries(r.by_method).map(([method, amount]) => (
                    <div key={method} className="flex-1 bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-brand-muted capitalize">{method}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatCurrency(amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-semibold text-slate-800">Low Stock Alerts</h3>
          </div>

          {lowStockLoading ? (
            <div className="flex items-center justify-center h-40 text-brand-muted text-sm">Loading...</div>
          ) : lowStock && lowStock.length > 0 ? (
            <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
              {lowStock.map((product) => (
                <LowStockItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-brand-muted text-sm">
              <Package className="w-8 h-8 mb-2 text-slate-300" />
              <p>All stock levels are healthy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
