import { useState } from 'react';
import { Search, Plus, Minus, ShoppingCart, X, Package } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { shopApi } from '../../api/shop';
import { formatCurrency, capitalize } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';

export default function ShopPOSPage() {
  const { data: productsData, loading } = useApi(() => shopApi.getProducts({ in_stock: true }));
  const products = productsData || [];
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart(prev => prev.map(i => {
      if (i.product_id !== productId) return i;
      const newQty = i.quantity + delta;
      return newQty <= 0 ? null : { ...i, quantity: newQty };
    }).filter(Boolean));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await shopApi.checkout({
        channel: 'in_store',
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
        payment_method: paymentMethod,
      });
      setCart([]);
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Shop POS</h1>
          <p className="text-sm text-brand-muted">Point of sale checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Product grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading products...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map(p => (
                <button key={p.id} onClick={() => addToCart(p)}
                  className="bg-white rounded-xl border border-brand-border p-4 text-left hover:shadow-md hover:border-brand-accent/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-brand-accent/10 transition-colors">
                    <Package className="w-5 h-5 text-slate-400 group-hover:text-brand-accent transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 mb-0.5 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-brand-muted mb-1">Stock: {p.stock_qty}</p>
                  <p className="text-sm font-bold text-brand-accent">{formatCurrency(p.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="bg-white rounded-xl border border-brand-border p-5 h-fit sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Cart</h3>
            <span className="ml-auto text-xs text-brand-muted">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-brand-muted text-center py-10">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 mb-5 max-h-[300px] overflow-y-auto scrollbar-thin">
                {cart.map(item => (
                  <div key={item.product_id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-brand-muted">{formatCurrency(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.product_id, -1)}
                        className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center hover:bg-slate-50">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product_id, 1)}
                        className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center hover:bg-slate-50">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-border pt-4 space-y-4">
                <div className="flex justify-between text-base font-bold text-slate-800">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>

                <div className="flex gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m} onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                        paymentMethod === m ? 'border-brand-accent bg-brand-accent/5 text-brand-accent' : 'border-brand-border text-slate-500'
                      }`}>{capitalize(m)}</button>
                  ))}
                </div>

                <button onClick={handleCheckout} disabled={submitting}
                  className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
                  {submitting ? 'Processing...' : `Checkout — ${formatCurrency(cartTotal)}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
