import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, ChevronLeft, Timer } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { toast } from 'react-toastify';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../redux/api/authApiSlice';

export const OTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
  const [verifyOtp, { isLoading: loading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    try {
      const response = await verifyOtp({ otp: otpValue }).unwrap();
      
      // The backend returns the email upon successful OTP verification.
      // Save it so ResetPassword can use it.
      if (response?.email) {
        localStorage.setItem('resetEmail', response.email);
      }

      toast.success(response?.message || "OTP verified successfully!");
      navigate('/auth/reset-password');
    } catch (err) {
      console.error('Failed to verify OTP:', err);
      toast.error(err?.data?.message || err?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    const email = localStorage.getItem('resetEmail');
    if (!email) {
      toast.error("Email not found. Please start the password reset process again.");
      return;
    }

    try {
      const response = await resendOtp({ email }).unwrap();
      toast.success(response?.message || "OTP resent successfully!");
      setTimer(59);
    } catch (err) {
      console.error('Failed to resend OTP:', err);
      toast.error(err?.data?.message || err?.message || "Failed to resend OTP");
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
          <h1 className="text-4xl font-serif text-primary-900 mb-2 tracking-tight">Verify Access</h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">Tableli Security Protocol</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          <CardContent className="p-10 md:p-12">
            <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/auth/forget-password')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary-900 transition-colors mb-6"
                >
                  <ChevronLeft size={14} />
                  Back
                </button>
                <h3 className="text-2xl font-serif text-primary-900 mb-2">Two-Step Verification</h3>
                <p className="text-sm text-gray-500">We've sent a 6-digit security code to your email. Enter it below to verify your identity.</p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-900/5 focus:border-accent transition-all outline-none text-primary-900"
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  disabled={loading || otp.join('').length < 6}
                  className="w-full h-14 bg-primary-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-800 active:scale-[0.98] transition-all shadow-xl shadow-primary-900/20 group overflow-hidden relative"
                >
                  <span className={`flex items-center justify-center gap-3 transition-transform duration-300 ${loading ? '-translate-y-10' : ''}`}>
                    Verify Security Code
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center animate-in slide-in-from-bottom-10">
                      <Loader2 size={24} className="animate-spin" />
                    </div>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={timer > 0 || isResending}
                    className={`font-bold transition-colors ${timer > 0 || isResending ? 'text-gray-300 cursor-not-allowed' : 'text-accent hover:text-primary-900'}`}
                  >
                    {isResending ? 'Resending...' : `Resend ${timer > 0 ? `(${timer}s)` : ''}`}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
              <Timer size={14} className="text-accent" />
              <span>Session expires in 10:00</span>
            </div>
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
