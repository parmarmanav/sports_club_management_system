import { useState } from 'react';
import { Search, Package, ArrowRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { shopApi } from '../../api/shop';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ShopPublicPage() {
  const { user } = useAuth();
  const { data: productsData, loading } = useApi(() => shopApi.getProducts({ in_stock: true }));
  const products = productsData || [];
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <section className="relative py-24 bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-accent-light font-medium text-sm tracking-widest uppercase mb-3">Pro Shop</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Shop</h1>
          <p className="text-slate-400 max-w-lg mx-auto">Browse our selection of equipment, apparel, and accessories.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-brand-muted text-sm">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map(p => (
                <div key={p.id} className="bg-brand-surface rounded-2xl border border-brand-border p-5 hover:shadow-md transition-all hover:translate-y-[-2px] group">
                  <div className="w-full h-40 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand-accent/5 transition-colors">
                    <Package className="w-10 h-10 text-slate-300 group-hover:text-brand-accent/40 transition-colors" />
                  </div>
                  <p className="font-medium text-slate-800 mb-1">{p.name}</p>
                  <p className="text-xs text-brand-muted mb-2">{p.product_categories?.name || 'General'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-accent">{formatCurrency(p.price)}</span>
                    <span className={`text-xs font-medium ${p.stock_qty > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {p.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!user && (
            <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 text-center sm:text-left">
                <h4 className="text-xl font-bold text-white mb-2">Ready to purchase?</h4>
                <p className="text-slate-400 text-sm">Sign in to buy items and manage your orders.</p>
              </div>
              <Link to="/login" className="relative z-10 flex items-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                Sign in to Purchase <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
