import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Mock components for pages
const MockPage = ({ title }) => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <h1 className="text-3xl font-bold text-gray-400">{title}</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<MockPage title="Home Page" />} />
          <Route path="/about" element={<MockPage title="About & Heritage" />} />
          <Route path="/facilities" element={<MockPage title="Facilities" />} />
          <Route path="/courts" element={<MockPage title="Court Availability" />} />
          <Route path="/shop" element={<MockPage title="Shop Catalog" />} />
          <Route path="/contact" element={<MockPage title="Contact Us" />} />
          <Route path="/login" element={<MockPage title="Login Form" />} />
        </Route>

        {/* Staff & Admin Routes */}
        <Route path="/app" element={<AdminLayout />}>
          <Route path="dashboard" element={<MockPage title="Dashboard" />} />
          <Route path="members" element={<MockPage title="Member Management" />} />
          <Route path="bookings" element={<MockPage title="Court Bookings" />} />
          <Route path="shop" element={<MockPage title="Shop POS" />} />
          <Route path="bar" element={<MockPage title="Bar & Kitchen" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
