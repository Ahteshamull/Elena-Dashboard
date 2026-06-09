import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isAuthPage = location.pathname.startsWith('/auth');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  // Detect scroll for sticky background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthPage) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white shadow-sm border-b border-gray-100'
        : 'bg-white/90 backdrop-blur-sm border-b border-white/20'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/admin" className="flex items-center gap-3 z-50 relative group">
          <img src="/logo.png" alt="Tableli Logo" className="h-10 w-auto" />
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wider text-black uppercase">Tableli</span>
        </Link>

        {/* Admin Info */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100">
            <ShieldCheck size={16} className="text-accent" />
            <span className="text-sm font-bold text-primary-900">System Administrator</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 group shadow-sm"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
