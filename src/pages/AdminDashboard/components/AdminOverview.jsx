import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ChefHat, 
  Calendar, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';
import { useGetAdminOverviewQuery } from '../../../redux/api/adminApiSlice';

const AdminOverview = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminName = user.name || user.userName || 'Admin';

  const { data: response, isLoading } = useGetAdminOverviewQuery();
  const overviewData = response?.data || {
    totalAdminRevenue: 0,
    totalBookings: 0,
    totalChefs: 0,
    totalUsers: 0,
    userRatio: "0",
    recentActivity: []
  };

  const totalRevenue = overviewData.totalAdminRevenue;

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${totalRevenue.toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up', 
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      label: 'Total Bookings', 
      value: overviewData.totalBookings.toString(), 
      change: '+8.2%', 
      trend: 'up', 
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Active Chefs', 
      value: overviewData.totalChefs.toString(), 
      change: '+4.1%', 
      trend: 'up', 
      icon: ChefHat,
      color: 'bg-amber-50 text-amber-600'
    },
    { 
      label: 'Active Users', 
      value: overviewData.totalUsers.toString(), 
      change: '-2.4%', 
      trend: 'down', 
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading overview...</div>;
  }

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Welcome back, {adminName}</h1>
        <p className="text-gray-500">Here's what's happening on the platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-primary-900 tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-primary-900">Recent Activity</h3>
        
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Activity</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {overviewData.recentActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            activity.type === 'booking' ? "bg-blue-50 text-blue-600" :
                            activity.type === 'registration' ? "bg-amber-50 text-amber-600" :
                            activity.type === 'payment' ? "bg-emerald-50 text-emerald-600" :
                            "bg-red-50 text-red-600"
                          )}>
                            {activity.type === 'booking' ? <Calendar size={18} /> :
                             activity.type === 'registration' ? <ChefHat size={18} /> :
                             activity.type === 'payment' ? <DollarSign size={18} /> :
                             <AlertCircle size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary-900">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.type === 'booking' ? `with ${activity.chef} for ${activity.user}` :
                               activity.type === 'payment' ? `From ${activity.user} • ${activity.amount}` :
                               `${activity.user}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          activity.status === 'Confirmed' || activity.status === 'Paid' ? "bg-emerald-50 text-emerald-600" :
                          activity.status === 'Pending Verification' || activity.status === 'Pending' ? "bg-amber-50 text-amber-600" :
                          "bg-red-50 text-red-600"
                        )}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-400 font-medium">
                        {activity.time}
                      </td>
                    </tr>
                  ))}
                  {overviewData.recentActivity.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-8 text-gray-500">No recent activity found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Ratio */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-primary-900">User Ratio</h3>
          <Card className="border-none shadow-sm bg-primary-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users size={120} />
            </div>
            <CardContent className="p-8 relative z-10">
              <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-[0.2em]">Chefs vs Users</p>
              
              <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl text-blue-500 font-bold tracking-tighter">{overviewData.userRatio || "0"}</span>
                  <span className="text-blue-400 mb-1">chefs per user (Overall)</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl text-amber-500 font-bold tracking-tighter">{overviewData.monthlyUserRatio || "0"}</span>
                  <span className="text-gray-400 text-sm mb-0.5">chefs per user (This Month)</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <ChefHat size={16} />
                    </div>
                    <span className="text-sm font-bold">Total Chefs</span>
                  </div>
                  <span className="text-lg text-blue-500 font-bold">{overviewData.totalChefs}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    <span className="text-sm font-bold">Total Users</span>
                  </div>
                  <span className="text-lg text-purple-500 font-bold">{overviewData.totalUsers}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
