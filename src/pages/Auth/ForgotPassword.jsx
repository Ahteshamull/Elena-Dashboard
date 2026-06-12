import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowRight, Loader2, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useForgotPasswordMutation } from '../../redux/api/authApiSlice';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({ email }).unwrap();
      setSuccess(true);
      toast.success(response.message || "OTP sent to your email successfully!");
      
      // Store email for reset password step
      localStorage.setItem('resetEmail', email);

      // Auto redirect to OTP verification page after 2.5 seconds
      setTimeout(() => {
        navigate('/auth/verify-otp');
      }, 2500);
    } catch (err) {
      console.error('Failed to send OTP:', err);
      toast.error(err?.data?.message || err?.message || "Failed to send OTP");
    }
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
          <h1 className="text-4xl font-serif text-primary-900 mb-2 tracking-tight">Access Recovery</h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">Tableli Management Systems</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          <CardContent className="p-10 md:p-12">

            {!success ? (
              <form onSubmit={handleForgotPassword} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate('/auth/login')}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary-900 transition-colors mb-6"
                  >
                    <ChevronLeft size={14} />
                    Back to Login
                  </button>
                  <h3 className="text-2xl font-serif text-primary-900 mb-2">Reset Password</h3>
                  <p className="text-sm text-gray-500 mb-6">Enter your work email and we'll send you a secure link to reset your security key.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Work Email</label>
                  <Input
                    icon={Mail}
                    type="email"
                    required
                    placeholder="admin@tableli.com"
                    pl="pl-9"
                    iconClassName="left-2.5"
                    className="bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-900/5 rounded-2xl h-14 font-medium transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-800 active:scale-[0.98] transition-all shadow-xl shadow-primary-900/20 group overflow-hidden relative"
                  >
                    <span className={`flex items-center justify-center gap-3 transition-transform duration-300 ${loading ? '-translate-y-10' : ''}`}>
                      Send OTP
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-serif text-primary-900 mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-500 mb-8">We've sent a 6-digit security code to your email address. You are being redirected to the verification portal...</p>

                <div className="flex justify-center mb-6">
                  <Loader2 size={24} className="animate-spin text-accent" />
                </div>

                <Button
                  onClick={() => navigate('/auth/login')}
                  className="w-full h-14 border-gray-100 text-primary-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-50 transition-all"
                  variant="outline"
                >
                  Return to Login
                </Button>
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
