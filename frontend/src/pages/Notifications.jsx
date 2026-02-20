import { useEffect, useState } from "react";
import api from "../lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Bell, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InterviewDetailModal from "../components/InterviewDetailModal";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Interview type → open detail modal
    if (notification.type === "interview") {
      const interviewId = notification.interviewId?._id || notification.interviewId;
      if (interviewId) {
        setInterviewDetails(null);
        setShowInterviewModal(true);
        setInterviewLoading(true);
        try {
          const res = await api.get(`/interviews/${interviewId}`);
          setInterviewDetails(res.data);
        } catch (err) {
          console.error("Failed to fetch interview details", err);
        } finally {
          setInterviewLoading(false);
        }
        return;
      }
    }

    // Navigate based on type
    if (notification.type === "application" && notification.relatedJob) {
      if (user?.role === "recruiter") {
        navigate(`/job-applicants/${notification.relatedJob._id || notification.relatedJob}`);
      }
    }
    if (user?.role !== "recruiter" && (notification.type === "status-update" || notification.type === "info")) {
      navigate("/applications");
    }
  };

  // ── notification icon per type ─────────────────────────────────────────────
  const typeIcon = (type) => {
    switch (type) {
      case "interview":     return "📅";
      case "application":   return "📄";
      case "status-update": return "✅";
      case "info":          return "💬";
      default:              return "🔔";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#7315c7]" />
              Notifications
            </h1>
            <button
              onClick={fetchNotifications}
              className="text-sm text-[#7315c7] hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-start gap-4 ${
                      notification.type === "interview"
                        ? "border-l-4 border-[#7315c7] bg-purple-50/40 hover:bg-purple-50"
                        : !notification.isRead
                        ? "bg-purple-50/40"
                        : ""
                    }`}
                  >
                    {/* Unread dot */}
                    <div
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        !notification.isRead ? "bg-[#7315c7]" : "bg-transparent"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-base flex items-start gap-2 ${
                          !notification.isRead
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="shrink-0">{typeIcon(notification.type)}</span>
                        <span>{notification.message}</span>
                      </p>
                      {notification.type === "interview" && (
                        <p className="text-xs text-[#7315c7] mt-1 font-medium ml-6">
                          Click to view full details →
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1 ml-6">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    <button
                      onClick={(e) => deleteNotification(notification._id, e)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interview Detail Modal */}
      {showInterviewModal && (
        <InterviewDetailModal
          data={interviewDetails}
          loading={interviewLoading}
          onClose={() => {
            setShowInterviewModal(false);
            setInterviewDetails(null);
          }}
        />
      )}
    </>
  );
};

export default Notifications;
