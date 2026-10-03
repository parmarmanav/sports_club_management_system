import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Store,
  ShoppingCart,
  Package,
  Beer,
  ChefHat,
  UserCog,
  Clock,
  FileText,
  BarChart3,
  LogOut,
  Receipt,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let navigation = [
    { section: 'Overview' },
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },

    { section: 'People' },
    { name: 'Members', href: '/app/members', icon: Users },
    { name: 'Leads', href: '/app/leads', icon: UserPlus },

    { section: 'Operations' },
    { name: 'Bookings', href: '/app/bookings', icon: CalendarDays },
    { name: 'Shop POS', href: '/app/shop', icon: Store },
    { name: 'Products', href: '/app/shop/products', icon: Package },
    { name: 'Orders', href: '/app/shop/orders', icon: ShoppingCart },

    { section: 'Bar & Dining' },
    { name: 'Bar', href: '/app/bar', icon: Beer },
    { name: 'Kitchen', href: '/app/bar/kitchen', icon: ChefHat },

    { section: 'HR & Staff' },
    { name: 'Staff', href: '/app/staff', icon: UserCog },
    { name: 'Shifts', href: '/app/staff/shifts', icon: Clock },
    { name: 'Leave', href: '/app/staff/leave', icon: FileText },
    { name: 'Payroll', href: '/app/staff/payroll', icon: Receipt },

    { section: 'Finance' },
    { name: 'Invoices', href: '/app/invoices', icon: FileText },
    { name: 'Reports', href: '/app/reports', icon: BarChart3 },
  ];

  if (user?.role === 'owner' || user?.role === 'admin') {
    navigation = [
      { section: 'Overview & Finance' },
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { name: 'Reports', href: '/app/reports', icon: BarChart3 },
      { name: 'Invoices', href: '/app/invoices', icon: FileText },
      { name: 'Payroll', href: '/app/staff/payroll', icon: Receipt },
      
      { section: 'Club Operations' },
      { name: 'Bookings', href: '/app/bookings', icon: CalendarDays },
      { name: 'Members', href: '/app/members', icon: Users },
      { name: 'Staff & Leave', href: '/app/staff/leave', icon: UserCog },
      
      { section: 'Sales & Dining' },
      { name: 'Shop POS', href: '/app/shop', icon: Store },
      { name: 'Orders', href: '/app/shop/orders', icon: ShoppingCart },
      { name: 'Bar', href: '/app/bar', icon: Beer },
      { name: 'Kitchen', href: '/app/bar/kitchen', icon: ChefHat },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06] shrink-0">
        <Link to="/app/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <span className="text-base font-semibold text-white tracking-wide">Champions Club</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3">
        {navigation.map((item, idx) => {
          if (item.section) {
            return (
              <p key={idx} className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-5 mb-2 px-3 first:mt-2">
                {item.section}
              </p>
            );
          }

          const isActive = location.pathname === item.href ||
            (item.href !== '/app/dashboard' && location.pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-brand-accent/15 text-brand-accent-light font-medium'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'Staff'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ') || 'No role'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-slate-400 hover:text-rose-400 hover:bg-white/[0.04] rounded-lg transition-all duration-150 text-sm"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-brand-surface">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="hidden lg:flex lg:w-60 bg-brand-sidebar flex-col border-r border-white/[0.06]">
        <SidebarContent />
      </div>

      {/* Sidebar — mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-sidebar flex flex-col transform transition-transform duration-200 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-brand-border flex items-center px-4 lg:px-8 shrink-0 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-[15px] font-semibold text-slate-700">
            {navigation.find(n => n.href && (location.pathname === n.href || location.pathname.startsWith(n.href + '/')))?.name || 'Dashboard'}
          </h2>
        </header>

        <main className="flex-1 p-4 lg:p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
