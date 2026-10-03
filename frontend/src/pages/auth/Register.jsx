import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { api } from '../../api/client';

export default function Register() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Register member in Backend using backend API
    try {
      await api.post('/v1/members', {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      }, {
        headers: { 'X-Dev-Role': 'front_desk' } // Bypassing staff auth for frontend simulation
      });
      
      navigate('/login');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to complete registration profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg px-4 py-12 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-brand-dark mb-6 text-center">Join Champions Club</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-gold outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-medium py-2 rounded transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already a member? <Link to="/login" className="text-brand-dark font-medium hover:text-brand-gold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
