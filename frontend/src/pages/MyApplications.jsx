import { useEffect, useState } from "react";
import api from "../lib/axios";
import { formatDistanceToNow } from "date-fns";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
      switch(status) {
          case 'shortlisted': return 'bg-blue-100 text-blue-700';
          case 'rejected': return 'bg-red-100 text-red-700';
          case 'hired': return 'bg-green-100 text-green-700';
          default: return 'bg-yellow-100 text-yellow-700';
      }
  };

  if (loading) return <div className="text-center mt-20">Loading applications...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      
      {applications.length === 0 ? (
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
      ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                      <tr>
                          <th className="p-4 font-semibold text-gray-600">Job Title</th>
                          <th className="p-4 font-semibold text-gray-600">Company</th>
                          <th className="p-4 font-semibold text-gray-600">Applied On</th>
                          <th className="p-4 font-semibold text-gray-600">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y">
                      {applications.map((app) => (
                          <tr key={app._id} className="hover:bg-gray-50">
                              <td className="p-4 font-medium">{app.job?.title}</td>
                              <td className="p-4 text-gray-600">{app.job?.companyName}</td>
                              <td className="p-4 text-gray-500 text-sm">
                                  {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                              </td>
                              <td className="p-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)} capitalize`}>
                                      {app.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  );
};

export default MyApplications;
