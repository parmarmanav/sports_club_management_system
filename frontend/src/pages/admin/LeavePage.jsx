import { useState } from 'react';
import { FileText, Check, X as XIcon } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { leaveApi, staffApi } from '../../api/staff';
import { statusColor, capitalize, formatDate } from '../../utils/formatters';
import { LEAVE_STATUSES } from '../../utils/constants';

export default function LeavePage() {
  const [statusFilter, setStatusFilter] = useState('');
  const params = {};
  if (statusFilter) params.status = statusFilter;

  const { data, loading, refetch } = useApi(() => leaveApi.getAll(params), [statusFilter]);
  const requests = data || [];

  const handleAction = async (id, status) => {
    try {
      await leaveApi.update(id, { status });
      refetch();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Leave Requests</h1>
        <p className="text-sm text-brand-muted">Approve or reject staff leave</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...LEAVE_STATUSES].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              statusFilter === s ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500 hover:border-slate-300'
            }`}>{s ? capitalize(s) : 'All'}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <FileText className="w-10 h-10 mb-3 text-slate-300" /><p>No leave requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Staff</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Dates</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Reason</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{r.staff?.full_name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatDate(r.start_date)} → {formatDate(r.end_date)}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell max-w-[200px] truncate">{r.reason || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(r.status)}`}>
                        {capitalize(r.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {r.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleAction(r.id, 'approved')}
                            className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleAction(r.id, 'rejected')}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors" title="Reject">
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
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
