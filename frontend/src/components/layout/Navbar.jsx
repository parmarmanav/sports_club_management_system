import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-brand-dark text-white p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-brand-gold">Champions Club</Link>
      <div className="flex gap-4 items-center">
        <Link to="/courts" className="hover:text-brand-gold transition-colors">Courts</Link>
        {user ? (
          <>
            <Link to="/member" className="hover:text-brand-gold transition-colors">Dashboard</Link>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition-colors">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-brand-gold transition-colors">Login</Link>
            <Link to="/register" className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark px-4 py-2 rounded font-medium transition-colors">Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}
