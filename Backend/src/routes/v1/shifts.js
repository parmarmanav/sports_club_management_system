import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

// Protect all shifts routes
router.use(verifySupabaseToken);

// Determine if user has admin privileges to view/edit all
const isAdminOrOwner = (user) => ['admin', 'owner'].includes(user.role);

// GET /api/v1/shifts
router.get('/', async (req, res) => {
  try {
    const { staff_id, shift_date } = req.query;
    
    let query = supabase.from('shifts').select('*');

    if (!isAdminOrOwner(req.user)) {
      // Regular staff can only see their own shifts
      query = query.eq('staff_id', req.user.id);
    } else if (staff_id) {
      query = query.eq('staff_id', staff_id);
    }

    if (shift_date) {
      query = query.eq('shift_date', shift_date);
    }

    const { data: shifts, error } = await query;
    if (error) throw error;

    return res.json({ success: true, data: shifts || [] });
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/v1/shifts/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query = supabase.from('shifts').select('*').eq('id', id);
    
    if (!isAdminOrOwner(req.user)) {
      query = query.eq('staff_id', req.user.id);
    }
    
    const { data: shift, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Shift not found' });
      }
      throw error;
    }

    return res.json({ success: true, data: shift });
  } catch (error) {
    console.error('Error fetching shift:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Admin/Owner only routes below for modifying shifts
// (Assuming standard practice where managers/admins schedule shifts, not staff themselves)
router.use(authorizeRoles('admin', 'owner'));

// POST /api/v1/shifts
router.post('/', async (req, res) => {
  try {
    const { staff_id, shift_date, start_time, end_time, notes } = req.body;

    if (!staff_id || !shift_date || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newShift = { staff_id, shift_date, start_time, end_time, notes };

    const { data, error } = await supabase
      .from('shifts')
      .insert(newShift)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating shift:', error);
    if (error.code === '23503') { // foreign key violation
      return res.status(400).json({ success: false, message: 'Invalid staff ID' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// PATCH /api/v1/shifts/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ['staff_id', 'shift_date', 'start_time', 'end_time', 'notes'];
    const updates = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    const { data, error } = await supabase
      .from('shifts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, message: 'Shift not found' });
      throw error;
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating shift:', error);
    if (error.code === '23503') { // foreign key violation
      return res.status(400).json({ success: false, message: 'Invalid staff ID' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// DELETE /api/v1/shifts/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: existing, error: findError } = await supabase
      .from('shifts')
      .select('id')
      .eq('id', id)
      .single();
      
    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ success: false, message: 'Shift not found' });
      throw findError;
    }

    const { error } = await supabase.from('shifts').delete().eq('id', id);
    if (error) throw error;

    return res.json({ success: true, message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
