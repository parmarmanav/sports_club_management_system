import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

// Get all plans (public or authenticated)
router.get('/', async (req, res) => {
  try {
    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get a single plan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: plan, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }
      throw error;
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// All following routes require authentication and admin/owner role
router.use(verifySupabaseToken);
router.use(authorizeRoles('owner', 'admin', 'manager'));

// Create a new plan
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      court_rate,
      shop_discount_pct,
      bar_discount_pct,
      daily_booking_limit,
      duration_months,
      price,
      is_junior,
      trial_rate
    } = req.body;

    const { data: plan, error } = await supabase
      .from('plans')
      .insert([{
        name,
        description,
        court_rate: court_rate || 0,
        shop_discount_pct: shop_discount_pct || 0,
        bar_discount_pct: bar_discount_pct || 0,
        daily_booking_limit: daily_booking_limit || 2,
        duration_months: duration_months || 12,
        price: price || 0,
        is_junior: is_junior || false,
        trial_rate: trial_rate || 0
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Update a plan
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.id;
    delete updates.created_at;

    const { data: plan, error } = await supabase
      .from('plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Delete a plan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
