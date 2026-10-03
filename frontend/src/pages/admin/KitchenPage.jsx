import { ChefHat, Clock, ArrowRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { barApi } from '../../api/bar';
import { KITCHEN_STATUSES } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';

const STATUS_COLS = {
  ordered: { label: 'Ordered', bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700' },
  preparing: { label: 'Preparing', bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700' },
  ready: { label: 'Ready', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
};

export default function KitchenPage() {
  const { data, loading, refetch } = useApi(() => barApi.getKitchen());
  const items = data || [];

  const moveToNext = async (item) => {
    const statusOrder = ['ordered', 'preparing', 'ready', 'served'];
    const currentIdx = statusOrder.indexOf(item.kitchen_status);
    if (currentIdx < 0 || currentIdx >= statusOrder.length - 1) return;
    const nextStatus = statusOrder[currentIdx + 1];
    try {
      await barApi.updateKitchenStatus(item.id, nextStatus);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  const getItemsByStatus = (status) => items.filter(i => i.kitchen_status === status);

  return (
    <div className="space-y-5 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Kitchen Display</h1>
          <p className="text-sm text-brand-muted">{items.length} active item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={refetch}
          className="text-sm text-brand-accent hover:text-brand-accent/80 font-medium transition-colors">
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading orders...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-brand-border text-brand-muted text-sm">
          <ChefHat className="w-10 h-10 mb-3 text-slate-300" />
          <p>No active kitchen orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(STATUS_COLS).map(([status, config]) => {
            const statusItems = getItemsByStatus(status);
            return (
              <div key={status} className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">{config.label}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                    {statusItems.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {statusItems.length === 0 ? (
                    <p className="text-xs text-brand-muted text-center py-8">No items</p>
                  ) : (
                    statusItems.map(item => (
                      <div key={item.id} className="bg-white rounded-lg border border-white/80 p-3 shadow-sm">
                        <div className="flex items-start justify-between mb-1.5">
                          <p className="font-medium text-sm text-slate-800">
                            {item.bar_menu_items?.name || 'Item'}
                          </p>
                          <span className="text-xs text-brand-muted whitespace-nowrap ml-2">
                            ×{item.quantity}
                          </span>
                        </div>
                        {item.bar_orders?.bar_tables?.table_number && (
                          <p className="text-xs text-brand-muted mb-2">
                            Table {item.bar_orders.bar_tables.table_number}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-slate-500 italic mb-2">"{item.notes}"</p>
                        )}
                        <button onClick={() => moveToNext(item)}
                          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-brand-accent hover:bg-brand-accent/5 rounded-md py-1.5 transition-colors">
                          {status === 'ready' ? 'Mark Served' : `Move to ${capitalize(KITCHEN_STATUSES[KITCHEN_STATUSES.indexOf(status) + 1])}`}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
