import express from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = express.Router();

// 1. Product Categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 2. Products
router.get('/products', async (req, res) => {
  try {
    const { in_stock, category_id } = req.query;

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (in_stock === 'true') {
      query = query.gt('stock_qty', 0);
    }
    
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 3. Stock Adjustment
router.patch('/products/:id/stock', verifySupabaseToken, authorizeRoles('admin', 'manager', 'shop_staff', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || isNaN(quantity)) {
      return res.status(400).json({ success: false, message: 'Quantity must be a number' });
    }

    // Lock and update requires RPC or selecting then updating. 
    // Since we don't have a specific stock increment RPC, we'll read current stock and update.
    // Alternatively we can use a direct rpc, but let's do a simple read/write (though not perfectly atomic without RPC)
    // Actually, in Supabase, without an RPC, atomic increment can be tricky. Let's do read then write.
    
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock_qty')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newStock = product.stock_qty + quantity;
    if (newStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock quantity cannot be negative' });
    }

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ stock_qty: newStock, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
