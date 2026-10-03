import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(verifySupabaseToken);

const isAdminOrOwner = (user) => ['admin', 'owner'].includes(user.role);

// GET /api/v1/leave
router.get('/', async (req, res) => {
  try {
    const { staff_id, status } = req.query;
    
    let query = supabase.from('leave_requests').select('*');

    if (!isAdminOrOwner(req.user)) {
      query = query.eq('staff_id', req.user.id);
    } else if (staff_id) {
      query = query.eq('staff_id', staff_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: leaves, error } = await query;
    if (error) throw error;

    return res.json({ success: true, data: leaves || [] });
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/v1/leave/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let query = supabase.from('leave_requests').select('*').eq('id', id);
    
    if (!isAdminOrOwner(req.user)) {
      query = query.eq('staff_id', req.user.id);
    }
    
    const { data: leave, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ success: false, message: 'Leave request not found' });
      throw error;
    }

    return res.json({ success: true, data: leave });
  } catch (error) {
    console.error('Error fetching leave request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /api/v1/leave (Any authenticated staff can request leave)
router.post('/', async (req, res) => {
  try {
    const { start_date, end_date, reason } = req.body;
    let staff_id = req.body.staff_id;

    // Regular staff can only request for themselves
    if (!isAdminOrOwner(req.user)) {
      staff_id = req.user.id;
    } else if (!staff_id) {
      staff_id = req.user.id; // fallback to self if admin doesn't provide one
    }

    if (!start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Missing required fields: start_date, end_date' });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ success: false, message: 'start_date cannot be after end_date' });
    }

    const newRequest = {
      staff_id,
      start_date,
      end_date,
      reason,
      status: 'pending' // always pending initially
    };

    const { data, error } = await supabase
      .from('leave_requests')
      .insert(newRequest)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating leave request:', error);
    if (error.code === '23503') return res.status(400).json({ success: false, message: 'Invalid staff ID' });
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// PATCH /api/v1/leave/:id (Admins approve/reject, or user updates their own pending request)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First find the request
    const { data: existing, error: findError } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ success: false, message: 'Leave request not found' });
      throw findError;
    }

    const isOwner = req.user.id === existing.staff_id;
    if (!isAdminOrOwner(req.user) && !isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updates = {};
    const { start_date, end_date, reason, status } = req.body;

    // If changing dates/reason, only allow if pending
    if (start_date || end_date || reason !== undefined) {
       if (existing.status !== 'pending' && !isAdminOrOwner(req.user)) {
         return res.status(400).json({ success: false, message: 'Cannot modify a processed leave request' });
       }
       if (start_date) updates.start_date = start_date;
       if (end_date) updates.end_date = end_date;
       if (reason !== undefined) updates.reason = reason;
       
       if (updates.start_date && updates.end_date && new Date(updates.start_date) > new Date(updates.end_date)) {
         return res.status(400).json({ success: false, message: 'start_date cannot be after end_date' });
       }
    }

    // Status can only be changed by admin/owner
    if (status && status !== existing.status) {
      if (!isAdminOrOwner(req.user)) {
        return res.status(403).json({ success: false, message: 'Only admins/owners can approve or reject leave' });
      }
      
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      
      updates.status = status;
      if (status === 'approved' || status === 'rejected') {
        updates.approved_by = req.user.id;
      } else {
        updates.approved_by = null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('leave_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating leave request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// DELETE /api/v1/leave/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: existing, error: findError } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', id)
      .single();
      
    if (findError) {
      if (findError.code === 'PGRST116') return res.status(404).json({ success: false, message: 'Leave request not found' });
      throw findError;
    }

    const isOwner = req.user.id === existing.staff_id;
    if (!isAdminOrOwner(req.user) && !isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!isAdminOrOwner(req.user) && existing.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot delete a processed leave request' });
    }

    const { error } = await supabase.from('leave_requests').delete().eq('id', id);
    if (error) throw error;

    return res.json({ success: true, message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
