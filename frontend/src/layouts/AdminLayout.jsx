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

  let navigation = [];

  const role = user?.role || 'member';

  if (role === 'owner' || role === 'admin' || role === 'manager') {
    navigation = [
      { section: 'Overview & Finance' },
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { name: 'Reports', href: '/app/reports', icon: BarChart3 },
      { name: 'Invoices', href: '/app/invoices', icon: FileText },
      { name: 'Payroll', href: '/app/staff/payroll', icon: Receipt },
      
      { section: 'Club Operations' },
      { name: 'Bookings', href: '/app/bookings', icon: CalendarDays },
      { name: 'Members', href: '/app/members', icon: Users },
      { name: 'Leads', href: '/app/leads', icon: UserPlus },
      { name: 'Staff & Leave', href: '/app/staff', icon: UserCog },
      
      { section: 'Sales & Dining' },
      { name: 'Shop POS', href: '/app/shop', icon: Store },
      { name: 'Shop Products', href: '/app/shop/products', icon: Package },
      { name: 'Shop Orders', href: '/app/shop/orders', icon: ShoppingCart },
      { name: 'Bar', href: '/app/bar', icon: Beer },
      { name: 'Kitchen', href: '/app/bar/kitchen', icon: ChefHat },
    ];
  } else if (role === 'front_desk') {
    navigation = [
      { section: 'Overview' },
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { section: 'Front Desk' },
      { name: 'Bookings', href: '/app/bookings', icon: CalendarDays },
      { name: 'Members', href: '/app/members', icon: Users },
      { name: 'Leads', href: '/app/leads', icon: UserPlus },
      { name: 'Invoices', href: '/app/invoices', icon: FileText },
    ];
  } else if (role === 'bar_staff' || role === 'kitchen_staff') {
    navigation = [
      { section: 'Overview' },
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { section: 'Bar & Dining' },
      { name: 'Bar Orders', href: '/app/bar', icon: Beer },
      { name: 'Kitchen', href: '/app/bar/kitchen', icon: ChefHat },
    ];
  } else if (role === 'shop_staff') {
    navigation = [
      { section: 'Overview' },
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { section: 'Pro Shop' },
      { name: 'Shop POS', href: '/app/shop', icon: Store },
      { name: 'Products', href: '/app/shop/products', icon: Package },
      { name: 'Orders', href: '/app/shop/orders', icon: ShoppingCart },
    ];
  } else {
    // Member or unknown
    navigation = [
      { section: 'My Account' },
      { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { name: 'My Bookings', href: '/app/bookings', icon: CalendarDays },
      { name: 'My Orders', href: '/app/shop/orders', icon: ShoppingCart },
      { name: 'Invoices', href: '/app/invoices', icon: FileText },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06] shrink-0 hover:bg-white/[0.02] transition-colors">
        <Link to="/" className="flex items-center gap-3" title="Back to main website">
          <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center shadow-lg shadow-brand-accent/20">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide uppercase leading-none mb-0.5">Champions Club</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase leading-none">Back to Site &rarr;</span>
          </div>
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
