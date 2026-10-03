import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

// Protect all staff management routes
router.use(verifySupabaseToken);
router.use(authorizeRoles('admin', 'owner'));

// GET /api/v1/staff
/**
 * @swagger
 * /api/v1/staff:
 *   get:
 *     summary: Retrieve a list of all staff members
 *     description: Returns a list of all staff members in the club. Requires admin or owner privileges.
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: A list of staff members.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       full_name:
 *                         type: string
 *                       role:
 *                         type: string
 */
router.get('/', async (req, res) => {
  try {
    const { data: staff, error } = await supabase
      .from('staff')
      .select('id, full_name, email, phone, role, monthly_salary, leave_balance, is_active, created_at, updated_at');
      
    if (error) throw error;
    return res.json({ success: true, data: staff || [] });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// GET /api/v1/staff/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: staffMember, error } = await supabase
      .from('staff')
      .select('id, full_name, email, phone, role, monthly_salary, leave_balance, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Staff member not found' });
      }
      throw error;
    }

    return res.json({ success: true, data: staffMember });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// POST /api/v1/staff
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, role, monthly_salary, leave_balance, is_active } = req.body;

    if (!full_name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields: full_name, email, role' });
    }

    const validRoles = ['admin', 'manager', 'front_desk', 'bar_staff', 'kitchen_staff', 'shop_staff', 'owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (monthly_salary !== undefined && monthly_salary < 0) {
      return res.status(400).json({ success: false, message: 'Invalid salary value' });
    }

    const newStaff = {
      full_name,
      email,
      phone,
      role,
      monthly_salary,
      leave_balance: leave_balance !== undefined ? leave_balance : 12,
      is_active: is_active !== undefined ? is_active : true
    };

    const { data, error } = await supabase
      .from('staff')
      .insert(newStaff)
      .select('id, full_name, email, phone, role, monthly_salary, leave_balance, is_active, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') { // unique violation
        return res.status(409).json({ success: false, message: 'Duplicate staff information' });
      }
      throw error;
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating staff:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// PATCH /api/v1/staff/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const updates = {};
    const allowedFields = ['full_name', 'email', 'phone', 'role', 'monthly_salary', 'leave_balance', 'is_active'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.role !== undefined) {
      const validRoles = ['admin', 'manager', 'front_desk', 'bar_staff', 'kitchen_staff', 'shop_staff', 'owner'];
      if (!validRoles.includes(updates.role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
    }

    if (updates.monthly_salary !== undefined && updates.monthly_salary < 0) {
      return res.status(400).json({ success: false, message: 'Invalid salary value' });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    const { data: staffMember, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select('id, full_name, email, phone, role, monthly_salary, leave_balance, is_active, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Staff member not found' });
      }
      if (error.code === '23505') { // unique violation
        return res.status(409).json({ success: false, message: 'Duplicate staff information' });
      }
      throw error;
    }

    return res.json({ success: true, data: staffMember });
  } catch (error) {
    console.error('Error updating staff:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// DELETE /api/v1/staff/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if exists first to return 404 properly if not found
    const { data: existing, error: findError } = await supabase
      .from('staff')
      .select('id')
      .eq('id', id)
      .single();
      
    if (findError) {
       if (findError.code === 'PGRST116') {
          return res.status(404).json({ success: false, message: 'Staff member not found' });
       }
       throw findError;
    }

    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return res.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

export default router;
