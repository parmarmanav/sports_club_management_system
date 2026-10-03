import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, ChevronRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { membersApi } from '../../api/members';
import { statusColor, capitalize, formatDate } from '../../utils/formatters';
import { MEMBER_STATUSES } from '../../utils/constants';

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const params = {};
  if (search) params.search = search;
  if (statusFilter) params.status = statusFilter;

  const { data, loading, error, refetch } = useApi(
    () => membersApi.getAll(params),
    [search, statusFilter]
  );

  const members = data || [];

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Members</h1>
          <p className="text-sm text-brand-muted">Manage club memberships</p>
        </div>
        <Link
          to="/app/members/new"
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Member
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
        >
          <option value="">All Statuses</option>
          {MEMBER_STATUSES.map((s) => (
            <option key={s} value={s}>{capitalize(s)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">
            <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mr-3" />
            Loading members...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-rose-500 text-sm gap-2">
            <p>Failed to load members</p>
            <button onClick={refetch} className="text-brand-accent hover:underline text-xs">Retry</button>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <p className="text-4xl mb-3">👤</p>
            <p>No members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden lg:table-cell">Plan</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden lg:table-cell">Expiry</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">
                          {m.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{m.full_name}</p>
                          {m.membership_code && (
                            <p className="text-xs text-brand-muted">{m.membership_code}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{m.phone}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">{m.plans?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600 hidden lg:table-cell">{formatDate(m.membership_expiry)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(m.status)}`}>
                        {capitalize(m.status)}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        to={`/app/members/${m.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-muted hover:text-brand-accent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
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
