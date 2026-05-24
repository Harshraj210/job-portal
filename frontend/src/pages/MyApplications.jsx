import { useEffect, useState } from "react";
import api from "../lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Briefcase, MapPin, AlertCircle, FileText } from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        // API always returns an array now (findOne → find fix in backend)
        setApplications(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "shortlisted": return "bg-blue-100 text-blue-700 border-blue-200";
      case "rejected":    return "bg-red-100 text-red-700 border-red-200";
      case "selected":    return "bg-green-100 text-green-700 border-green-200";
      case "viewed":      return "bg-purple-100 text-purple-700 border-purple-200";
      case "pending":
      default:            return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
        <p className="text-sm text-gray-500">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 px-4">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-gray-700 font-medium text-center">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); }}
          className="px-5 py-2 bg-[#7315c7] text-white text-sm font-semibold rounded-xl hover:bg-[#6412b5] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
      <p className="text-gray-500 text-sm mb-6">
        {applications.length === 0
          ? "No applications yet"
          : `${applications.length} application${applications.length !== 1 ? "s" : ""} submitted`}
      </p>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-[#7315c7]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No applications yet</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Browse jobs and submit your first application to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-sm w-2/5">Job & Company</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-sm">Location</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-sm">Applied</th>
                  <th className="px-5 py-4 font-semibold text-gray-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 align-top">
                      <div className="font-semibold text-gray-900 text-sm">{app.job?.title || "Unknown Role"}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{app.job?.companyName || "—"}</div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {app.job?.location || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold w-fit border capitalize ${getStatusStyle(app.status)}`}>
                          {app.status}
                        </span>
                        {app.recruiterMessage && (
                          <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-xs text-gray-700">
                            <span className="font-semibold text-[#7315c7] block mb-0.5">Recruiter Message:</span>
                            {app.recruiterMessage}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className="sm:hidden space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#7315c7]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{app.job?.title || "Unknown Role"}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{app.job?.companyName || "—"}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border capitalize flex-shrink-0 ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {app.job?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {app.job.location}
                    </span>
                  )}
                  <span>{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                </div>
                {app.recruiterMessage && (
                  <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2 text-xs text-gray-700">
                    <span className="font-semibold text-[#7315c7] block mb-0.5">Recruiter Message:</span>
                    {app.recruiterMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyApplications;
