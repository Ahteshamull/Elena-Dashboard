import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  ChefHat, 
  DollarSign, 
  Users,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import useAdminStore from '../../../store/adminStore';

const UserBookingHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { platformBookings, activeUsers } = useAdminStore();

  const user = activeUsers.find(u => u.id === parseInt(id));
  const userBookings = platformBookings.filter(b => b.userId === parseInt(id));

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif mb-4">User not found</h2>
        <button onClick={() => navigate('/admin/users')} className="text-accent font-bold uppercase tracking-widest">Back to Users</button>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary-900">Booking History</h1>
          <p className="text-gray-500">Showing all experiences for <span className="font-bold text-primary-900">{user.name}</span></p>
        </div>
      </div>

      {/* User Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-primary-900">{userBookings.length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-primary-900">{user.spend}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Member Since</p>
            <p className="text-2xl font-bold text-primary-900">{user.joined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif text-primary-900 px-2">Experince Log</h3>
        
        {userBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center text-gray-400">
            No booking history found for this user.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {userBookings.map((booking) => (
              <Card key={booking.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Status Bar (colored edge) */}
                    <div className={cn(
                      "w-full md:w-1.5 h-1.5 md:h-auto",
                      booking.status === 'Completed' ? "bg-emerald-500" :
                      booking.status === 'Confirmed' ? "bg-blue-500" :
                      booking.status === 'Pending' ? "bg-amber-500" :
                      "bg-red-500"
                    )} />
                    
                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-900">
                          <ChefHat size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{booking.id}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                              booking.status === 'Completed' ? "bg-emerald-50 text-emerald-600" :
                              booking.status === 'Confirmed' ? "bg-blue-50 text-blue-600" :
                              booking.status === 'Pending' ? "bg-amber-50 text-amber-600" :
                              "bg-red-50 text-red-600"
                            )}>
                              {booking.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-primary-900">{booking.chefName}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:flex md:items-center gap-6 md:gap-10">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-primary-900">
                            <Calendar size={14} className="text-accent" />
                            {booking.date}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Guests</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-primary-900">
                            <Users size={14} className="text-accent" />
                            {booking.people} People
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Amount</span>
                          <div className="flex items-center gap-2 text-sm font-bold text-primary-900">
                            <DollarSign size={14} className="text-emerald-600" />
                            {booking.amount}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingHistory;
