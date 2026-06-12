import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChefHat, 
  User, 
  DollarSign, 
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Loader2
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import { Dropdown, DropdownItem } from '../../../components/ui/Dropdown';
import { 
  useGetAllBookingsQuery, 
  useUpdateBookingStatusMutation,
  useCapturePaymentMutation
} from '../../../redux/api/bookingApiSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { BookingDetailsModal } from './BookingDetailsModal';

const AllBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  const { data: apiResponse, isLoading } = useGetAllBookingsQuery();
  const [updateStatusMutation] = useUpdateBookingStatusMutation();
  const [capturePaymentMutation] = useCapturePaymentMutation();

  const handleUpdateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: 'Update Status?',
      text: `Are you sure you want to mark this booking as ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update it!'
    });

    if (result.isConfirmed) {
      try {
        await updateStatusMutation({ id, status: status.toLowerCase() }).unwrap();
        toast.success(`Booking marked as ${status}`);
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to update status');
      }
    }
  };

  const handleReleasePayment = async (paymentId) => {
    if (!paymentId) return toast.error("No payment ID associated with this booking");
    
    const result = await Swal.fire({
      title: 'Release Payment?',
      text: `Are you sure you want to release this payment to the chef?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, release it!'
    });

    if (result.isConfirmed) {
      try {
        await capturePaymentMutation(paymentId).unwrap();
        toast.success('Payment successfully released to the chef');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to release payment');
      }
    }
  };

  const rawBookings = apiResponse?.data || [];
  const platformBookings = rawBookings.map(b => ({
    id: b.bookingDetails?._id,
    userName: b.clientInfo?.userName || (b.bookingDetails?.firstName ? `${b.bookingDetails.firstName} ${b.bookingDetails.lastName}` : 'Unknown'),
    userEmail: b.bookingDetails?.email || b.clientInfo?.email || '',
    chefName: b.chefInfo?.profile?.fullName || b.chefInfo?.userName || 'Unknown Chef',
    date: b.bookingDetails?.eventDate ? new Date(b.bookingDetails.eventDate).toLocaleDateString() : 'N/A',
    people: b.bookingDetails?.numberOfGuests || 0,
    amount: `$${b.bookingDetails?.totalAmount || 0}`,
    status: b.bookingDetails?.status ? b.bookingDetails.status.charAt(0).toUpperCase() + b.bookingDetails.status.slice(1) : 'Pending',
    paymentStatus: b.bookingDetails?.paymentStatus || 'UNPAID',
    paymentId: b.bookingDetails?.paymentId || null,
    location: b.bookingDetails?.eventLocation || 'N/A'
  }));

  const filteredBookings = platformBookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (booking.id?.toLowerCase() || '').includes(searchLower) || 
                          (booking.userName?.toLowerCase() || '').includes(searchLower) ||
                          (booking.userEmail?.toLowerCase() || '').includes(searchLower) ||
                          (booking.chefName?.toLowerCase() || '').includes(searchLower);
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary-900" size={40} />
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600';
      case 'Confirmed': return 'bg-blue-50 text-blue-600';
      case 'Pending': return 'bg-amber-50 text-amber-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="py-6 md:py-10 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">All Bookings</h1>
          <p className="text-gray-500">Master log of all culinary experiences booked on Elena Tableli.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending</span>
            <span className="text-2xl font-bold text-amber-500">
              {platformBookings.filter(b => b.status === 'Pending').length}
            </span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Revenue (20%)</span>
            <span className="text-2xl font-bold text-primary-900">
              ${(platformBookings
                .filter(b => b.paymentStatus === 'SUCCESS' || b.paymentStatus === 'PAID')
                .reduce((acc, b) => acc + parseInt(b.amount.replace(/[^0-9]/g, '')), 0) * 0.20)
                .toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, User Name, Email, or Chef..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-gray-50 rounded-2xl border-none outline-none text-sm font-bold text-gray-600 focus:ring-2 focus:ring-accent/20 cursor-pointer appearance-none min-w-[140px]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="p-3 bg-primary-900 text-white rounded-2xl hover:bg-primary-800 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-3xl border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Location</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Client / Chef</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Date & People</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Amount</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Payment status</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-6 py-6 text-sm font-bold text-gray-400 max-w-[200px] truncate" title={booking.location}>{booking.location}</td>
                <td className="px-6 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={12} className="text-accent" />
                      <span className="text-sm font-bold text-primary-900">{booking.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChefHat size={12} className="text-accent" />
                      <span className="text-xs text-gray-500">{booking.chefName}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-sm font-bold text-primary-900">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{booking.people} Guests</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-bold text-primary-900">{booking.amount}</td>
                <td className="px-6 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    getStatusColor(booking.status)
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    booking.paymentStatus === 'SUCCESS' || booking.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                  )}>
                    {booking.paymentStatus}
                  </span>
                </td>

                {/* button */}
                <td className="px-6 py-6 text-right">
                  <Dropdown 
                    trigger={
                      <button className="p-2 text-gray-400 hover:text-primary-900 hover:bg-gray-100 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    }
                  >
                    <DropdownItem icon={Eye} onClick={() => setSelectedBookingId(booking.id)}>View Details</DropdownItem>
                    {/* {booking.status === 'Pending' && (
                      <DropdownItem icon={CheckCircle2} variant="success" onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}>
                        Confirm Booking
                      </DropdownItem>
                    )} */}
                    {booking.status === 'Confirmed' && (
                      <DropdownItem icon={CheckCircle2} variant="success" onClick={() => handleUpdateStatus(booking.id, 'Completed')}>
                        Mark Completed
                      </DropdownItem>
                    )}
                    {booking.paymentStatus === 'HOLD' && booking.paymentId && (
                      <DropdownItem icon={DollarSign} variant="success" onClick={() => handleReleasePayment(booking.paymentId)}>
                        Release Payment
                      </DropdownItem>
                    )}
                    {/* {['Pending', 'Confirmed'].includes(booking.status) && (
                      <DropdownItem icon={XCircle} variant="danger" onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}>
                        Cancel Booking
                      </DropdownItem>
                    )} */}
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block truncate max-w-[200px]" title={booking.location}>{booking.location}</span>
                  <h4 className="font-bold text-primary-900">{booking.chefName}</h4>
                  <p className="text-xs text-gray-500">for {booking.userName}</p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                  getStatusColor(booking.status)
                )}>
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</p>
                  <p className="text-sm font-bold text-primary-900">{booking.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                  <p className="text-sm font-bold text-emerald-600">{booking.amount}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedBookingId(booking.id)}
                  className="flex-1 py-3 bg-gray-50 text-primary-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  View Details
                </button>
                <Dropdown 
                  trigger={
                    <button className="p-3 bg-gray-50 text-gray-500 rounded-xl">
                      <MoreVertical size={18} />
                    </button>
                  }
                  className="flex-none"
                >
                  {booking.status === 'Pending' && (
                    <DropdownItem icon={CheckCircle2} variant="success" onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}>
                      Confirm
                    </DropdownItem>
                  )}
                  {['Pending', 'Confirmed'].includes(booking.status) && (
                    <DropdownItem icon={XCircle} variant="danger" onClick={() => handleUpdateStatus(booking.id, 'Cancelled')}>
                      Cancel
                    </DropdownItem>
                  )}
                </Dropdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Calendar size={40} />
          </div>
          <h3 className="text-2xl font-serif text-primary-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">Try adjusting your filters.</p>
        </div>
      )}

      {selectedBookingId && (
        <BookingDetailsModal 
          bookingId={selectedBookingId} 
          onClose={() => setSelectedBookingId(null)} 
        />
      )}
    </div>
  );
};

export default AllBookings;
