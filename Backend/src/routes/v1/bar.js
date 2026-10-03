import express from 'express';
import { supabase } from '../../config/supabase.js';

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

export default router;
