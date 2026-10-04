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
    <div className="flex flex-col h-full bg-[#0E1116] font-sans selection:bg-brand-accent/30">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[#1F242C] shrink-0">
        <Link to="/" className="flex items-center gap-2.5 w-full" title="Back to main website">
          <div className="w-6 h-6 bg-[#EDEDED] flex items-center justify-center rounded-[4px]">
            <span className="text-[#0E1116] font-bold text-xs tracking-tight">CC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#EDEDED] leading-none tracking-tight">Champions Club</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {navigation.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="mt-5 mb-1.5 px-5">
                <span className="text-[11px] font-medium text-[#8A8F98]">{item.section}</span>
              </div>
            );
          }

          const isActive = location.pathname === item.href ||
            (item.href !== '/app/dashboard' && location.pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#1F242C] text-[#EDEDED]'
                  : 'text-[#8A8F98] hover:text-[#EDEDED]'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-2 border-t border-[#1F242C] shrink-0 mt-auto">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-[#1F242C] transition-colors group">
          <div className="w-6 h-6 rounded-full bg-[#2A303C] flex items-center justify-center text-[10px] font-semibold text-[#EDEDED]">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#EDEDED] truncate leading-tight">{user?.name || 'Staff'}</p>
            <p className="text-[10px] text-[#8A8F98] capitalize leading-none">{user?.role?.replace('_', ' ') || 'No role'}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
            className="text-[#8A8F98] opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-all p-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
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
