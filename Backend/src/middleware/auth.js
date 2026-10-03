import { supabase } from '../config/supabase.js';

export const verifySupabaseToken = async (req, res, next) => {
  try {
    // Dev-Auth Shortcut (early development only)
    const devRole = req.headers['x-dev-role'];
    const devStaffId = req.headers['x-dev-staff-id'];

    if (devRole) {
      req.user = {
        id: devStaffId,
        role: devRole
      };
      return next();
    }

    // 1. Read Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify Supabase token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || !user.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 4. Find staff record
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('email', user.email)
      .single();

    if (staffError || !staff) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // 5. Attach staff record
    req.user = staff;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    next();
  };
};
