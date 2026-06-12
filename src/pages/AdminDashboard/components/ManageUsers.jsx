import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MoreVertical, 
  Filter, 
  User,
  Mail,
  Calendar,
  CreditCard,
  Ban,
  CheckCircle2,
  Trash2,
  UserX,
  UserCheck,
  History,
  Eye
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import { Dropdown, DropdownItem } from '../../../components/ui/Dropdown';
import { useGetAllUsersByRoleQuery, useDeleteUserMutation, useBlockUserMutation } from '../../../redux/api/userApiSlice';
import { Loader2 } from 'lucide-react';
import { UserProfileModal } from './UserProfileModal';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const { data: apiResponse, isLoading } = useGetAllUsersByRoleQuery('user');
  const [deleteUserMutation] = useDeleteUserMutation();
  const [blockUserMutation] = useBlockUserMutation();

  const handleToggleStatus = async (id) => {
    try {
      await blockUserMutation(id).unwrap();
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete this user. This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteUserMutation(id).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete user');
      }
    }
  };

  const apiUsers = apiResponse?.data || [];

  const mappedUsers = apiUsers.map(user => ({
    id: user._id,
    name: user.profile?.fullName || user.userName || 'Unknown',
    email: user.email,
    status: user.status === 'active' ? 'Active' : 'Suspended',
    bookings: 0,
    spend: '$0',
    joined: new Date(user.createdAt).toLocaleDateString()
  }));

  const filteredUsers = mappedUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchLower) || 
                         (user.email || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary-900" size={40} />
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Manage Users</h1>
          <p className="text-gray-500">View and manage all registered clients on the platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Users</span>
            <span className="text-2xl font-bold text-primary-900">{mappedUsers.length}</span>
          </div>
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-1">Active</span>
            <span className="text-2xl font-bold text-emerald-600">{mappedUsers.filter(u => u.status === 'Active').length}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
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
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
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
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">User</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Bookings</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Total Spend</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Joined</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-900 leading-none mb-1">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    user.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-primary-900">
                    <History size={14} className="text-gray-400" />
                    {user.bookings}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="text-sm font-bold text-primary-900">{user.spend}</span>
                </td>
                <td className="px-6 py-6 text-xs text-gray-400 font-medium">
                  {user.joined}
                </td>
                <td className="px-6 py-6 text-right">
                  <Dropdown 
                    trigger={
                      <button className="p-2 text-gray-400 hover:text-primary-900 hover:bg-gray-100 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    }
                  >
                    <DropdownItem icon={Eye} onClick={() => setSelectedUserId(user.id)}>
                      View Profile
                    </DropdownItem>
                    <DropdownItem icon={History} onClick={() => navigate(`/admin/users/${user.id}/bookings`)}>
                      Booking History
                    </DropdownItem>
                    <DropdownItem 
                      icon={user.status === 'Active' ? UserX : UserCheck} 
                      variant={user.status === 'Active' ? 'danger' : 'success'}
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </DropdownItem>
                    <div className="h-px bg-gray-100 my-1" />
                    <DropdownItem icon={Trash2} variant="danger" onClick={() => handleDelete(user.id)}>
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900">{user.name}</h4>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em]",
                      user.status === 'Active' ? "text-emerald-600" : "text-red-500"
                    )}>
                      {user.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <CreditCard size={12} className="text-gray-400" />
                  <span className="text-xs font-bold">{user.spend}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Bookings</p>
                  <p className="text-sm font-bold text-primary-900">{user.bookings} events</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Joined</p>
                  <p className="text-sm font-bold text-primary-900">{user.joined}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedUserId(user.id)}
                  className="flex-1 py-3 bg-gray-50 text-primary-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => navigate(`/admin/users/${user.id}/bookings`)}
                  className="flex-1 py-3 bg-gray-50 text-primary-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  View History
                </button>
                <Dropdown 
                  trigger={
                    <button className="p-3 bg-gray-50 text-gray-500 rounded-xl">
                      <MoreVertical size={18} />
                    </button>
                  }
                  className="flex-none"
                >
                  <DropdownItem 
                    icon={user.status === 'Active' ? UserX : UserCheck} 
                    variant={user.status === 'Active' ? 'danger' : 'success'}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </DropdownItem>
                  <div className="h-px bg-gray-100 my-1" />
                  <DropdownItem icon={Trash2} variant="danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-serif text-primary-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
            className="mt-8 text-sm font-bold text-accent uppercase tracking-widest"
          >
            Clear all filters
          </button>
        </div>
      )}

      {selectedUserId && (
        <UserProfileModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
};

export default ManageUsers;
