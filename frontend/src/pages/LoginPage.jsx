import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { Shield, User, Briefcase, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [loginType, setLoginType] = useState(null); // 'member', 'staff', or null
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if they are already logged in
  useEffect(() => {
    if (user) {
      if (user.type === 'staff') {
        navigate('/app/dashboard');
      } else {
        navigate('/'); // Redirect members to public home for now
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // AuthContext will automatically pick up the session and redirect them
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary mx-auto flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Champions Club</h1>
          <p className="text-brand-muted text-sm mt-1">Welcome back!</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-6 sm:p-8">
          
          {/* STATE 1: Choose Login Type */}
          {!loginType && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-slate-800 mb-6">How are you signing in?</h2>
              
              <button
                onClick={() => setLoginType('member')}
                className="w-full flex items-center gap-4 p-4 border border-brand-border rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Member Login</h3>
                  <p className="text-sm text-slate-500">I am a club member or customer</p>
                </div>
              </button>

              <button
                onClick={() => setLoginType('staff')}
                className="w-full flex items-center gap-4 p-4 border border-brand-border rounded-xl hover:border-brand-accent hover:bg-brand-accent/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Staff Login</h3>
                  <p className="text-sm text-slate-500">I am an employee or manager</p>
                </div>
              </button>
            </div>
          )}

          {/* STATE 2: Member Login (Google) */}
          {loginType === 'member' && (
            <div>
              <button 
                onClick={() => setLoginType(null)}
                className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
              
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Member Login</h2>
              <p className="text-sm text-slate-500 mb-6">Use your Google account to instantly access your club dashboard.</p>
              
              {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
              
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* STATE 3: Staff Login (Email/Password) */}
          {loginType === 'staff' && (
            <div>
              <button 
                onClick={() => setLoginType(null)}
                className="flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>

              <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">Staff portal access is restricted to authorized employees only.</p>
              </div>
              
              {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}

              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
                    placeholder="staff@championsclub.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-brand-accent text-white rounded-lg text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-50 transition-colors mt-2"
                >
                  {loading ? 'Signing in...' : 'Sign In to Staff Portal'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
