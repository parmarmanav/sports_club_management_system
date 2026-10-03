import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { membersApi } from '../../api/members';
import { formatCurrency, formatDate, statusColor, capitalize } from '../../utils/formatters';
import { useState } from 'react';

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <Icon className="w-4 h-4 text-brand-muted shrink-0" />
      <div>
        <p className="text-xs text-brand-muted">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function MemberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('entitlements');

  const { data: member, loading } = useApi(() => membersApi.getById(id), [id]);
  const { data: entitlements } = useApi(() => membersApi.getEntitlements(id), [id]);
  const { data: history } = useApi(() => membersApi.getHistory(id), [id]);

  const m = member || {};
  const ent = entitlements || {};
  const hist = history || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'entitlements', label: 'Entitlements' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'orders', label: 'Orders' },
    { key: 'payments', label: 'Payments' },
  ];

  return (
    <div className="space-y-5 page-enter">
      <button onClick={() => navigate('/app/members')} className="flex items-center gap-2 text-sm text-brand-muted hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400">
              {m.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{m.full_name}</h2>
              {m.membership_code && <p className="text-sm text-brand-muted">{m.membership_code}</p>}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${statusColor(m.status)}`}>
                {capitalize(m.status)}
              </span>
            </div>
          </div>

          <div className="space-y-1 border-t border-brand-border pt-4">
            <InfoRow icon={Phone} label="Phone" value={m.phone} />
            <InfoRow icon={Mail} label="Email" value={m.email} />
            <InfoRow icon={MapPin} label="Address" value={m.address} />
            <InfoRow icon={Calendar} label="DOB" value={formatDate(m.date_of_birth)} />
            <InfoRow icon={CreditCard} label="Plan" value={m.plans?.name} />
            <InfoRow icon={Calendar} label="Expires" value={formatDate(m.membership_expiry)} />
          </div>
        </div>

        {/* Tabs area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.key ? 'bg-white text-slate-800 shadow-sm' : 'text-brand-muted hover:text-slate-600'
                }`}>{t.label}</button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-brand-border p-5 min-h-[300px]">
            {activeTab === 'entitlements' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Current Entitlements</h3>
                {ent.court_rate != null && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-brand-muted">Court Rate</p>
                      <p className="text-sm font-semibold text-slate-800">{formatCurrency(ent.court_rate)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-brand-muted">Shop Discount</p>
                      <p className="text-sm font-semibold text-slate-800">{ent.shop_discount_pct}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-brand-muted">Bar Discount</p>
                      <p className="text-sm font-semibold text-slate-800">{ent.bar_discount_pct}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-brand-muted">Daily Booking Limit</p>
                      <p className="text-sm font-semibold text-slate-800">{ent.daily_booking_limit}</p>
                    </div>
                  </div>
                )}
                {!ent.court_rate && ent.court_rate !== 0 && <p className="text-sm text-brand-muted">No plan entitlements</p>}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Booking History</h3>
                {hist.bookings?.length > 0 ? (
                  <div className="space-y-2">
                    {hist.bookings.map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm text-slate-800">{formatDate(b.created_at)}</p>
                          <p className="text-xs text-brand-muted">{b.court_slots?.courts?.name || 'Court'}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(b.status)}`}>{capitalize(b.status)}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-brand-muted">No bookings yet</p>}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Order History</h3>
                {hist.orders?.length > 0 ? (
                  <div className="space-y-2">
                    {hist.orders.map((o, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <p className="text-sm text-slate-800">{formatDate(o.created_at)}</p>
                        <p className="text-sm font-medium text-slate-800">{formatCurrency(o.total)}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-brand-muted">No orders yet</p>}
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Payment History</h3>
                {hist.payments?.length > 0 ? (
                  <div className="space-y-2">
                    {hist.payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div>
                          <p className="text-sm text-slate-800">{formatDate(p.created_at)}</p>
                          <p className="text-xs text-brand-muted capitalize">{p.source} · {p.method}</p>
                        </div>
                        <p className="text-sm font-medium text-slate-800">{formatCurrency(p.amount)}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-brand-muted">No payments yet</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
