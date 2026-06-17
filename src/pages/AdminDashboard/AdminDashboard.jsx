import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';
import AdminOverview from './components/AdminOverview';
import ChefVerification from './components/ChefVerification';
import ManageChefs from './components/ManageChefs';
import ManageUsers from './components/ManageUsers';
import UserBookingHistory from './components/UserBookingHistory';
import AllBookings from './components/AllBookings';
import BookingDetails from './components/BookingDetails';
import ManagePayouts from './components/ManagePayouts';
import AdminSettings from './components/AdminSettings';
import Notification from './components/Notification';

const AdminDashboard = () => {
  // In a real app, we would check for admin role here
  // const user = JSON.parse(localStorage.getItem('user') || '{}');
  // if (user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="flex bg-[#FAFAFA] min-h-screen pt-20">
      <AdminSidebar />

      <main className="flex-1 p-4 pb-24 md:pb-8 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="chef-requests" element={<ChefVerification />} />
            <Route path="chefs" element={<ManageChefs />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="users/:id/bookings" element={<UserBookingHistory />} />
            <Route path="bookings" element={<AllBookings />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route path="payouts" element={<ManagePayouts />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
