import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset instructions sent to your email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-bg px-4 py-12 animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-brand-dark mb-2 text-center">Reset Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Enter your email and we'll send you instructions to reset your password.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>}

        <form onSubmit={handleReset} className="space-y-4">
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark hover:bg-opacity-90 text-white font-medium py-2 rounded transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password? <Link to="/login" className="text-brand-dark font-medium hover:text-brand-gold">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
