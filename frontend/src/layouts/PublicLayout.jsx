import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'About', href: '/about' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Courts', href: '/courts' },
    { name: 'Shop', href: '/shop' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* ─── Navbar ─── */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-brand-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] text-brand-primary leading-tight tracking-wide">
                  CHAMPIONS CLUB
                </span>
                <span className="text-[10px] text-brand-muted tracking-widest uppercase">
                  Premium Sports Club
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-brand-accent bg-brand-accent/5'
                      : 'text-slate-600 hover:text-brand-primary hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-brand-accent bg-brand-accent/5'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block mt-3 text-center bg-brand-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Content ─── */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-brand-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CC</span>
                </div>
                <span className="font-bold text-lg tracking-wide">CHAMPIONS CLUB</span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed text-sm">
                The premier destination for Tennis, Cricket, Badminton, and Padel. Experience world-class facilities, expert coaching, and an unmatched sporting community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Navigate</h4>
              <ul className="space-y-2.5">
                {[{ n: 'About Us', h: '/about' }, { n: 'Facilities', h: '/facilities' }, { n: 'Book Courts', h: '/courts' }, { n: 'Shop', h: '/shop' }, { n: 'Contact', h: '/contact' }].map(l => (
                  <li key={l.h}>
                    <Link to={l.h} className="text-slate-400 hover:text-brand-accent-light transition-colors text-sm">{l.n}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Contact</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>123 Sports Lane, City</li>
                <li>+91 98765 43210</li>
                <li>info@championsclub.com</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Champions Club. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link to="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-slate-300 transition-colors">Terms</Link>
              <Link to="#" className="hover:text-slate-300 transition-colors">Rules</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
