import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, UserCircle2, BadgeCheck, MessageSquare, X } from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data || []);
      if (res.data.length > 0) {
        setJobTitle(res.data[0].job?.title || "");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load applications");
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
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );

      toast.success(`Application status updated to ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewProfile = async (app) => {
      // If status is pending, mark as viewed automatically
      if(app.status === 'pending') {
          handleStatusChange(app._id, 'viewed');
      }
      // Ideally this would open a modal with resume or navigate to profile
      // For now we just ensure status updates
      if(app.resume) {
          const resumeUrl = typeof app.resume === 'string' ? app.resume : app.resume.url;
          if(resumeUrl) {
               window.open(`http://localhost:5000${resumeUrl}`, '_blank');
          } else {
               toast("No resume available", {icon: "ℹ️"});
          }
      } else {
          toast("No resume available", {icon: "ℹ️"});
      }
  };

  const openMessageModal = (appId) => {
      setSelectedAppId(appId);
      setMessageText("");
      setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
      if(!messageText.trim()) return;
      setSendingMessage(true);
      try {
          await api.post(`/applications/${selectedAppId}/message`, { message: messageText });
          toast.success("Message sent successfully");
          setShowMessageModal(false);
          // Update local state if needed
          setApplications(prev => prev.map(app => 
              app._id === selectedAppId ? {...app, recruiterMessage: messageText} : app
          ));
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send message");
      } finally {
          setSendingMessage(false);
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

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
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all gap-4"
              >
                {/* Applicant Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <UserCircle2 className="w-7 h-7 text-[#7315c7]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {app.applicant?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.applicant?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize border ${
                            app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            app.status === 'viewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            app.status === 'shortlisted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            app.status === 'selected' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-red-50 text-red-700 border-red-200'
                        }`}>
                            {app.status}
                        </span>
                        {app.recruiterMessage && (
                            <span className="text-xs text-gray-400 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                                <MessageSquare className="w-3 h-3" /> Message Sent
                            </span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => handleViewProfile(app)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View Resume
                    </button>
                    
                    <button 
                         onClick={() => openMessageModal(app._id)}
                         className="px-3 py-1.5 text-sm font-medium text-[#7315c7] bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1"
                    >
                        <MessageSquare className="w-4 h-4" /> Message
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

                    {app.status !== 'shortlisted' && app.status !== 'selected' && app.status !== 'rejected' && (
                        <button
                            onClick={() => handleStatusChange(app._id, 'shortlisted')}
                            disabled={updatingId === app._id}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-[#7315c7] rounded-lg hover:bg-[#5f11a6] transition-colors disabled:opacity-50"
                        >
                            Shortlist
                        </button>
                    )}

                    {app.status === 'shortlisted' && (
                        <button
                            onClick={() => handleStatusChange(app._id, 'selected')}
                            disabled={updatingId === app._id}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            Select
                        </button>
                    )}
                    
                    {app.status !== 'rejected' && app.status !== 'selected' && (
                         <button
                            onClick={() => handleStatusChange(app._id, 'rejected')}
                            disabled={updatingId === app._id}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            Reject
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900">Send Message to Applicant</h3>
                      <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6">
                      <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7315c7] resize-none text-gray-700 bg-gray-50/50"
                      />
                      <div className="flex justify-end gap-3 mt-6">
                          <button 
                              onClick={() => setShowMessageModal(false)}
                              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleSendMessage}
                              disabled={sendingMessage || !messageText.trim()}
                              className="px-4 py-2 text-sm font-medium text-white bg-[#7315c7] hover:bg-[#5f11a6] rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                              {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                              Send Message
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default JobApplicants;
