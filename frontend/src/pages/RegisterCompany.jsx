import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/company/register", { companyName });
      toast.success("Company registered successfully");
      navigate("/recruiter-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6">Register Your Company</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
          className="w-full border p-3 rounded"
          required
        />

        <button className="bg-[#7315c7] text-white px-6 py-3 rounded">
          Register Company
        </button>
      </form>
    </div>
  );
};

export default RegisterCompany;
