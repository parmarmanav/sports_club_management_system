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

    // 4. Find staff record first
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('email', user.email)
      .single();

    if (!staffError && staff) {
      req.user = { ...staff, type: 'staff' };
      return next();
    }

    // 5. If not staff, check if they are a member
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('email', user.email)
      .single();

    if (!memberError && member) {
      // Treat members as a 'member' role for authorization checks
      req.user = { ...member, type: 'member', role: 'member' };
      return next();
    }

    // If neither staff nor member
    return res.status(403).json({ success: false, message: 'Forbidden: User not found in system' });
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
