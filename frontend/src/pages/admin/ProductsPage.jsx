import { useState } from 'react';
import { Plus, X, Package, Edit2, ArrowUpDown } from 'lucide-react';
import useApi from '../../hooks/useApi';
import { shopApi } from '../../api/shop';
import { formatCurrency } from '../../utils/formatters';

function ProductModal({ open, onClose, product, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    category_id: product?.category_id || '',
    price: product?.price || '',
    stock_qty: product?.stock_qty || '',
    low_stock_threshold: product?.low_stock_threshold || 5,
    image_url: product?.image_url || '',
  });
  const { data: categoriesData } = useApi(() => shopApi.getCategories());
  const categories = categoriesData || [];
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock_qty: parseInt(form.stock_qty), low_stock_threshold: parseInt(form.low_stock_threshold) };
      if (isEdit) await shopApi.updateProduct(product.id, payload);
      else await shopApi.createProduct(payload);
      onSaved();
      onClose();
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Product Name *" value={form.name}
            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <select value={form.category_id} onChange={(e) => setForm(p => ({ ...p, category_id: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent">
            <option value="">No Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" required placeholder="Price *" value={form.price} step="0.01"
              onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
              className="px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            <input type="number" required placeholder="Stock *" value={form.stock_qty}
              onChange={(e) => setForm(p => ({ ...p, stock_qty: e.target.value }))}
              className="px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            <input type="number" placeholder="Low Threshold" value={form.low_stock_threshold}
              onChange={(e) => setForm(p => ({ ...p, low_stock_threshold: e.target.value }))}
              className="px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
          </div>
          <input type="text" placeholder="Image URL (optional)" value={form.image_url}
            onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

function StockModal({ open, product, onClose, onSaved }) {
  const [adjustment, setAdjustment] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  if (!open || !product) return null;

  const handleAdjust = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await shopApi.adjustStock(product.id, parseInt(adjustment));
      onSaved();
      onClose();
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Adjust Stock</h2>
        <p className="text-sm text-brand-muted mb-4">{product.name} — Current: {product.stock_qty}</p>
        <form onSubmit={handleAdjust} className="space-y-4">
          <input type="number" value={adjustment} onChange={(e) => setAdjustment(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
            placeholder="+10 or -5" />
          <p className="text-center text-sm text-brand-muted">
            New stock: <span className="font-semibold text-slate-800">{product.stock_qty + parseInt(adjustment || 0)}</span>
          </p>
          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Adjusting...' : 'Adjust Stock'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { data, loading, refetch } = useApi(() => shopApi.getProducts());
  const products = data || [];
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [stockProduct, setStockProduct] = useState(null);

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-brand-muted">Inventory management</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-accent text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-accent/90 transition-colors">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-brand-muted text-sm">Loading...</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-brand-muted text-sm">
            <Package className="w-10 h-10 mb-3 text-slate-300" /><p>No products</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Stock</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-brand-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => {
                  const isLow = p.stock_qty <= p.low_stock_threshold;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{p.name}</td>
                      <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{p.product_categories?.name || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover inline-block mr-2" />
                        ) : (
                          <Package className="w-4 h-4 text-slate-300 inline-block mr-2" />
                        )}
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-medium ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                          {p.stock_qty}
                        </span>
                        {isLow && <span className="ml-1 text-xs text-rose-500">Low</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditProduct(p)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setStockProduct(p)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100" title="Adjust Stock">
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal open={createOpen || !!editProduct} product={editProduct} onClose={() => { setCreateOpen(false); setEditProduct(null); }} onSaved={refetch} />
      <StockModal open={!!stockProduct} product={stockProduct} onClose={() => setStockProduct(null)} onSaved={refetch} />
    </div>
  );
}
