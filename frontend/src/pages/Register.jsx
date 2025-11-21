import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User, Briefcase, HelpCircle, ArrowRight, Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success("Account created successfully!");
      navigate("/jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#7315c7] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#9324bc] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join thousands of recruiters and job seekers today.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#7315c7] transition-colors" />
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#7315c7] transition-colors" />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#7315c7] transition-colors" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "applicant" })}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  formData.role === "applicant"
                    ? "bg-purple-50 border-[#7315c7] text-[#7315c7]"
                    : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Job Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "recruiter" })}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                  formData.role === "recruiter"
                    ? "bg-purple-50 border-[#7315c7] text-[#7315c7]"
                    : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">Recruiter</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7315c7] hover:bg-[#9324bc] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Link to Login */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#7315c7] font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>

        <div className="h-1.5 w-full bg-gradient-to-r from-[#7315c7] to-[#9324bc]"></div>
      </div>

      <button className="fixed bottom-6 right-6 bg-white p-3.5 rounded-full shadow-xl text-[#7315c7] hover:scale-110 transition-transform border border-gray-100 group">
        <HelpCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Register;