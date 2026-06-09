import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  User, 
  Calendar, 
  CreditCard, 
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../../utils/cn';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { id: 'chef-requests', label: 'Chef Requests', icon: UserCheck, path: '/admin/chef-requests' },
  { id: 'manage-chefs', label: 'Manage Chefs', icon: Users, path: '/admin/chefs' },
  { id: 'manage-users', label: 'Manage Users', icon: User, path: '/admin/users' },
  { id: 'bookings', label: 'All Bookings', icon: Calendar, path: '/admin/bookings' },
  { id: 'payouts', label: 'Payouts', icon: CreditCard, path: '/admin/payouts' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r border-gray-100 min-h-[calc(100vh-80px)] sticky top-20">
      <div className="px-6 py-6 border-b border-gray-50">
        <div className="flex items-center gap-2 text-primary-900">
          <ShieldCheck className="text-accent" size={24} />
          <span className="text-sm font-black uppercase tracking-[0.2em]">Admin Panel</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary-900 text-white shadow-lg" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={cn(isActive ? "text-accent" : "group-hover:text-accent")} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-accent" />}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl group">
          <LogOut size={18} className="group-hover:text-red-500" />
          <span className="text-sm font-bold">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
