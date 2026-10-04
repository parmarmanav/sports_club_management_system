import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      // 1. Try to find them in the staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .single();

      console.log('DEBUG: authUser.email:', authUser.email);
      console.log('DEBUG: staffData:', staffData);
      console.log('DEBUG: staffError:', staffError);

      if (staffData) {
        // They are staff
        setUser({
          id: authUser.id,
          staffId: staffData.id,
          email: authUser.email,
          role: staffData.role,
          name: staffData.full_name,
          type: 'staff'
        });
        setLoading(false);
        return;
      }

      // 2. If not staff, they are a member (or a new user)
      const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('email', authUser.email)
        .single();

      setUser({
        id: authUser.id,
        memberId: memberData?.id || null, // Might be null if they just signed up via Google and aren't in the DB yet
        email: authUser.email,
        role: 'member',
        name: memberData?.full_name || authUser.user_metadata?.full_name || 'Member',
        type: 'member'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
