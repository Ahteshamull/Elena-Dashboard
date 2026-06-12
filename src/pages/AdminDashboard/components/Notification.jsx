import React from 'react';
import { 
  useGetNotificationsQuery, 
  useMarkNotificationAsReadMutation, 
  useMarkAllNotificationsAsReadMutation 
} from '../../../redux/api/notificationApiSlice';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '../../../utils/cn';

const Notification = () => {
  const { data: response, isLoading, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifications = response?.data || [];
  
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'payment_hold':
      case 'payment_released':
        return <AlertCircle size={20} className="text-amber-500" />;
      case 'booking_created':
        return <Bell size={20} className="text-blue-500" />;
      case 'profile_approved':
        return <Check size={20} className="text-emerald-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Notifications</h1>
          <p className="text-gray-500">Stay updated with system alerts and activities.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-primary-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <Bell size={48} className="mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={cn(
                  "p-6 flex items-start gap-4 transition-colors",
                  notification.isRead ? "bg-white opacity-70" : "bg-primary-50/30"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                  notification.isRead ? "bg-gray-100" : "bg-white shadow-sm border border-primary-100"
                )}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className={cn(
                      "text-base font-bold truncate",
                      notification.isRead ? "text-gray-700" : "text-primary-900"
                    )}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-xs font-medium text-gray-400">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  {notification.createdBy && (
                    <p className="text-xs font-bold text-gray-400 mb-3">
                      From: {notification.createdBy.userName}
                    </p>
                  )}

                  {!notification.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="text-xs font-bold text-accent hover:text-accent/80 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;