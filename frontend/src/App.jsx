import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import FacilitiesPage from './pages/public/FacilitiesPage';
import GalleryPage from './pages/public/GalleryPage';
import ContactPage from './pages/public/ContactPage';
import PlansPage from './pages/public/PlansPage';
import CourtsPublicPage from './pages/public/CourtsPublicPage';
import ShopPublicPage from './pages/public/ShopPublicPage';
import BarPublicPage from './pages/public/BarPublicPage';
import CheckoutPage from './pages/public/CheckoutPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import MembersPage from './pages/admin/MembersPage';
import NewMemberPage from './pages/admin/NewMemberPage';
import MemberProfilePage from './pages/admin/MemberProfilePage';
import LeadsPage from './pages/admin/LeadsPage';
import BookingsPage from './pages/admin/BookingsPage';
import NewBookingPage from './pages/admin/NewBookingPage';
import ShopPOSPage from './pages/admin/ShopPOSPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import BarPage from './pages/admin/BarPage';
import KitchenPage from './pages/admin/KitchenPage';
import StaffPage from './pages/admin/StaffPage';
import ShiftsPage from './pages/admin/ShiftsPage';
import LeavePage from './pages/admin/LeavePage';
import PayrollPage from './pages/admin/PayrollPage';
import InvoicesPage from './pages/admin/InvoicesPage';
import ReportsPage from './pages/admin/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ─── Auth ─── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ─── Public Routes ─── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/courts" element={<CourtsPublicPage />} />
            <Route path="/shop" element={<ShopPublicPage />} />
            <Route path="/bar" element={<BarPublicPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
            <Route path="members/:id" element={<MemberProfilePage />} />
            <Route path="leads" element={<LeadsPage />} />

            {/* Operations */}
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/new" element={<NewBookingPage />} />
            <Route path="shop" element={<ShopPOSPage />} />
            <Route path="shop/products" element={<ProductsPage />} />
            <Route path="shop/orders" element={<OrdersPage />} />

            {/* Bar & Dining */}
            <Route path="bar" element={<BarPage />} />
            <Route path="bar/kitchen" element={<KitchenPage />} />

            {/* HR & Staff */}
            <Route path="staff" element={<StaffPage />} />
            <Route path="staff/shifts" element={<ShiftsPage />} />
            <Route path="staff/leave" element={<LeavePage />} />
            <Route path="staff/payroll" element={<PayrollPage />} />

            {/* Finance */}
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* ─── Fallback ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
