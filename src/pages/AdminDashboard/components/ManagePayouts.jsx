import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Wallet,
  Landmark,
  CreditCard,
  ChefHat
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import { Dropdown, DropdownItem } from '../../../components/ui/Dropdown';
import { useGetAllPaymentsQuery, useCapturePaymentMutation } from '../../../redux/api/bookingApiSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ManagePayouts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const { data: apiResponse, isLoading } = useGetAllPaymentsQuery();
  const [capturePaymentMutation] = useCapturePaymentMutation();

  const rawPayments = apiResponse?.data || [];
  
  const payoutRequests = rawPayments.map(p => ({
    id: p._id,
    chefName: p.chef?.userName || 'Unknown Chef',
    clientName: p.client?.userName || 'Unknown Client',
    amount: `$${p.amount}`,
    adminAmount: `$${p.admin_amount}`,
    chefAmount: `$${p.influencer_amount}`,
    method: p.provider || 'Stripe',
    requestedDate: new Date(p.createdAt).toLocaleDateString(),
    daysPending: p.daysPending,
    rawStatus: p.status,
    status: p.status === 'HOLD' ? 'Pending' : p.status === 'SUCCESS' ? 'Paid' : ['FAILED', 'CANCELLED'].includes(p.status) ? 'Rejected' : 'Awaiting'
  }));

  const filteredRequests = payoutRequests.filter(req => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = req.chefName.toLowerCase().includes(searchLower) || 
                         req.id.toLowerCase().includes(searchLower) ||
                         req.clientName.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const processPayout = async (paymentId, action) => {
    if (action === 'Paid') {
      const result = await Swal.fire({
        title: 'Release Payment?',
        text: `Are you sure you want to release this payout to the chef?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#059669',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, release it!'
      });

      if (result.isConfirmed) {
        try {
          await capturePaymentMutation(paymentId).unwrap();
          toast.success('Payout successfully processed');
        } catch (error) {
          toast.error(error?.data?.message || 'Failed to process payout');
        }
      }
    } else {
      toast.info('Rejecting payouts requires manual Stripe dashboard intervention.');
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Paid': return { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 };
      case 'Pending': return { color: 'text-amber-600 bg-amber-50', icon: Clock };
      case 'Rejected': return { color: 'text-red-600 bg-red-50', icon: XCircle };
      default: return { color: 'text-gray-600 bg-gray-50', icon: Clock };
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Bank Transfer': return Landmark;
      case 'PayPal': return Wallet;
      default: return CreditCard;
    }
  };

  return (
    <div className="py-6 md:py-10 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Payout Management</h1>
          <p className="text-gray-500">Process and monitor chef withdrawal requests across the platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center min-w-[140px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending Payouts</span>
            <span className="text-2xl font-bold text-amber-600">
              ${payoutRequests.filter(r => r.status === 'Pending').reduce((acc, curr) => acc + parseInt(curr.chefAmount.replace('$', '').replace(',', '')), 0).toLocaleString()}
            </span>
          </div>
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center min-w-[140px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-1">Total Paid To Chefs</span>
            <span className="text-2xl font-bold text-emerald-600">
              ${payoutRequests.filter(r => r.status === 'Paid').reduce((acc, curr) => acc + parseInt(curr.chefAmount.replace('$', '').replace(',', '')), 0).toLocaleString()}
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
            placeholder="Search by chef name or request ID..."
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
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
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
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Request ID</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Client</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Chef</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Total / Earning</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Method</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Requested</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRequests.map((req) => {
              const status = getStatusInfo(req.status);
              const MethodIcon = getMethodIcon(req.method);
              return (
                <tr key={req.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-6 text-xs font-bold text-gray-400 max-w-[100px] truncate" title={req.id}>{req.id}</td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-gray-600">{req.clientName}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center text-white text-[10px] font-bold">
                        {req.chefName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-primary-900">{req.chefName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-primary-900">Total: {req.amount}</p>
                      <p className="text-xs text-emerald-600 font-bold">Chef: {req.chefAmount}</p>
                      <p className="text-xs text-gray-500">Admin: {req.adminAmount}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MethodIcon size={16} />
                      <span className="text-xs">{req.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-400 font-medium">{req.requestedDate}</td>
                  <td className="px-6 py-6">
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", status.color)}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    {req.status === 'Pending' ? (
                      <Dropdown 
                        trigger={
                          <button className="p-2 text-gray-400 hover:text-primary-900 hover:bg-gray-100 rounded-xl transition-all">
                            <MoreVertical size={20} />
                          </button>
                        }
                      >
                        <DropdownItem icon={CheckCircle2} variant="success" onClick={() => processPayout(req.id, 'Paid')}>
                          Approve Payout
                        </DropdownItem>
                      </Dropdown>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{req.status === 'Paid' ? 'Processed' : 'N/A'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredRequests.map((req) => {
          const status = getStatusInfo(req.status);
          const MethodIcon = getMethodIcon(req.method);
          return (
            <Card key={req.id} className="border-none shadow-sm">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs font-bold">
                      {req.chefName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-900 text-sm">{req.chefName}</h4>
                      <p className="text-[10px] text-gray-400 font-medium max-w-[120px] truncate" title={req.id}>{req.id}</p>
                      <p className="text-[10px] text-gray-500 font-medium">For: {req.clientName}</p>
                    </div>
                  </div>
                  <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest", status.color)}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Earning</p>
                    <p className="text-sm font-bold text-emerald-600">{req.chefAmount}</p>
                    <p className="text-[10px] text-gray-400">Total: {req.amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Method</p>
                    <div className="flex items-center gap-1.5 text-primary-900">
                      <MethodIcon size={14} className="text-gray-400" />
                      <span className="text-xs font-bold">{req.method}</span>
                    </div>
                  </div>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => processPayout(req.id, 'Paid')}
                      className="flex-1 py-3 bg-primary-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                    <button 
                      onClick={() => processPayout(req.id, 'Rejected')}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-serif text-primary-900 mb-2">No payout requests</h3>
          <p className="text-gray-500">Adjust filters or search to find specific requests.</p>
        </div>
      )}
    </div>
  );
};

export default ManagePayouts;
