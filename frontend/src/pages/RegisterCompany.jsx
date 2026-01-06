import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-2xl mx-auto py-14 px-4">
      <h1 className="text-3xl font-bold mb-2">Register Your Company</h1>
      <p className="text-gray-500 mb-8">
        You must register your company before accessing the recruiter dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Google"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Website
          </label>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://company.com"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Logo URL
          </label>
          <input
            type="url"
            name="logo"
            value={form.logo}
            onChange={handleChange}
            placeholder="https://logo.png"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about your company..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#7315c7] hover:bg-purple-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-70"
        >
          {loading ? "Registering..." : "Register Company"}
        </button>
      </form>
    </div>
  );
};

export default RegisterCompany;
