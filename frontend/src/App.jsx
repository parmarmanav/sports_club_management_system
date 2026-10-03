import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Courts from './pages/courts/Courts';
import CourtDetails from './pages/courts/CourtDetails';
import BookCourt from './pages/courts/BookCourt';
import MemberBookings from './pages/member/Bookings';

const MemberDashboard = () => <div className="p-8">Member Dashboard Placeholder</div>;
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
