import { useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Edit, Trash2, Loader2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/myjobs");
      console.log("My jobs:", res.data);
      setJobs(res.data);
    } catch {
      toast.error("Failed to load jobs!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">
            Are you sure you want to delete this job?
          </p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/jobs/${id}/delete`);
                  setJobs((prev) => prev.filter((job) => job._id !== id));
                  toast.success("Job deleted successfully!");
                } catch {
                  toast.error("Failed to delete job");
                }
                toast.dismiss(t.id);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-[#7315c7]" />
      </div>
    );

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage My Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No job postings yet.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center border hover:shadow-lg"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 flex gap-2 items-center">
                  <Briefcase className="w-5 h-5 text-[#7315c7]" />
                  {job.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {job.companyName} — {job.jobType}
                </p>
                <p className="text-sm text-gray-400 mt-1">{job.location}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Edit */}
                <button
                  onClick={() => navigate(`/edit-job/${job._id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteJob(job._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
