import { useState } from 'react';
import { Search, Package, ArrowRight } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { shopApi } from '../../api/shop';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function ShopPublicPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: productsData, loading } = useApi(() => shopApi.getProducts({ in_stock: true }));
  const products = productsData || [];
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, delta, maxStock) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = current + delta;
      if (next < 1) return prev;
      if (maxStock !== undefined && next > maxStock) return prev;
      return { ...prev, [id]: next };
    });
  };

  const handleBuyNow = (product) => {
    const qty = quantities[product.id] || 1;
    navigate('/checkout', {
      state: {
        type: 'shop',
        title: 'Shop Checkout',
        item: {
          product_id: product.id,
          name: product.name,
          desc: product.product_categories?.name || 'General Product',
          price: parseFloat(product.price),
          quantity: qty,
        }
      }
    });
  };

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
                <div key={p.id} className="bg-brand-surface rounded-2xl border border-brand-border p-5 hover:shadow-md transition-all hover:translate-y-[-2px] group flex flex-col h-full">
                  {p.image_url ? (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-brand-border/50">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand-accent/5 transition-colors">
                      <Package className="w-10 h-10 text-slate-300 group-hover:text-brand-accent/40 transition-colors" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 mb-1">{p.name}</p>
                    <p className="text-xs text-brand-muted mb-2">{p.product_categories?.name || 'General'}</p>
                  </div>
                  <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-brand-accent">{formatCurrency(p.price)}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock_qty > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {p.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  {user && p.stock_qty > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button onClick={() => handleQtyChange(p.id, -1, p.stock_qty)} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">-</button>
                        <span className="text-sm font-bold w-8 text-center">{quantities[p.id] || 1}</span>
                        <button onClick={() => handleQtyChange(p.id, 1, p.stock_qty)} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">+</button>
                      </div>
                      <button 
                        onClick={() => handleBuyNow(p)}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  )}
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
