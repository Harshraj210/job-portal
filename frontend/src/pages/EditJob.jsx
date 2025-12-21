import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    companyName: "",
    companyLogo: "",
    location: "",
    salary: "",
    jobType: "",
  });


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);

        // map only required fields
        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          companyName: res.data.companyName || "",
          companyLogo: res.data.companyLogo || "",
          location: res.data.location || "",
          salary: res.data.salary || "",
          jobType: res.data.jobType || "",
        });
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/jobs/${id}/update`, form);
      toast.success("Job updated successfully");
      navigate("/recruiter-dashboard/manage-jobs");
    } catch {
      toast.error("Failed to update job");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Job</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* JOB TITLE */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Job Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            rows="4"
          />
        </div>

        {/* COMPANY NAME */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Company Name
          </label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* COMPANY LOGO */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Company Logo URL
          </label>
          <input
            name="companyLogo"
            value={form.companyLogo}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* SALARY */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Salary (LPA / Monthly)
          </label>
          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />
        </div>

        {/* JOB TYPE */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Job Type
          </label>
          <select
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="bg-[#7315c7] text-white px-6 py-3 rounded hover:bg-purple-700"
        >
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
