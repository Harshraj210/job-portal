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
      await api.put(`/applications/${id}/status`, { status });
      toast.success(`Applicant ${status}`);
      fetchApplications(selectedJob); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
      const styles = {
          applied: "bg-yellow-100 text-yellow-800",
          shortlisted: "bg-blue-100 text-blue-800",
          rejected: "bg-red-100 text-red-800",
          hired: "bg-green-100 text-green-800"
      };
      return styles[status] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10">
       <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
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
        className="p-3 border rounded-xl mb-6 w-full md:w-1/2 focus:ring-2 ring-[#7315c7] outline-none"
      >
        <option value="">Select a Job to View Applications</option>
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title} ({job.location})
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
        <p className="text-gray-500 text-center py-10">No applications received yet for this job.</p>
      )}

      {!loading && selectedJob === "" && (
          <p className="text-gray-400 text-center py-10">Please select a job to manage applications.</p>
      )}

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-bold text-lg text-gray-800">{app.applicant.name}</p>
              <p className="text-sm text-gray-500">{app.applicant.email}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                    {app.status}
                </span>
              </div>
            </div>

            {app.status !== "rejected" && app.status !== "hired" && (
                <div className="flex flex-wrap gap-2">
                {app.status === "applied" && (
                    <button
                        onClick={() => updateStatus(app._id, "shortlisted")}
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                        Shortlist
                    </button>
                )}
                
                <button
                    onClick={() => updateStatus(app._id, "hired")}
                    className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                    Hire
                </button>

                <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                    Reject
                </button>
                </div>
            )}
             
            {(app.status === "rejected" || app.status === "hired") && (
                <span className="text-sm text-gray-400 italic">Action completed</span>
            )}

          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default ViewApplications;
