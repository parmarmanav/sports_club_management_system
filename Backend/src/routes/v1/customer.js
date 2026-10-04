import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken } from '../../middleware/auth.js';

const router = Router();

// All customer routes require authentication
router.use(verifySupabaseToken);

// Get available plans
router.get('/plans', async (req, res) => {
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

// Get current customer profile
router.get('/profile', async (req, res) => {
  try {
    if (req.user.type !== 'member') {
      return res.status(403).json({ success: false, message: 'Not a member' });
    }

    const { data: member, error } = await supabase
      .from('members')
      .select('*, plans(*)')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Buy / Upgrade Plan
router.post('/buy-plan', async (req, res) => {
  try {
    if (req.user.type !== 'member') {
      return res.status(403).json({ success: false, message: 'Only members can buy plans here' });
    }

    const { plan_id } = req.body;
    if (!plan_id) {
      return res.status(400).json({ success: false, message: 'plan_id is required' });
    }

    // 1. Get the plan to find duration and price
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    // 2. Calculate dates
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.duration_months);

    // 3. Update the member's plan and dates in DB
    const { data: updatedMember, error: updateError } = await supabase
      .from('members')
      .update({ 
        plan_id,
        membership_start: startDate.toISOString().split('T')[0],
        membership_expiry: expiryDate.toISOString().split('T')[0],
        status: 'active'
      })
      .eq('id', req.user.id)
      .select('*, plans(*)')
      .single();

    if (updateError) throw updateError;

    // 4. Record payment (assuming standard method, e.g. 'card')
    await supabase.rpc('record_payment', {
      p_source: 'membership',
      p_reference_id: req.user.id,
      p_amount: plan.price,
      p_method: 'card',
      p_member_id: req.user.id,
      p_notes: `Online plan purchase: ${plan.name}`
    });

    res.json({
      success: true,
      message: 'Plan purchased successfully',
      data: updatedMember
    });
  } catch (error) {
    console.error('Error buying plan:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
