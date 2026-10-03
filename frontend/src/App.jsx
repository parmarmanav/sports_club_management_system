import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Placeholder Pages
const Home = () => <div className="p-8">Home Page Placeholder</div>;
const Login = () => <div className="p-8">Login Page Placeholder</div>;
const Register = () => <div className="p-8">Register Page Placeholder</div>;
const ForgotPassword = () => <div className="p-8">Forgot Password Page Placeholder</div>;
const Courts = () => <div className="p-8">Courts Page Placeholder</div>;
const CourtDetails = () => <div className="p-8">Court Details Placeholder</div>;
const BookCourt = () => <div className="p-8">Book Court Placeholder</div>;

const MemberDashboard = () => <div className="p-8">Member Dashboard Placeholder</div>;
const MemberBookings = () => <div className="p-8">Member Bookings Placeholder</div>;
const MemberProfile = () => <div className="p-8">Member Profile Placeholder</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="courts" element={<Courts />} />
          <Route path="courts/:id" element={<CourtDetails />} />
          <Route path="book" element={<BookCourt />} />

          {/* Protected Member Routes */}
          <Route path="member" element={<ProtectedRoute />}>
            <Route index element={<MemberDashboard />} />
            <Route path="bookings" element={<MemberBookings />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
