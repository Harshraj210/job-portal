import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure this path is correct
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Building2, User, ArrowRight, Loader2 } from "lucide-react";

const RecruiterRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Role is hardcoded to 'recruiter' in the submit handler
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
      // Force role to 'recruiter'
      await register(formData.name, formData.email, formData.password, "recruiter");
      toast.success("Company account created!");
      navigate("/recruiter-dashboard"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 relative overflow-hidden">
      {/* Decorative Background Elements (Blue theme for companies) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hire Top Talent</h2>
          <p className="text-gray-500 text-sm">Create a company account to post jobs and find candidates.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
          
          {/* Name Field (Company Name or Recruiter Name) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">Company / Recruiter Name</label>
            <div className="relative group">
              <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                name="name"
                required
                placeholder="Acme Corp or John Recruiter"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-gray-900"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">Work Email</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                name="email"
                required
                placeholder="hr@company.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-gray-900"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm text-gray-900"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Register Company <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Login
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Looking for a job?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Register as Applicant
              </Link>
            </p>
          </div>
        </form>

        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      </div>
    </div>
  );
};

export default RecruiterRegister;