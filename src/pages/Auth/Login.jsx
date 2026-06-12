import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";
import { Card, CardContent } from "../../components/ui/Card";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/userSlices";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [login, { isLoading: loading }] = useLoginMutation();

  // Load remembered email and password on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedAdminEmail");
    const rememberedPassword = localStorage.getItem("rememberedAdminPassword");
    
    if (rememberedEmail) {
      setFormData((prev) => ({ 
        ...prev, 
        email: rememberedEmail,
        password: rememberedPassword || ""
      }));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Handle Remember Me
    if (rememberMe) {
      localStorage.setItem("rememberedAdminEmail", formData.email);
      localStorage.setItem("rememberedAdminPassword", formData.password);
    } else {
      localStorage.removeItem("rememberedAdminEmail");
      localStorage.removeItem("rememberedAdminPassword");
    }

    try {
      const response = await login(formData).unwrap();
      
      const { admin, token, refreshToken } = response.data;

      // LocalStorage
      localStorage.setItem("user", JSON.stringify(admin));
      localStorage.setItem("accessToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      // Cookie
      document.cookie = `accessToken=${token}; path=/; max-age=2592000; Secure; SameSite=Strict`;
      if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; Secure; SameSite=Strict`;
      }

      // Redux State
      dispatch(setCredentials({ user: admin, token, refreshToken }));

      toast.success(response?.message || "Login successful!");
      navigate("/admin");
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(err?.data?.message || err?.message || "Failed to login");
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
          <h1 className="text-4xl font-serif text-primary-900 mb-2 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">
            Tableli Management Systems
          </p>
        </div>

        <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          <CardContent className="p-10 md:p-12">
            <form
              onSubmit={handleLogin}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                  Work Email
                </label>
                <Input
                  icon={Mail}
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter Email"
                  pl="pl-9"
                  iconClassName="left-2.5"
                  className="bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-900/5 rounded-2xl h-14 font-medium transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Security Key
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/auth/forget-password")}
                    className="text-[10px] font-black uppercase tracking-[0.1em] text-accent hover:text-primary-900 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Input
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter Password"
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

              <div className="flex items-center justify-between ml-1">
                <Checkbox
                  label="Remember this device"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary-800 active:scale-[0.98] transition-all shadow-xl shadow-primary-900/20 group overflow-hidden relative"
                >
                  <span
                    className={`flex items-center justify-center gap-3 transition-transform duration-300 ${loading ? "-translate-y-10" : ""}`}
                  >
                    Unlock Dashboard
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center animate-in slide-in-from-bottom-10">
                      <Loader2 size={24} className="animate-spin" />
                    </div>
                  )}
                </Button>
              </div>
            </form>

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
