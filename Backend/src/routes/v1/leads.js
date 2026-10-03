import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

// 1. Create Lead / Book Trial (Public Endpoint - No Auth)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      full_name,
      phone,
      email,
      message,
      sport,
      preferred_date,
      preferred_time,
      source
    } = req.body;

    const actualName = full_name || name;

    if (!actualName || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name (or full_name), phone' });
    }

    // Format extra fields into message if provided, to avoid schema alterations
    let finalMessage = message || '';
    if (sport || preferred_date || preferred_time) {
      const extras = [];
      if (sport) extras.push(`Sport: ${sport}`);
      if (preferred_date) extras.push(`Date: ${preferred_date}`);
      if (preferred_time) extras.push(`Time: ${preferred_time}`);
      
      finalMessage = finalMessage 
        ? `${finalMessage}\n\nTrial Preferences:\n${extras.join('\n')}` 
        : `Trial Preferences:\n${extras.join('\n')}`;
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        full_name: actualName,
        phone,
        email,
        message: finalMessage || null,
        source: source || 'website',
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Staff-only middleware for the remaining routes
router.use(verifySupabaseToken);
router.use(authorizeRoles('owner', 'admin', 'manager', 'front_desk'));

// 2. Get Leads
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: leads, error } = await query;

    if (error) throw error;

    return res.json({ success: true, data: leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 3. Update Lead
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assigned_staff_id } = req.body;
    
    const updates = {};
    
    // Validate status against existing schema enum
    if (status) {
      const allowedStatuses = ['new', 'contacted', 'quoted', 'converted', 'lost'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
      }
      updates.status = status;
    }

    if (notes !== undefined) updates.notes = notes;
    if (assigned_staff_id !== undefined) updates.assigned_staff_id = assigned_staff_id;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    const { data: lead, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
       if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Lead not found' });
      }
      throw error;
    }

    return res.json({ success: true, data: lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 4. Convert Lead
router.post('/:id/convert', async (req, res) => {
  try {
    const { id } = req.params;
    const { plan_id, payment_method } = req.body;

    if (!plan_id) {
      return res.status(400).json({ success: false, message: 'Missing required field: plan_id' });
    }

    const { data, error } = await supabase.rpc('convert_lead', {
      p_lead_id: id,
      p_plan_id: plan_id,
      p_payment_method: payment_method || 'cash',
      p_staff_id: req.user.id
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.message, code: error.code });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error converting lead:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
