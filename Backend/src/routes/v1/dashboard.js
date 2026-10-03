import { Router } from 'express';
import { supabase } from '../../config/supabase.js';
import { verifySupabaseToken, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

// Allow managers, admins, and owners to view dashboard
router.use(verifySupabaseToken);
router.use(authorizeRoles('manager', 'admin', 'owner'));

// ─── GET /api/v1/dashboard/summary ───
router.get('/summary', async (req, res) => {
  try {
    // 1. Members stats
    const { data: memberStatus } = await supabase.from('v_member_status').select('computed_status');
    const active_members = memberStatus?.filter(m => m.computed_status === 'active').length || 0;
    const expiring_soon = memberStatus?.filter(m => m.computed_status === 'expiring_soon').length || 0;

    // 2. Revenue for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const { data: revenueData } = await supabase
      .from('payments')
      .select('amount')
      .gte('created_at', startOfMonth.toISOString());
    const total_revenue_month = revenueData?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

    // 3. Low stock count
    const { data: lowStock } = await supabase.from('v_low_stock').select('*');
    const low_stock_count = lowStock?.length || 0;

    // 4. Open bar tabs
    const { data: openTabs } = await supabase.from('bar_orders').select('id').eq('status', 'open');
    const open_tabs = openTabs?.length || 0;

    // 5. Today's bookings
    const { data: todayBookings } = await supabase.from('v_today_bookings').select('booking_id');
    const today_bookings_count = todayBookings?.length || 0;

    // 6. What we owe (Pending Payroll)
    const { data: pendingPayrollData } = await supabase.from('payroll').select('net_salary').eq('status', 'pending');
    const pending_payroll = pendingPayrollData?.reduce((sum, p) => sum + Number(p.net_salary), 0) || 0;

    // 7. Unpaid Invoices (Money owed to us)
    const { data: unpaidInvoicesData } = await supabase.from('invoices').select('total').in('status', ['draft', 'sent', 'overdue']);
    const pending_invoices = unpaidInvoicesData?.reduce((sum, i) => sum + Number(i.total), 0) || 0;

    // 8. Pending Leave Requests
    const { data: pendingLeaveData } = await supabase.from('leave_requests').select('id').eq('status', 'pending');
    const pending_leave = pendingLeaveData?.length || 0;

    res.json({
      success: true,
      data: {
        active_members,
        expiring_soon,
        total_revenue_month,
        low_stock_count,
        open_tabs,
        today_bookings: today_bookings_count,
        pending_payroll,
        pending_invoices,
        pending_leave
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ─── GET /api/v1/dashboard/revenue ───
router.get('/revenue', async (req, res) => {
  try {
    const { period } = req.query; // 'today', 'week', 'month'
    
    // Determine the date filter
    const now = new Date();
    let startDate = new Date();
    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      // Default to 30 days
      startDate.setDate(now.getDate() - 30);
    }

    // Fetch raw payments for the period
    const { data: payments, error } = await supabase
      .from('payments')
      .select('amount, source, method, created_at')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Aggregate data
    let total = 0;
    const by_source = {};
    const by_method = {};
    
    (payments || []).forEach(p => {
      const amt = Number(p.amount);
      total += amt;
      
      by_source[p.source] = (by_source[p.source] || 0) + amt;
      by_method[p.method] = (by_method[p.method] || 0) + amt;
    });

    res.json({
      success: true,
      data: {
        total,
        by_source,
        by_method
      }
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ─── GET /api/v1/dashboard/low-stock ───
router.get('/low-stock', async (req, res) => {
  try {
    const { data, error } = await supabase.from('v_low_stock').select('*').limit(10);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ─── GET /api/v1/dashboard/members ───
router.get('/members', async (req, res) => {
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
