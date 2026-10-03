import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#004225] rounded flex items-center justify-center text-[#fcc201] font-bold text-xl">
                C
              </div>
              <span className="font-bold text-xl text-[#004225] tracking-wide">
                CHAMPIONS CLUB
              </span>
            </Link>
            
            <nav className="hidden md:flex gap-8">
              <Link to="/about" className="text-gray-600 hover:text-[#004225] font-medium transition-colors">Heritage</Link>
              <Link to="/facilities" className="text-gray-600 hover:text-[#004225] font-medium transition-colors">Facilities</Link>
              <Link to="/courts" className="text-gray-600 hover:text-[#004225] font-medium transition-colors">Courts</Link>
              <Link to="/shop" className="text-gray-600 hover:text-[#004225] font-medium transition-colors">Shop</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/contact" className="hidden md:block text-gray-600 hover:text-[#004225] font-medium transition-colors">
                Contact
              </Link>
              <Link 
                to="/login" 
                className="bg-[#004225] text-white px-5 py-2 rounded-md font-medium hover:bg-[#00301a] transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#004225] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-[#fcc201] text-xl font-bold mb-4">CHAMPIONS CLUB</h3>
            <p className="text-gray-300 max-w-sm">
              The premier destination for sports, leisure, and community. Experience world-class facilities and impeccable service.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:text-[#fcc201]">Heritage</Link></li>
              <li><Link to="/facilities" className="hover:text-[#fcc201]">Facilities</Link></li>
              <li><Link to="/contact" className="hover:text-[#fcc201]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="#" className="hover:text-[#fcc201]">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-[#fcc201]">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-[#fcc201]">Club Rules</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Champions Club. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
