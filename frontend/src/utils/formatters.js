/**
 * Format a number as Indian Rupees
 */
export function formatCurrency(amount) {
  if (amount == null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string to a readable date
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format an ISO timestamp to date + time
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a time string (HH:MM) for display
 */
export function formatTime(timeStr) {
  if (!timeStr) return '—';
  const d = new Date(`2000-01-01T${timeStr}`);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get status badge color class
 */
export function statusColor(status) {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-slate-100 text-slate-600 border-slate-200',
    expired: 'bg-amber-50 text-amber-700 border-amber-200',
    suspended: 'bg-rose-50 text-rose-700 border-rose-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    new: 'bg-sky-50 text-sky-700 border-sky-200',
    contacted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    lost: 'bg-slate-100 text-slate-500 border-slate-200',
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed: 'bg-slate-100 text-slate-600 border-slate-200',
    ready: 'bg-amber-50 text-amber-700 border-amber-200',
    preparing: 'bg-sky-50 text-sky-700 border-sky-200',
    ordered: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    served: 'bg-slate-100 text-slate-500 border-slate-200',
    fulfilled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    draft: 'bg-slate-100 text-slate-500 border-slate-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    occupied: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}
