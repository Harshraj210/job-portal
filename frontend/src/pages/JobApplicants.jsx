import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, UserCircle2, BadgeCheck } from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data || []);
      if (res.data.length > 0) {
        setJobTitle(res.data[0].job?.title || "");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, { status });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status } : app
        )
      );
      toast.success("Application status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Applications for</p>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {jobTitle || "Job"}
              <BadgeCheck className="w-5 h-5 text-[#7315c7]" />
            </h1>
          </div>
          <Link
            to="/recruiter-dashboard"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#7315c7]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No applications received for this job yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
              >
                {/* Applicant Info */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <UserCircle2 className="w-6 h-6 text-[#7315c7]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {app.applicant?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {app.applicant?.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status:{" "}
                      <span className="font-semibold capitalize">
                        {app.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="flex flex-col items-end gap-2">
                  <select
                    value={app.status}
                    disabled={updatingId === app._id}
                    onChange={(e) =>
                      handleStatusChange(app._id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#7315c7]"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {updatingId === app._id && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#7315c7]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
