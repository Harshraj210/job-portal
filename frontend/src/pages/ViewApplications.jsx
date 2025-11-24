import { useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, UsersRound } from "lucide-react";

const ViewApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load jobs posted by the recruiter
  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/myjobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to fetch jobs");
    }
  };

  // Load applications for selected job
  const fetchApplications = async (jobId) => {
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
    } catch {
      toast.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      toast.success("Status updated!");
      fetchApplications(selectedJob); // Refresh list
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 px-6 py-20 flex justify-center">
       <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <UsersRound className="w-7 h-7 text-[#7315c7]" />
        Applicant Management
      </h1>

      {/* Job Selector Dropdown */}
      <select
        value={selectedJob}
        onChange={(e) => {
          setSelectedJob(e.target.value);
          fetchApplications(e.target.value);
        }}
        className="p-3 border rounded-xl mb-6 w-full md:w-1/2"
      >
        <option value="">Select a Job</option>
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title}
          </option>
        ))}
      </select>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-10 h-10 text-[#7315c7]" />
        </div>
      )}

      {/* Applicants List */}
      {!loading && applications.length === 0 && selectedJob !== "" && (
        <p className="text-gray-500 text-center">No applications yet.</p>
      )}

      <div className="grid gap-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow-md border flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800">{app.applicant.name}</p>
              <p className="text-sm text-gray-500">{app.applicant.email}</p>
              <p className="text-xs mt-1 text-blue-600">
                Status: {app.status.toUpperCase()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(app._id, "reviewed")}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Shortlist
              </button>
              <button
                onClick={() => updateStatus(app._id, "rejected")}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default ViewApplications;
