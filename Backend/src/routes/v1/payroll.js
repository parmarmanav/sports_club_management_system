import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(verifySupabaseToken);
router.use(authorizeRoles('admin', 'owner'));

router.post('/generate', async (req, res) => {
  try {
    const { month } = req.body;

    // 1. Validate Month
    if (!month || typeof month !== 'string') {
      return res.status(400).json({ success: false, message: 'Month is required and must be a string' });
    }

    const dateRegex = /^\d{4}-\d{2}-01$/; // Enforce first of the month YYYY-MM-01
    if (!dateRegex.test(month)) {
      return res.status(400).json({ success: false, message: 'Invalid month format. Expected YYYY-MM-01 (first day of the month)' });
    }

    const dateObj = new Date(month);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date value' });
    }

    // 2. Get Active Staff
    const { data: staffList, error: staffError } = await supabase
      .from('staff')
      .select('id, monthly_salary')
      .eq('is_active', true)
      .gt('monthly_salary', 0);

    if (staffError) throw staffError;

    if (!staffList || staffList.length === 0) {
      return res.status(404).json({ success: false, message: 'No eligible staff found for payroll generation' });
    }

    // 3. Construct Payroll Records
    const payrollRecords = staffList.map(staff => {
      const gross_salary = staff.monthly_salary;
      const deductions = 0; // As per instructions, no fake tax engine
      const net_salary = gross_salary - deductions;

      return {
        staff_id: staff.id,
        month,
        gross_salary,
        deductions,
        net_salary,
        status: 'pending'
      };
    });

    // 4 & 5. Bulk Insert with Duplicate Protection (uq_payroll_staff_month handles duplicates)
    const { data, error } = await supabase
      .from('payroll')
      .insert(payrollRecords)
      .select();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ success: false, message: 'Duplicate payroll generation. Payroll already exists for one or more staff members in this month.' });
      }
      throw error;
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error generating payroll:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});


router.get('/', async (req, res) => {
  const { data } = await supabase.from('payroll').select('*, staff(full_name)');
  res.json({ success: true, data: data || [] });
});

export default router;
