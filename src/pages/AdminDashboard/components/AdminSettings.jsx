import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Percent, 
  Bell, 
  Save, 
  Mail, 
  Lock,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Toggle } from '../../../components/ui/Toggle';
import useAdminStore from '../../../store/adminStore';

const AdminSettings = () => {
  const { settings, updateSettings } = useAdminStore();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState(settings || { notifications: {} });
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync formData with settings when they become available
  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'fees', label: 'Platform Fees', icon: Percent },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const handleSave = () => {
    updateSettings(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleToggle = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleNotificationToggle = (key, value) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: value
      }
    });
  };

  return (
    <div className="py-6 md:py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Platform Settings</h1>
          <p className="text-gray-500">Configure global platform behavior and administrative controls.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-900 text-white font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-lg"
        >
          <Save size={18} />
          Save Changes
        </Button>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">Settings updated successfully!</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm text-left group",
                activeTab === tab.id 
                  ? "bg-white text-primary-900 shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <tab.icon size={18} className={cn(activeTab === tab.id ? "text-accent" : "group-hover:text-accent")} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <Card className="border-none shadow-sm overflow-visible">
            <CardContent className="p-8 md:p-10">
              
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Platform Name</label>
                      <Input 
                        value={formData?.platformName || ''}
                        onChange={(e) => setFormData({...formData, platformName: e.target.value})}
                        className="bg-gray-50 border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Support Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          value={formData?.supportEmail || ''}
                          onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                          className="pl-12 bg-gray-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === 'fees' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Service Fee (%)</label>
                      <div className="relative">
                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          type="number"
                          value={formData?.serviceFee || 0}
                          onChange={(e) => setFormData({...formData, serviceFee: e.target.value})}
                          className="pl-12 bg-gray-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Minimum Booking Value ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          type="number"
                          value={formData?.minimumBooking || 0}
                          onChange={(e) => setFormData({...formData, minimumBooking: e.target.value})}
                          className="pl-12 bg-gray-50 border-none rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-primary-900">New Chef Signups</h4>
                      <p className="text-xs text-gray-400">Receive email alerts for new chef verification requests.</p>
                    </div>
                    <Toggle 
                      checked={formData?.notifications?.newChefSignup || false}
                      onChange={(val) => handleNotificationToggle('newChefSignup', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-primary-900">Booking Confirmations</h4>
                      <p className="text-xs text-gray-400">Get notified when a new booking is confirmed on the platform.</p>
                    </div>
                    <Toggle 
                      checked={formData?.notifications?.newBooking || false}
                      onChange={(val) => handleNotificationToggle('newBooking', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-primary-900">Payout Requests</h4>
                      <p className="text-xs text-gray-400">Instant alerts for chef payout withdrawal requests.</p>
                    </div>
                    <Toggle 
                      checked={formData?.notifications?.payoutRequests || false}
                      onChange={(val) => handleNotificationToggle('payoutRequests', val)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif text-primary-900">Admin Authentication</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start gap-3 py-6 rounded-2xl border-gray-100 hover:bg-gray-50 transition-all font-bold text-sm">
                        <Lock size={18} className="text-accent" />
                        Change Admin Password
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
