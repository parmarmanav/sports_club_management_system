import { useState } from 'react';
import { Beer, Plus, X, CreditCard, DollarSign } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { barApi } from '../../api/bar';
import { capitalize, formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';

// ─── Table Card ───
function TableCard({ table, onOpenTab, onSelectTab }) {
  const isOccupied = table.status === 'occupied';
  return (
    <button
      onClick={() => isOccupied ? onSelectTab(table) : onOpenTab(table)}
      className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
        isOccupied
          ? 'border-rose-200 bg-rose-50/50 hover:border-rose-300'
          : 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-bold text-slate-800">T{table.table_number}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          isOccupied ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {capitalize(table.status)}
        </span>
      </div>
      {isOccupied && table.current_order && (
        <p className="text-xs text-brand-muted">Tab: {formatCurrency(table.current_order.total)}</p>
      )}
      {!isOccupied && <p className="text-xs text-brand-muted">Tap to open tab</p>}
    </button>
  );
}

// ─── Add Item Modal ───
function AddItemModal({ open, orderId, onClose, onAdded }) {
  const { data: menuData } = useApi(() => barApi.getMenu());
  const menu = menuData || [];
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      await barApi.addItem(orderId, { menu_item_id: selectedItem, quantity: qty, notes: notes || undefined });
      onAdded();
      onClose();
      setSelectedItem('');
      setQty(1);
      setNotes('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Add Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleAdd} className="space-y-4">
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} required
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent">
            <option value="">Select menu item *</option>
            {menu.map(m => <option key={m.id} value={m.id}>{m.name} — {formatCurrency(m.price)}</option>)}
          </select>
          <div className="flex gap-3">
            <input type="number" min={1} value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className="w-24 px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            <input type="text" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Adding...' : 'Add to Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Bar Page ───
export default function BarPage() {
  const { data: tablesData, loading, refetch } = useApi(() => barApi.getTables());
  const tables = tablesData || [];
  const [activeTab, setActiveTab] = useState(null);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const handleOpenTab = async (table) => {
    try {
      await barApi.openTab({ table_id: table.id });
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCloseTab = async (orderId, paymentMethod) => {
    try {
      await barApi.closeTab(orderId, { payment_method: paymentMethod });
      setActiveTab(null);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5 page-enter">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Bar & Tables</h1>
        <p className="text-sm text-brand-muted">Manage tables, tabs, and orders</p>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm bg-white rounded-xl border border-brand-border">
          <Beer className="w-10 h-10 mb-3 text-slate-300" />
          <p>No tables configured yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {tables.map(t => (
            <TableCard key={t.id} table={t}
              onOpenTab={handleOpenTab}
              onSelectTab={(table) => setActiveTab(table)} />
          ))}
        </div>
      )}

      {/* Active tab panel */}
      {activeTab && activeTab.current_order && (
        <div className="bg-white rounded-xl border border-brand-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800">
              Table {activeTab.table_number} — Tab
            </h3>
            <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-2xl font-bold text-slate-800 mb-4">
            {formatCurrency(activeTab.current_order.total)}
          </p>

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setAddItemOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Item
            </button>
            {PAYMENT_METHODS.map(m => (
              <button key={m} onClick={() => handleCloseTab(activeTab.current_order.id, m)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <CreditCard className="w-4 h-4" /> Close ({capitalize(m)})
              </button>
            ))}
          </div>
        </div>
      )}

      <AddItemModal
        open={addItemOpen}
        orderId={activeTab?.current_order?.id}
        onClose={() => setAddItemOpen(false)}
        onAdded={refetch}
      />
    </div>
  );
}
