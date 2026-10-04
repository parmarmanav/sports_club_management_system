import express from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = express.Router();

// 1. Bar Menu Categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bar_menu_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching bar menu categories:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 2. Bar Menu Items
router.get('/menu', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bar_menu_items')
      .select(`
        *,
        bar_menu_categories (
          name
        )
      `)
      .eq('is_available', true)
      .order('name');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching bar menu:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 3. Bar Tables
router.get('/tables', async (req, res) => {
  try {
    // Fetch tables and their orders
    const { data: tables, error: tablesError } = await supabase
      .from('bar_tables')
      .select(`
        *,
        bar_orders (*)
      `)
      .order('table_number');

    if (tablesError) throw tablesError;

    // Process to include only the currently open order
    const formattedTables = tables.map(table => {
      // Find the open order for this table
      const openOrder = table.bar_orders ? table.bar_orders.find(o => o.status === 'open') : null;
      
      const { bar_orders, ...tableInfo } = table;
      return {
        ...tableInfo,
        current_order: openOrder || null
      };
    });

    res.json({ success: true, data: formattedTables });
  } catch (error) {
    console.error('Error fetching bar tables:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});
// 4. Open Bar Tab
router.post('/orders', verifySupabaseToken, async (req, res) => {
  try {
    const { table_id, member_id } = req.body;
    
    if (!table_id) {
      return res.status(400).json({ success: false, message: 'table_id is required' });
    }

    const { data: orderId, error } = await supabase.rpc('open_bar_tab', {
      p_table_id: table_id,
      p_member_id: req.user.type === 'staff' ? null : (member_id || null),
      p_staff_id: req.user.type === 'staff' ? req.user.id : null
    });

    if (error) {
      if (error.message.includes('TABLE_NOT_FOUND')) {
        return res.status(404).json({ success: false, message: 'Table not found' });
      }
      throw error;
    }

    res.status(201).json({ success: true, data: { order_id: orderId } });
  } catch (error) {
    console.error('Error opening bar tab:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 5. Add Item to Bar Order
router.post('/orders/:id/items', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_item_id, quantity = 1, notes } = req.body;

    if (!menu_item_id || quantity <= 0) {
      return res.status(400).json({ success: false, message: 'Valid menu_item_id and quantity > 0 are required' });
    }

    const { data: itemId, error } = await supabase.rpc('add_bar_item', {
      p_bar_order_id: id,
      p_menu_item_id: menu_item_id,
      p_quantity: quantity,
      p_notes: notes || null
    });

    if (error) {
      if (error.message.includes('BAR_ORDER_NOT_FOUND')) {
        return res.status(404).json({ success: false, message: 'Bar order not found' });
      }
      if (error.message.includes('BAR_ORDER_CLOSED')) {
        return res.status(400).json({ success: false, message: 'Bar order is already closed' });
      }
      if (error.message.includes('MENU_ITEM_NOT_AVAILABLE')) {
        return res.status(400).json({ success: false, message: 'Menu item not available' });
      }
      throw error;
    }

    res.status(201).json({ success: true, data: { item_id: itemId } });
  } catch (error) {
    console.error('Error adding item to bar order:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 6. Close Bar Tab & Pay
router.post('/orders/:id/close', verifySupabaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method } = req.body;

    if (!payment_method || !['cash', 'card', 'upi'].includes(payment_method)) {
      return res.status(400).json({ success: false, message: 'Valid payment method (cash, card, upi) is required' });
    }

    const { data: paymentId, error } = await supabase.rpc('close_bar_tab', {
      p_bar_order_id: id,
      p_payment_method: payment_method,
      p_staff_id: req.user.type === 'staff' ? req.user.id : null
    });

    if (error) {
      if (error.message.includes('BAR_ORDER_NOT_FOUND')) {
        return res.status(404).json({ success: false, message: 'Bar order not found' });
      }
      if (error.message.includes('BAR_ORDER_CLOSED')) {
        return res.status(400).json({ success: false, message: 'Bar order is already closed' });
      }
      throw error;
    }

    // Optionally fetch the final amount to return
    const { data: order } = await supabase
      .from('bar_orders')
      .select('total, status')
      .eq('id', id)
      .single();

    res.json({ 
      success: true, 
      data: { 
        order_id: id,
        payment_id: paymentId,
        status: order?.status || 'closed',
        total_amount: order?.total
      } 
    });
  } catch (error) {
    console.error('Error closing bar tab:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});
// 7. Kitchen Orders (KDS)
router.get('/kitchen', verifySupabaseToken, authorizeRoles('admin', 'manager', 'kitchen_staff', 'bar_staff', 'owner'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bar_order_items')
      .select(`
        *,
        bar_orders (
          table_id,
          bar_tables (
            table_number
          )
        ),
        bar_menu_items (
          name
        )
      `)
      .neq('kitchen_status', 'served')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching kitchen orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 8. Update Kitchen Status
router.patch('/kitchen/:item_id', verifySupabaseToken, authorizeRoles('admin', 'manager', 'kitchen_staff', 'bar_staff'), async (req, res) => {
  try {
    const { item_id } = req.params;
    const { kitchen_status } = req.body;

    const allowedStatuses = ['ordered', 'preparing', 'ready', 'served'];
    if (!kitchen_status || !allowedStatuses.includes(kitchen_status)) {
      return res.status(400).json({ success: false, message: 'Valid kitchen_status is required' });
    }

    const { data, error } = await supabase
      .from('bar_order_items')
      .update({ kitchen_status, updated_at: new Date().toISOString() })
      .eq('id', item_id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Order item not found' });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating kitchen status:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


router.get('/kitchen', async (req, res) => {
  const { data } = await supabase.from('bar_orders').select('*, members(full_name), staff(full_name)');
  res.json({ success: true, data: data || [] });
});

export default router;
