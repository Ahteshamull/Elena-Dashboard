import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, ShieldCheck, Bell, Menu, X, 
  LayoutDashboard, UserCheck, Users, User, 
  Calendar, CreditCard, Settings 
} from 'lucide-react';
import { useGetNotificationsQuery } from '../../redux/api/notificationApiSlice';

export default function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthPage = location.pathname.startsWith('/auth');
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'chef-requests', label: 'Chef Requests', icon: UserCheck, path: '/admin/chef-requests' },
    { id: 'manage-chefs', label: 'Manage Chefs', icon: Users, path: '/admin/chefs' },
    { id: 'manage-users', label: 'Manage Users', icon: User, path: '/admin/users' },
    { id: 'bookings', label: 'All Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'payouts', label: 'Payouts', icon: CreditCard, path: '/admin/payouts' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || user.userName || 'System Administrator';
  
  const { data: notificationsData } = useGetNotificationsQuery(undefined, { skip: isAuthPage });
  const unreadCount = notificationsData?.data?.filter(n => !n.isRead).length || 0;

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
            <span className="text-sm font-bold text-primary-900">{userName}</span>
          </div>

          <Link 
            to="/admin/notifications"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-400 hover:text-primary-900 hover:bg-primary-50 transition-all border border-gray-100 group shadow-sm"
            title="Notifications"
          >
            <Bell size={18} className="group-hover:scale-110 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </Link>
          
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 group shadow-sm"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-primary-900 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-20 left-0 right-0 bottom-0 bg-white z-40 transition-transform duration-300 ease-in-out overflow-y-auto ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-2">
          {menuItems.map((item) => {
            const isActive = item.path === '/admin' 
              ? location.pathname === '/admin' || location.pathname === '/admin/'
              : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-primary-50 text-primary-900 font-bold" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} className={isActive ? "text-accent" : ""} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <div className="h-px bg-gray-100 my-4" />
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
