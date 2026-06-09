import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MoreVertical, 
  Filter, 
  ChevronDown, 
  Star, 
  MapPin, 
  ChefHat,
  Ban,
  CheckCircle2,
  ExternalLink,
  Eye,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import { Dropdown, DropdownItem } from '../../../components/ui/Dropdown';
import useAdminStore from '../../../store/adminStore';

const ManageChefs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { activeChefs, toggleChefStatus, deleteChef } = useAdminStore();

  const filteredChefs = activeChefs.filter(chef => {
    const matchesSearch = chef.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         chef.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || chef.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-6 md:py-10 space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Manage Chefs</h1>
          <p className="text-gray-500">Monitor and manage all culinary professionals on the platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Chefs</span>
            <span className="text-2xl font-bold text-primary-900">{activeChefs.length}</span>
          </div>
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-1">Active</span>
            <span className="text-2xl font-bold text-emerald-600">{activeChefs.filter(c => c.status === 'Active').length}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, specialty, or location..."
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
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Chef</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Ratings</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Total Earnings</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Joined</th>
              <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredChefs.map((chef) => (
              <tr key={chef.id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-900 leading-none mb-1">{chef.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{chef.specialty.split('•')[0]}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    chef.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {chef.status}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-accent fill-accent" />
                    <span className="text-sm font-bold text-primary-900">{chef.rating}</span>
                    <span className="text-xs text-gray-400">({chef.reviews})</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="text-sm font-bold text-primary-900">{chef.earnings}</span>
                </td>
                <td className="px-6 py-6 text-xs text-gray-400 font-medium">
                  {chef.joinedDate}
                </td>
                <td className="px-6 py-6 text-right">
                  <Dropdown 
                    trigger={
                      <button className="p-2 text-gray-400 hover:text-primary-900 hover:bg-gray-100 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    }
                  >
                    <DropdownItem icon={Eye} onClick={() => navigate('/chef-profile')}>
                      View Profile
                    </DropdownItem>
                    <DropdownItem 
                      icon={chef.status === 'Active' ? UserX : UserCheck} 
                      variant={chef.status === 'Active' ? 'danger' : 'success'}
                      onClick={() => toggleChefStatus(chef.id)}
                    >
                      {chef.status === 'Active' ? 'Suspend Chef' : 'Activate Chef'}
                    </DropdownItem>
                    <div className="h-px bg-gray-100 my-1" />
                    <DropdownItem icon={Trash2} variant="danger" onClick={() => deleteChef(chef.id)}>
                      Delete Account
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
        {filteredChefs.map((chef) => (
          <Card key={chef.id} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={chef.image} alt={chef.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-primary-900">{chef.name}</h4>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em]",
                      chef.status === 'Active' ? "text-emerald-600" : "text-red-500"
                    )}>
                      {chef.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <Star size={12} className="text-accent fill-accent" />
                  <span className="text-xs font-bold">{chef.rating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Earnings</p>
                  <p className="text-sm font-bold text-primary-900">{chef.earnings}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Joined</p>
                  <p className="text-sm font-bold text-primary-900">{chef.joinedDate}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => navigate('/chef-profile')}
                  className="flex-1 py-3 bg-primary-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-800 transition-colors"
                >
                  View Profile
                </button>
                <Dropdown 
                  trigger={
                    <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
                      <MoreVertical size={18} />
                    </button>
                  }
                  className="flex-none"
                >
                  <DropdownItem 
                    icon={chef.status === 'Active' ? UserX : UserCheck} 
                    variant={chef.status === 'Active' ? 'danger' : 'success'}
                    onClick={() => toggleChefStatus(chef.id)}
                  >
                    {chef.status === 'Active' ? 'Suspend' : 'Activate'}
                  </DropdownItem>
                  <div className="h-px bg-gray-100 my-1" />
                  <DropdownItem icon={Trash2} variant="danger" onClick={() => deleteChef(chef.id)}>
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredChefs.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-serif text-primary-900 mb-2">No chefs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
            className="mt-8 text-sm font-bold text-accent uppercase tracking-widest"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageChefs;
