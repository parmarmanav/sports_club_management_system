import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const ROLES = [
  { value: 'owner', label: 'Owner', desc: 'Full access to everything' },
  { value: 'admin', label: 'Admin', desc: 'Full access including payroll & invoices' },
  { value: 'manager', label: 'Manager', desc: 'Staff, members, bookings, leads, dashboard' },
  { value: 'front_desk', label: 'Front Desk', desc: 'Members, bookings, shop POS, leads' },
  { value: 'bar_staff', label: 'Bar Staff', desc: 'Bar orders, tabs, tables' },
  { value: 'kitchen_staff', label: 'Kitchen Staff', desc: 'Kitchen display only' },
  { value: 'shop_staff', label: 'Shop Staff', desc: 'Products, inventory, shop orders' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const { loginWithDevRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    loginWithDevRole(selectedRole);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary mx-auto flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Champions Club</h1>
          <p className="text-brand-muted text-sm mt-1">Staff Portal — Development Login</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-6">
          <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">Dev-mode auth — select a role to sign in without credentials.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-slate-700 mb-3">Select Role</label>
            <div className="space-y-2 mb-6">
              {ROLES.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                    selectedRole === role.value
                      ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent/20'
                      : 'border-brand-border hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedRole === role.value ? 'border-brand-accent' : 'border-slate-300'
                  }`}>
                    {selectedRole === role.value && (
                      <div className="w-2 h-2 rounded-full bg-brand-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{role.label}</p>
                    <p className="text-xs text-brand-muted">{role.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={!selectedRole}
              className="w-full py-2.5 px-4 bg-brand-accent text-white rounded-xl text-sm font-medium hover:bg-brand-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sign in as {selectedRole ? ROLES.find(r => r.value === selectedRole)?.label : '...'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-muted mt-6">
          This login is for development only. Production will use Supabase JWT auth.
        </p>
      </div>
    </div>
  );
}
