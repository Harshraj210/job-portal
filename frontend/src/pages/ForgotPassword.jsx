import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowRight, Loader2, KeyRound, Lock } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/request-otp",
        { email },
        { 
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }
      );
      toast.success(response.data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { email, otp, password: newPassword },
        { 
            withCredentials: true,
             headers: {
                "Content-Type": "application/json"
            }
        }
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4 relative overflow-hidden">
      {/* Decorative Background Elements - matching Login */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#7315c7] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#9324bc] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? "Enter your email to receive an OTP."
              : "Enter the OTP and your new password."}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="px-8 pb-8 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#7315c7] transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7315c7] hover:bg-[#9324bc] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send OTP <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-[#7315c7] font-medium"
              >
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="px-8 pb-8 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 ml-1">
                OTP Code
              </label>
              <div className="relative group">
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#7315c7] transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Enter OTP"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-900"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 ml-1">
                New Password
              </label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#7315c7] transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm text-gray-900"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7315c7] hover:bg-[#9324bc] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Reset Password <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
             <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-600 hover:text-[#7315c7] font-medium"
              >
                Resend OTP / Change Email
              </button>
            </div>
          </form>
        )}

        <div className="h-1.5 w-full bg-gradient-to-r from-[#7315c7] to-[#9324bc]"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
