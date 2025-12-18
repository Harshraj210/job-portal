import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Tags,
  DollarSign,
  Loader2,
  ArrowRight,
  Building2,
} from "lucide-react";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyLogo: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/jobs/create", formData); // Backend protected route

      toast.success("Job posted successfully! 🎉");
      navigate("/recruiter-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job❗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-12 px-4 flex justify-center items-center relative overflow-hidden">
      {/* Blob Background Animation */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#7315c7] rounded-full opacity-10 blur-3xl animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#aa27d4] rounded-full opacity-10 blur-3xl animate-blob animation-delay-2000"></div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl px-10 py-12 border border-gray-100 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Post <span className="text-[#7315c7]">A</span> New{" "}
          <span className="text-[#7315c7]">Job</span>
        </h2>

        <p className="text-gray-600 text-center mb-8">
          Help thousands of applicants find the right opportunity.
        </p>

        <div className="grid gap-5">
          {/* Job Title */}
          <label className="text-sm font-medium text-gray-700">Job Title</label>
          <div className="relative">
            <Briefcase className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition"
            />
          </div>

          {/* Company Name */}
          <label className="text-sm font-medium text-gray-700">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-3" />

            <input
              type="text"
              name="companyName"
              required
              placeholder="e.g. Google"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition"
            />
          </div>

          {/* Company Logo */}
          {/* Company Logo */}
          <label className="text-sm font-medium text-gray-700">
            Company Logo URL
          </label>
          <div className="relative">
            <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="companyLogo"
              placeholder="https://logo.com/logo.png"
              value={formData.companyLogo}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl
      focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100
      outline-none transition"
            />
          </div>

          {/* Location */}
          <label className="text-sm font-medium text-gray-700">Location</label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Bangalore"
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition"
            />
          </div>

          {/* Salary */}
          <label className="text-sm font-medium text-gray-700">
            Salary (Annual)
          </label>
          <div className="relative">
            <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="salary"
              placeholder="e.g. ₹5,00,000"
              value={formData.salary}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition"
            />
          </div>

          {/* Job Type */}
          <label className="text-sm font-medium text-gray-700">Job Type</label>
          <select
            name="jobType"
            required
            value={formData.jobType}
            onChange={handleChange}
            className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>

          {/* Description */}
          <label className="text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            required
            placeholder="Describe the role, responsibilities, required skills, etc."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none transition"
          ></textarea>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 bg-[#7315c7] text-white py-3 rounded-xl font-semibold w-full hover:bg-[#9324bc] shadow-lg flex justify-center items-center gap-2 transition disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Submit Job <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
