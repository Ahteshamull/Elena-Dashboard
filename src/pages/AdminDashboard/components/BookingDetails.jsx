import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  ChefHat, 
  User, 
  MapPin, 
  Clock, 
  Users, 
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import useAdminStore from '../../../store/adminStore';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { platformBookings, updateBookingStatus } = useAdminStore();

  const booking = platformBookings.find(b => b.id === id);

  if (!booking) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif mb-4 text-primary-900">Booking not found</h2>
        <Button onClick={() => navigate('/admin/bookings')} variant="outline">Back to Bookings</Button>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Completed': return { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 };
      case 'Confirmed': return { color: 'text-blue-600 bg-blue-50', icon: CheckCircle2 };
      case 'Pending': return { color: 'text-amber-600 bg-amber-50', icon: Clock };
      case 'Cancelled': return { color: 'text-red-600 bg-red-50', icon: XCircle };
      default: return { color: 'text-gray-600 bg-gray-50', icon: AlertCircle };
    }
  };

  const statusInfo = getStatusInfo(booking.status);

  return (
    <div className="py-6 md:py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/bookings')}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-100"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{booking.id}</span>
              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", statusInfo.color)}>
                {booking.status}
              </span>
            </div>
            <h1 className="text-3xl font-serif text-primary-900">Booking Details</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {booking.status === 'Pending' && (
            <Button 
              onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
              className="bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
            >
              Confirm Booking
            </Button>
          )}
          {['Pending', 'Confirmed'].includes(booking.status) && (
            <Button 
              onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
              variant="outline"
              className="border-red-100 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience Info */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-bold text-primary-900">Experience Overview</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date & Time</p>
                      <p className="text-sm font-bold text-primary-900">{booking.date}</p>
                      <p className="text-xs text-gray-500">7:00 PM onwards</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Guests</p>
                      <p className="text-sm font-bold text-primary-900">{booking.people} People</p>
                      <p className="text-xs text-gray-500">Standard Dining Setup</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Location</p>
                      <p className="text-sm font-bold text-primary-900">Client's Residence</p>
                      <p className="text-xs text-gray-500">Manhattan, New York</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Payment</p>
                      <p className="text-sm font-bold text-emerald-600">{booking.amount}</p>
                      <p className="text-xs text-gray-500">Paid via Stripe (Credit Card)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-primary-900 mb-4">Notes & Requirements</h3>
              <div className="p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "Celebrating a 10th anniversary. We'd love a romantic setup. One guest has a mild shellfish allergy, please accommodate. Looking forward to the French Contemporary menu!"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Parties */}
        <div className="space-y-8">
          {/* Client Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-2 bg-primary-900" />
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Client</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-900 text-xl font-bold">
                  {booking.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary-900">{booking.userName}</h4>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest py-4 rounded-xl border-gray-100 hover:bg-gray-50 transition-all">
                Contact Client
              </Button>
            </CardContent>
          </Card>

          {/* Chef Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-2 bg-accent" />
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Chef</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-accent">
                  <ChefHat size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary-900">{booking.chefName}</h4>
                  <p className="text-xs text-gray-500">Top Rated Pro</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs font-black uppercase tracking-widest py-4 rounded-xl border-gray-100 hover:bg-gray-50 transition-all">
                Chef Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
