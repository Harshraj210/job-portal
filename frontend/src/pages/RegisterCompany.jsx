import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Building2, Globe, Image, FileText, ArrowRight } from "lucide-react";

const RegisterCompany = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    website: "",
    logo: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/company/register", {
        companyName: form.name,
        website: form.website,
        logo: form.logo,
        description: form.description,
      });

      toast.success("Company registered successfully");
      navigate("/recruiter-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-purple-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-[#7315c7]" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Register Your <span className="text-[#7315c7]">Company</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your company profile to start posting jobs and hiring top talent.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Company Name */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-[#7315c7] transition-colors" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7315c7] focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="e.g. Google"
                />
              </div>
            </div>

            {/* Website */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Company Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-[#7315c7] transition-colors" />
                </div>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7315c7] focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="https://company.com"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Logo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-400 group-focus-within:text-[#7315c7] transition-colors" />
                </div>
                <input
                  type="url"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7315c7] focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="https://logo.png"
                />
              </div>
            </div>

            {/* Description */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Company Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-[#7315c7] transition-colors" />
                </div>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7315c7] focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  placeholder="Tell us a bit about what you do..."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#7315c7] hover:bg-[#5e11a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7315c7] transition-all shadow-lg hover:shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Registering..."
            ) : (
              <span className="flex items-center">
                Register Company
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
