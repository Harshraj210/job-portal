import { useEffect, useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, BookmarkX } from "lucide-react";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/jobs/saved");
      setJobs(res.data);
    } catch {
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const unsaveJob = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/unsave`);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job removed from saved");
    } catch {
      toast.error("Failed to unsave job");
    }
  };
    if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-[#7315c7]" />
      </div>
    );
    return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Saved Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No saved jobs yet.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="relative">
              <JobCard job={job} />

              <button
                onClick={() => unsaveJob(job._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                title="Remove from saved"
              >
                <BookmarkX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;