import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(verifySupabaseToken);
router.use(authorizeRoles('admin', 'owner'));

router.get('/revenue', async (req, res) => {
  try {
    const { data, error } = await supabase.from('v_revenue_daily').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching revenue daily:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const { data, error } = await supabase.from('v_low_stock').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

router.get('/members-status', async (req, res) => {
  try {
    const { data, error } = await supabase.from('v_member_status').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching members status:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
