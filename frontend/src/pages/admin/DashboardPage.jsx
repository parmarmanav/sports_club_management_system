import { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Building,
  Users,
  Download,
  AlertCircle,
  Receipt,
  FileText,
  Clock,
  Package,
  CalendarDays,
  Store,
  Beer
} from 'lucide-react';
import useApi from '../../hooks/useApi';
import { dashboardApi } from '../../api/dashboard';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

// ─── Premium Stat Card ───
function PremiumStatCard({ title, value, subtitle, icon: Icon, trend, isOwed }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${isOwed ? 'bg-rose-50 text-rose-600' : 'bg-slate-900 text-white'}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-sm text-slate-500 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Mini Action Card ───
function ActionCard({ title, value, icon: Icon, colorClass, urgency }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
      {urgency && (
        <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
          <AlertCircle className="w-3 h-3" /> Action Needed
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'member';
  const isAdmin = ['admin', 'owner', 'manager'].includes(role);
  const [period, setPeriod] = useState('month');

  const { data: summary, loading: summaryLoading } = useApi(() => dashboardApi.getSummary());
  const { data: revenue, loading: revenueLoading } = useApi(
    () => dashboardApi.getRevenue(period),
    [period]
  );
  const { data: lowStock } = useApi(() => dashboardApi.getLowStock());

  const s = summary || {};
  const r = revenue || {};

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* ─── Premium Header ─── */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-primary opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isAdmin ? 'Executive Overview' : `Welcome back, ${user?.name || 'Staff'}!`}
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            {isAdmin ? 'Financial health, obligations, and operations at a glance.' : 'Here is what is happening in your department today.'}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-slate-800/50 p-1 rounded-xl backdrop-blur-md border border-slate-700">
              {['today', 'week', 'month'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    period === p
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-light text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_15px_rgba(var(--brand-accent),0.5)]"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        )}
      </div>

      {/* ─── Core Financials (Admin Only) ─── */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumStatCard
            title={`Revenue (${period})`}
            value={revenueLoading ? '...' : formatCurrency(r.total || 0)}
            subtitle="Money earned from all sources"
            icon={TrendingUp}
          />
          <PremiumStatCard
            title="What We Owe (Payroll)"
            value={summaryLoading ? '...' : formatCurrency(s.pending_payroll || 0)}
            subtitle="Pending staff salaries"
            icon={Receipt}
            isOwed={true}
          />
          <PremiumStatCard
            title="Owed To Us (Invoices)"
            value={summaryLoading ? '...' : formatCurrency(s.pending_invoices || 0)}
            subtitle="Unpaid member/client invoices"
            icon={Building}
          />
        </div>
      )}

      {/* ─── Operational Action Center ─── */}
      {(isAdmin || role === 'front_desk' || role === 'shop_staff' || role === 'bar_staff') && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-primary" /> Action Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(isAdmin || role === 'front_desk') && (
              <>
                <ActionCard 
                  title="Today's Bookings" 
                  value={summaryLoading ? '-' : `${s.today_bookings || 0} Courts`} 
                  icon={CalendarDays} 
                  colorClass="bg-sky-100 text-sky-700"
                />
                <ActionCard 
                  title="Pending Leave" 
                  value={summaryLoading ? '-' : `${s.pending_leave || 0} Requests`} 
                  icon={Users} 
                  colorClass="bg-amber-100 text-amber-700"
                  urgency={(s.pending_leave || 0) > 0}
                />
              </>
            )}
            
            {(isAdmin || role === 'shop_staff') && (
              <ActionCard 
                title="Low Stock Items" 
                value={summaryLoading ? '-' : `${s.low_stock_count || 0} Products`} 
                icon={Package} 
                colorClass="bg-rose-100 text-rose-700"
                urgency={(s.low_stock_count || 0) > 0}
              />
            )}
            
            {(isAdmin || role === 'bar_staff' || role === 'kitchen_staff') && (
              <ActionCard 
                title="Open Bar Tabs" 
                value={summaryLoading ? '-' : `${s.open_tabs || 0} Tabs`} 
                icon={Beer} 
                colorClass="bg-indigo-100 text-indigo-700"
              />
            )}
          </div>
        </div>
      )}

      {/* ─── Revenue Deep Dive (Admin Only) ─── */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Source Breakdown */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Where did we earn it?</h2>
            {revenueLoading ? (
              <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="h-2 bg-slate-200 rounded"></div></div></div>
            ) : (
              <div className="space-y-6">
                {[
                  { key: 'court', icon: CalendarDays, color: 'bg-sky-500' },
                  { key: 'shop', icon: Store, color: 'bg-emerald-500' },
                  { key: 'bar', icon: Beer, color: 'bg-amber-500' },
                  { key: 'invoice', icon: FileText, color: 'bg-indigo-500' },
                ].map(({ key, icon: Icon, color }) => {
                  const amount = r.by_source?.[key] || 0;
                  const pct = r.total > 0 ? (amount / r.total) * 100 : 0;
                  return (
                    <div key={key} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                          <span className="text-sm font-semibold text-slate-700 capitalize">{key}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(amount)}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${Math.max(pct, 2)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Method Breakdown */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent opacity-10 rounded-full blur-3xl pointer-events-none"></div>
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-accent" /> How did they pay?
            </h2>
            
            {revenueLoading ? (
               <div className="text-slate-500 text-sm">Loading data...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {['card', 'cash', 'upi', 'bank_transfer'].map(method => {
                  const amount = r.by_method?.[method] || 0;
                  if (amount === 0) return null;
                  return (
                    <div key={method} className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-700">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                        {method.replace('_', ' ')}
                      </p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(amount)}</p>
                    </div>
                  );
                })}
                {(!r.by_method || Object.keys(r.by_method).length === 0) && (
                  <div className="col-span-2 text-slate-500 text-sm bg-slate-800/50 rounded-xl p-4 text-center">
                    No payments recorded in this period.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
