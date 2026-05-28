import { useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, UsersRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewApplications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/myjobs");
      setJobs(res.data);
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 bg-gray-50">
       <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
        <UsersRound className="w-8 h-8 text-[#7315c7]" />
        Applicant Management
      </h1>
      <p className="text-gray-500 mb-8 font-medium">Select a job below to open the ATS Dashboard and review your candidates.</p>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-10 h-10 text-[#7315c7]" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <button
              key={job._id}
              onClick={() => navigate(`/job-applicants/${job._id}`)}
              className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-[#7315c7] hover:shadow-md transition-all text-left group"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#7315c7] transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{job.location} • {job.jobType}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-[#7315c7] transition-colors">
                <ArrowRight className="w-5 h-5 text-[#7315c7] group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default ViewApplications;
