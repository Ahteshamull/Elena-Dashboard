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
import useAdminStore from '../../../store/adminStore';

const recentActivities = [
  { id: 1, type: 'booking', user: 'Julian Jameson', chef: 'Chef Marco', amount: '$450', status: 'Confirmed', time: '2 hours ago' },
  { id: 2, type: 'registration', user: 'Chef Elena S.', status: 'Pending Verification', time: '5 hours ago' },
  { id: 3, type: 'payment', user: 'Sophia L.', amount: '$1,200', status: 'Paid', time: '8 hours ago' },
  { id: 4, type: 'dispute', user: 'Michael R.', status: 'Under Review', time: '1 day ago' },
];

const AdminOverview = () => {
  const { activeChefs, activeUsers } = useAdminStore();

  const totalRevenue = activeChefs.reduce((acc, chef) => {
    const val = parseInt(chef.earnings.replace(/[^0-9]/g, '')) || 0;
    return acc + val;
  }, 0);

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
      value: '842', 
      change: '+8.2%', 
      trend: 'up', 
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Active Chefs', 
      value: activeChefs.length.toString(), 
      change: '+4.1%', 
      trend: 'up', 
      icon: ChefHat,
      color: 'bg-amber-50 text-amber-600'
    },
    { 
      label: 'Active Users', 
      value: activeUsers.length.toString(), 
      change: '-2.4%', 
      trend: 'down', 
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    },
  ];

  return (
    <div className="py-6 md:py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Welcome back, Admin</h1>
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
            <button className="text-sm font-bold text-accent uppercase tracking-widest hover:text-accent-hover">View All</button>
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
                  {recentActivities.map((activity) => (
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
                              {activity.type === 'booking' ? `New Booking: ${activity.user}` :
                               activity.type === 'registration' ? `New Chef: ${activity.user}` :
                               activity.type === 'payment' ? `Payment Received` :
                               `Dispute Opened`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.type === 'booking' ? `with ${activity.chef} • ${activity.amount}` :
                               activity.type === 'registration' ? `Awaiting verification` :
                               activity.type === 'payment' ? `From ${activity.user} • ${activity.amount}` :
                               `Opened by ${activity.user}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          activity.status === 'Confirmed' || activity.status === 'Paid' ? "bg-emerald-50 text-emerald-600" :
                          activity.status === 'Pending Verification' ? "bg-amber-50 text-amber-600" :
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
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / Platform Health */}
        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-primary-900">Platform Health</h3>
          <Card className="border-none shadow-sm bg-primary-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={120} />
            </div>
            <CardContent className="p-8 relative z-10">
              <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-[0.2em]">Live Status</p>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold">API Systems</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">OPTIMAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold">Payment Gateway</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">OPTIMAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-bold">Pending Payouts</span>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">$12,450</span>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-accent text-primary-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-colors">
                Run System Audit
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
