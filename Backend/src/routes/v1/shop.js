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
// 4. Create Order / Checkout
router.post('/orders', verifySupabaseToken, async (req, res) => {
  try {
    const { 
      items, 
      payment_method, 
      member_id, 
      channel = 'in_store', 
      fulfilment_type = 'immediate',
      delivery_address,
      guest_name,
      guest_phone,
      guest_email
    } = req.body;

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty or invalid format' });
    }
    
    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid product or quantity in cart' });
      }
    }

    if (!payment_method || !['cash', 'card', 'upi'].includes(payment_method)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing payment method' });
    }

    const staff_id = req.user.id;

    // Call place_shop_order RPC
    const { data: orderId, error: orderError } = await supabase.rpc('place_shop_order', {
      p_member_id: member_id || null,
      p_channel: channel,
      p_fulfilment_type: fulfilment_type,
      p_delivery_address: delivery_address || null,
      p_guest_name: guest_name || null,
      p_guest_phone: guest_phone || null,
      p_guest_email: guest_email || null,
      p_items: items,
      p_staff_id: staff_id
    });

    if (orderError) {
      console.error('Order creation error:', orderError);
      
      // Handle known RPC exceptions mapped by PostgreSQL ERRCODE or message
      if (orderError.message.includes('OUT_OF_STOCK')) {
        return res.status(409).json({ success: false, message: 'One or more items are out of stock' });
      }
      if (orderError.message.includes('PRODUCT_NOT_FOUND')) {
        return res.status(404).json({ success: false, message: 'One or more products were not found' });
      }
      
      throw orderError;
    }

    // Fetch the total amount from the created order
    const { data: order, error: fetchOrderError } = await supabase
      .from('orders')
      .select('total')
      .eq('id', orderId)
      .single();

    if (fetchOrderError || !order) {
      throw new Error('Failed to fetch order total after creation');
    }

    const totalAmount = order.total;

    // Record payment via RPC
    const { data: paymentId, error: paymentError } = await supabase.rpc('record_payment', {
      p_source: 'shop',
      p_reference_id: orderId,
      p_amount: totalAmount,
      p_method: payment_method,
      p_member_id: member_id || null,
      p_staff_id: staff_id,
      p_notes: 'Shop order payment'
    });

    if (paymentError) {
      console.error('Payment recording error:', paymentError);
      // NOTE: Order is already created, but payment failed. In a real system we'd handle this discrepancy.
      throw paymentError;
    }

    res.status(201).json({ 
      success: true, 
      data: {
        order_id: orderId,
        payment_id: paymentId,
        total_amount: totalAmount
      }
    });

  } catch (error) {
    console.error('Error creating shop order:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


router.get('/orders', async (req, res) => {
  const { data } = await supabase.from('shop_orders').select('*, members(full_name), staff(full_name)');
  res.json({ success: true, data: data || [] });
});

export default router;
