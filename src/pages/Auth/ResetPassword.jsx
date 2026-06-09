import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleReset = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    // Simulate password update
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-[480px] z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl border border-gray-100 mb-6 animate-in zoom-in duration-700">
            <ShieldCheck className="text-accent" size={40} />
          </div>
          <h1 className="text-4xl font-serif text-primary-900 mb-2 tracking-tight">Set New Key</h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">Secure Your Admin Access</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          <CardContent className="p-10 md:p-12">

            {!success ? (
              <form onSubmit={handleReset} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-primary-900 mb-2">Create New Password</h3>
                  <p className="text-sm text-gray-500 mb-6">Choose a strong security key to protect your administrative account.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">New Security Key</label>
                  <div className="relative group">
                    <Input
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      pl="pl-9"
                      iconClassName="left-2.5"
                      className="pr-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-900/5 rounded-2xl h-14 font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors focus:outline-none z-10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Confirm New Key</label>
                  <Input
                    icon={Lock}
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    pl="pl-9"
                    iconClassName="left-2.5"
                    className="bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-900/5 rounded-2xl h-14 font-medium transition-all"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-800 active:scale-[0.98] transition-all shadow-xl shadow-primary-900/20 group overflow-hidden relative"
                  >
                    <span className={`flex items-center justify-center gap-3 transition-transform duration-300 ${loading ? '-translate-y-10' : ''}`}>
                      Update Security Key
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>

                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center animate-in slide-in-from-bottom-10">
                        <Loader2 size={24} className="animate-spin" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 animate-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif text-primary-900 mb-2">Password Updated</h3>
                <p className="text-sm text-gray-500 mb-8">Your security key has been successfully changed. You will be redirected to the login portal in a few seconds.</p>
                <div className="flex justify-center">
                  <Loader2 size={24} className="animate-spin text-accent" />
                </div>
              </div>
            )}

            <p className="text-center text-[11px] text-gray-400 font-medium mt-8">
              Protected by Tableli Security Systems. All actions are logged.
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Tableli. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
