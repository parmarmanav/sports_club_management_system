import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

// All members routes require staff authentication and appropriate roles
router.use(verifySupabaseToken);
router.use(authorizeRoles('owner', 'admin', 'manager', 'front_desk'));

// 1. Get all members
router.get('/', async (req, res) => {
  try {
    const { search, status, plan } = req.query;

    let query = supabase.from('members').select(`
      *,
      plans ( id, name )
    `);

    if (status) {
      query = query.eq('status', status);
    }
    if (plan) {
      query = query.eq('plan_id', plan);
    }
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data: members, error } = await query;

    if (error) throw error;

    return res.json({ success: true, data: members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 2. Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: member, error } = await supabase
      .from('members')
      .select(`
        *,
        plans (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      throw error;
    }

    return res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 3. Register member
router.post('/', async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      date_of_birth,
      plan_id,
      client_type,
      address,
      payment_method
    } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields: full_name, phone' });
    }

    const { data, error } = await supabase.rpc('register_member', {
      p_full_name: full_name,
      p_phone: phone,
      p_email: email,
      p_date_of_birth: date_of_birth,
      p_plan_id: plan_id,
      p_client_type: client_type || 'individual',
      p_address: address,
      p_payment_method: payment_method || 'cash'
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.message, code: error.code });
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error registering member:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 4. Update member
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only allow updating specific fields
    const updates = {};
    const allowedFields = ['full_name', 'email', 'phone', 'date_of_birth', 'client_type', 'address', 'status', 'notes', 'photo_url'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }
    
    updates.updated_at = new Date().toISOString();

    const { data: member, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }
      throw error;
    }

    return res.json({ success: true, data: member });
  } catch (error) {
    console.error('Error updating member:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 5. Get member entitlements
router.get('/:id/entitlements', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.rpc('get_entitlements', {
      p_member_id: id
    });

    if (error) {
      if (error.message.includes('MEMBER_NOT_FOUND')) {
        return res.status(404).json({ success: false, message: 'Member not found', code: 'MEMBER_NOT_FOUND' });
      }
      throw error;
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching member entitlements:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
