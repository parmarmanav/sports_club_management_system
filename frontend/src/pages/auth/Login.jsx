import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    login(data.user, data.session.access_token);
    navigate('/member');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg px-4 py-12 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-brand-dark mb-6 text-center">Welcome Back</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none"
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-brand-dark hover:text-brand-gold">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark hover:bg-opacity-90 text-white font-medium py-2 rounded transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-brand-dark font-medium hover:text-brand-gold">Register now</Link>
        </p>
      </div>
    </div>
  );
}
