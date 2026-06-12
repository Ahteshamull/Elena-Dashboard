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
  DollarSign,
  HelpCircle,
  Shield,
  FileText,
  Trash2,
  Edit2
} from 'lucide-react';
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import { useCreateLegalDocMutation, useGetLegalDocQuery } from '../../../redux/api/legalDocApiSlice';
import { useCreateFaqMutation, useGetFaqsQuery, useUpdateFaqMutation, useDeleteFaqMutation } from '../../../redux/api/faqApiSlice';
import { useChangePasswordMutation } from '../../../redux/api/authApiSlice';
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

  const [legalDocContents, setLegalDocContents] = useState({
    privacyPolicy: '',
    termsAndCondition: '',
  });

  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [editingFaqId, setEditingFaqId] = useState(null);

  const [createLegalDoc] = useCreateLegalDocMutation();
  const [createFaq, { isLoading: isCreatingFaq }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdatingFaq }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { data: privacyData } = useGetLegalDocQuery('privacyPolicy');
  const { data: termsData } = useGetLegalDocQuery('termsAndCondition');
  const { data: faqsData } = useGetFaqsQuery();

  React.useEffect(() => {
    if (privacyData?.data && privacyData.data.length > 0) {
      setLegalDocContents(prev => ({ ...prev, privacyPolicy: privacyData.data[0].description }));
    }
    if (termsData?.data && termsData.data.length > 0) {
      setLegalDocContents(prev => ({ ...prev, termsAndCondition: termsData.data[0].description }));
    }
  }, [privacyData, termsData]);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'fees', label: 'Platform Fees', icon: Percent },
    { id: 'faq', label: 'Faqs', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const handleSave = () => {
    updateSettings(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveLegalDoc = async (contentKey) => {
    try {
      await createLegalDoc({
        content: contentKey,
        data: { description: legalDocContents[contentKey] }
      }).unwrap();
      toast.success(`${contentKey === 'privacyPolicy' ? 'Privacy Policy' : 'Terms & Conditions'} saved successfully!`);
    } catch (err) {
      toast.error('Failed to save document');
    }
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      toast.error('Question and Answer are required');
      return;
    }
    try {
      if (editingFaqId) {
        await updateFaq({ id: editingFaqId, ...faqForm }).unwrap();
        toast.success('FAQ updated successfully!');
        setEditingFaqId(null);
      } else {
        await createFaq(faqForm).unwrap();
        toast.success('FAQ created successfully!');
      }
      setFaqForm({ question: '', answer: '' });
    } catch (err) {
      toast.error(editingFaqId ? 'Failed to update FAQ' : 'Failed to create FAQ');
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq._id);
    setFaqForm({ question: faq.question, answer: faq.answer });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteFaq(id).unwrap();
        toast.success('FAQ deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete FAQ');
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      }).unwrap();
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
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
        {(activeTab === 'general' || activeTab === 'fees' || activeTab === 'security') && (
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-900 text-white font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-lg"
          >
            <Save size={18} />
            Save Changes
          </Button>
        )}
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

              {activeTab === 'faq' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-serif text-primary-900">{editingFaqId ? 'Update FAQ' : 'Create New FAQ'}</h3>
                      {editingFaqId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingFaqId(null);
                            setFaqForm({ question: '', answer: '' });
                          }}
                          className="text-xs"
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Question</label>
                        <Input 
                          value={faqForm.question}
                          onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                          placeholder="e.g., How do I create an account?"
                          className="bg-gray-50 border-none rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400">Answer</label>
                        <textarea
                          value={faqForm.answer}
                          onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                          placeholder="Provide the answer here..."
                          className="w-full bg-gray-50 border-none rounded-xl p-4 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <Button 
                        onClick={handleSaveFaq}
                        disabled={isCreatingFaq || isUpdatingFaq}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl w-full"
                      >
                        {editingFaqId 
                          ? (isUpdatingFaq ? 'Updating...' : 'Update FAQ') 
                          : (isCreatingFaq ? 'Creating...' : 'Create FAQ')
                        }
                      </Button>
                    </div>

                    {faqsData?.data?.faqs?.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-serif text-primary-900 mb-4">Existing FAQs</h3>
                        <div className="space-y-4">
                          {faqsData.data.faqs.map(faq => (
                            <div key={faq._id} className="bg-gray-50 p-4 rounded-xl flex gap-4 group">
                              <div className="flex-1">
                                <p className="font-bold text-primary-900 mb-1">{faq.question}</p>
                                <p className="text-sm text-gray-600">{faq.answer}</p>
                              </div>
                              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => handleEditFaq(faq)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Edit FAQ"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteFaq(faq._id)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  title="Delete FAQ"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-serif text-primary-900">Privacy Policy Content</h3>
                    <Button 
                      onClick={() => handleSaveLegalDoc('privacyPolicy')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2"
                    >
                      <Save size={16} /> Save Changes
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <JoditEditor
                      value={legalDocContents.privacyPolicy}
                      config={{
                        readonly: false,
                        height: 500,
                        uploader: { insertImageAsBase64URI: true }
                      }}
                      onBlur={newContent => setLegalDocContents(prev => ({ ...prev, privacyPolicy: newContent }))}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-serif text-primary-900">Terms & Conditions Content</h3>
                    <Button 
                      onClick={() => handleSaveLegalDoc('termsAndCondition')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl flex items-center gap-2"
                    >
                      <Save size={16} /> Save Changes
                    </Button>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <JoditEditor
                      value={legalDocContents.termsAndCondition}
                      config={{
                        readonly: false,
                        height: 500,
                        uploader: { insertImageAsBase64URI: true }
                      }}
                      onBlur={newContent => setLegalDocContents(prev => ({ ...prev, termsAndCondition: newContent }))}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif text-primary-900">Admin Authentication</h3>
                    <div className="space-y-4">
                      {!showPasswordForm ? (
                        <Button 
                          onClick={() => setShowPasswordForm(true)}
                          variant="outline" 
                          className="w-full justify-start gap-3 py-6 rounded-2xl border-gray-100 hover:bg-gray-50 transition-all font-bold text-sm"
                        >
                          <Lock size={18} className="text-accent" />
                          Change Admin Password
                        </Button>
                      ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4 bg-gray-50 p-6 rounded-2xl">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Current Password</label>
                            <Input 
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              className="bg-white border-none rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</label>
                            <Input 
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              className="bg-white border-none rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm Password</label>
                            <Input 
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              className="bg-white border-none rounded-xl"
                            />
                          </div>
                          <div className="flex gap-4 pt-4">
                            <Button 
                              type="submit" 
                              disabled={isChangingPassword}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl"
                            >
                              {isChangingPassword ? 'Updating...' : 'Update Password'}
                            </Button>
                            <Button 
                              type="button"
                              onClick={() => {
                                setShowPasswordForm(false);
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                              }}
                              variant="outline"
                              className="flex-1 py-3 rounded-xl border-gray-200"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
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
