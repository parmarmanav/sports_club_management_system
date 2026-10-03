import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';

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
            <Route path="dashboard" element={<Placeholder title="Dashboard" subtitle="Summary & metrics" />} />

            {/* People */}
            <Route path="members" element={<Placeholder title="Members" subtitle="Member management" />} />
            <Route path="members/new" element={<Placeholder title="New Member" subtitle="Registration form" />} />
            <Route path="members/:id" element={<Placeholder title="Member Profile" />} />
            <Route path="leads" element={<Placeholder title="Leads" subtitle="Enquiry management" />} />

            {/* Operations */}
            <Route path="bookings" element={<Placeholder title="Bookings" subtitle="Court booking calendar" />} />
            <Route path="bookings/new" element={<Placeholder title="New Booking" subtitle="Book a court" />} />
            <Route path="shop" element={<Placeholder title="Shop POS" subtitle="Point of sale" />} />
            <Route path="shop/products" element={<Placeholder title="Products" subtitle="Inventory management" />} />
            <Route path="shop/orders" element={<Placeholder title="Orders" subtitle="Order history" />} />

            {/* Bar & Dining */}
            <Route path="bar" element={<Placeholder title="Bar" subtitle="Table & tab management" />} />
            <Route path="bar/kitchen" element={<Placeholder title="Kitchen Display" subtitle="KDS board" />} />

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
