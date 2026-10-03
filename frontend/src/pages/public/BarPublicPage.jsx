import { useState } from 'react';
import { Search, Coffee, ArrowRight, ArrowLeft, Users } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { barApi } from '../../api/bar';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MOCK_TABLES = [
  { id: 't1', table_number: '1', status: 'available', capacity: 2 },
  { id: 't2', table_number: '2', status: 'occupied', capacity: 4 },
  { id: 't3', table_number: '3', status: 'available', capacity: 4 },
  { id: 't4', table_number: '4', status: 'occupied', capacity: 2 },
  { id: 't5', table_number: '5', status: 'available', capacity: 6 },
  { id: 't6', table_number: '6', status: 'available', capacity: 2 },
  { id: 't7', table_number: '7', status: 'occupied', capacity: 8 },
  { id: 't8', table_number: '8', status: 'available', capacity: 4 },
];

export default function BarPublicPage() {
  const { user } = useAuth();
  const { data: menuData, loading: menuLoading } = useApi(() => barApi.getMenu({ is_active: true }));
  const { data: tablesData, loading: tablesLoading } = useApi(() => barApi.getTables());
  
  const menu = menuData || [];
  const tables = (tablesData && tablesData.length > 0) ? tablesData : MOCK_TABLES;

  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);

  const filtered = menu.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter bg-brand-surface min-h-screen">
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/lounge.jpg')] opacity-10 bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Lounge & Bar</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {!selectedTable ? 'Select a Table' : `Table ${selectedTable.table_number} Menu`}
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            {!selectedTable 
              ? 'Choose an available table to begin your order.'
              : 'Explore our premium selection of beverages and dining options.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white relative -mt-10 rounded-t-3xl shadow-xl z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!selectedTable ? (
            /* ─── TABLES VIEW ─── */
            <div>
              {tablesLoading ? (
                <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading tables...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tables.map(table => {
                    const isAvailable = table.status === 'available';
                    return (
                      <button
                        key={table.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedTable(table)}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                          isAvailable 
                            ? 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
                            : 'border-slate-200 bg-slate-100/50 opacity-70 cursor-not-allowed'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                          <span className="text-2xl font-bold">{table.table_number}</span>
                        </div>
                        <div className="text-center">
                          <p className={`font-semibold ${isAvailable ? 'text-slate-800' : 'text-slate-500'}`}>
                            {isAvailable ? 'Available' : 'Occupied'}
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-400 font-medium">
                            <Users className="w-3 h-3" /> {table.capacity || 4} Seats
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ─── MENU VIEW ─── */
            <div className="page-enter">
              <button 
                onClick={() => setSelectedTable(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-accent mb-8 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Tables
              </button>

              <div className="max-w-md mx-auto mb-10 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input type="text" placeholder="Search menu..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent bg-slate-50" />
              </div>

              {menuLoading ? (
                <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading menu...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-brand-muted text-sm">
                  <Coffee className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p>No menu items found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filtered.map(item => (
                    <div key={item.id} className="bg-brand-surface rounded-2xl border border-brand-border p-5 hover:shadow-md transition-all hover:translate-y-[-2px] group">
                      <div className="w-full h-40 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand-accent/5 transition-colors">
                        <Coffee className="w-10 h-10 text-slate-300 group-hover:text-brand-accent/40 transition-colors" />
                      </div>
                      <p className="font-medium text-slate-800 mb-1">{item.name}</p>
                      <p className="text-xs text-brand-muted mb-2">{item.bar_categories?.name || 'Beverages'}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-brand-accent">{formatCurrency(item.price)}</span>
                        {user ? (
                           <button className="px-3 py-1.5 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-white rounded-lg text-xs font-bold transition-colors">
                             Add to Order
                           </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!user && (
                <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10 text-center sm:text-left">
                    <h4 className="text-xl font-bold text-white mb-2">Ready to order?</h4>
                    <p className="text-slate-400 text-sm">Sign in to place an order from the bar directly to your table.</p>
                  </div>
                  <Link to="/login" className="relative z-10 flex items-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                    Sign in to Order <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
