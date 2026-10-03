import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import MembersPage from './pages/admin/MembersPage';
import NewMemberPage from './pages/admin/NewMemberPage';
import LeadsPage from './pages/admin/LeadsPage';
import BookingsPage from './pages/admin/BookingsPage';
import ShopPOSPage from './pages/admin/ShopPOSPage';
import BarPage from './pages/admin/BarPage';
import KitchenPage from './pages/admin/KitchenPage';

// Placeholder component for pages not yet built
const Placeholder = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] page-enter">
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-xl font-semibold text-slate-800 mb-1">{title}</h1>
      <p className="text-sm text-brand-muted">{subtitle || 'This page is coming soon.'}</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ─── Auth ─── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ─── Public Routes ─── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Placeholder title="Home" subtitle="Landing page coming soon" />} />
            <Route path="/about" element={<Placeholder title="About & Heritage" />} />
            <Route path="/facilities" element={<Placeholder title="Facilities" />} />
            <Route path="/courts" element={<Placeholder title="Court Availability" />} />
            <Route path="/shop" element={<Placeholder title="Shop Catalog" />} />
            <Route path="/gallery" element={<Placeholder title="Gallery" />} />
            <Route path="/plans" element={<Placeholder title="Membership Plans" />} />
            <Route path="/contact" element={<Placeholder title="Contact Us" />} />
          </Route>

          {/* ─── Staff & Admin Routes ─── */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* People */}
            <Route path="members" element={<MembersPage />} />
            <Route path="members/new" element={<NewMemberPage />} />
            <Route path="members/:id" element={<Placeholder title="Member Profile" />} />
            <Route path="leads" element={<LeadsPage />} />

            {/* Operations */}
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/new" element={<Placeholder title="New Booking" subtitle="Book a court" />} />
            <Route path="shop" element={<ShopPOSPage />} />
            <Route path="shop/products" element={<Placeholder title="Products" subtitle="Inventory management" />} />
            <Route path="shop/orders" element={<Placeholder title="Orders" subtitle="Order history" />} />

            {/* Bar & Dining */}
            <Route path="bar" element={<BarPage />} />
            <Route path="bar/kitchen" element={<KitchenPage />} />

            {/* HR & Staff */}
            <Route path="staff" element={<Placeholder title="Staff" subtitle="Employee roster" />} />
            <Route path="staff/shifts" element={<Placeholder title="Shifts" subtitle="Shift schedule" />} />
            <Route path="staff/leave" element={<Placeholder title="Leave" subtitle="Leave requests" />} />
            <Route path="staff/payroll" element={<Placeholder title="Payroll" subtitle="Salary management" />} />

            {/* Finance */}
            <Route path="invoices" element={<Placeholder title="Invoices" subtitle="Invoice management" />} />
            <Route path="invoices/:id" element={<Placeholder title="Invoice Detail" />} />
            <Route path="reports" element={<Placeholder title="Reports" subtitle="Revenue analytics" />} />
          </Route>

          {/* ─── Fallback ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
