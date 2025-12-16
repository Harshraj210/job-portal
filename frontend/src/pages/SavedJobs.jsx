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