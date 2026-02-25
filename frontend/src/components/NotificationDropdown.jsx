import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import api from "../lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InterviewDetailModal from "./InterviewDetailModal";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Interview type → open detail modal
    if (notification.type === "interview") {
      const interviewId = notification.interviewId?._id || notification.interviewId;
      if (interviewId) {
        setIsOpen(false);
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

    setIsOpen(false);

    // Navigate based on type
    if (notification.type === "application" && notification.relatedJob) {
      if (user?.role === "recruiter") {
        const jobId = notification.relatedJob._id || notification.relatedJob;
        navigate(`/job-applicants/${jobId}`);
      }
    }
    if (notification.type === "status-update") {
      navigate("/applications");
    }
  };

  // ── notification icon per type ─────────────────────────────────────────────
  const typeIcon = (type) => {
    switch (type) {
      case "interview":  return "📅";
      case "application": return "📄";
      case "status-update": return "✅";
      case "info":      return "💬";
      default:          return "🔔";
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell button */}
        <button
          onClick={handleToggle}
          className="relative p-2 text-gray-600 hover:text-[#7315c7] transition-colors rounded-full hover:bg-purple-50"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-xs bg-[#7315c7] text-white px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-[#7315c7] hover:underline"
                >
                  View all
                </Link>
                {/* ── Close button ── */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.type === "interview"
                          ? "border-l-4 border-[#7315c7] bg-purple-50/60 hover:bg-purple-50"
                          : !notification.isRead
                          ? "bg-purple-50/30"
                          : ""
                      }`}
                    >
                      <p
                        className={`text-sm flex items-start gap-2 ${
                          !notification.isRead
                            ? "font-semibold text-gray-800"
                            : "text-gray-600"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {typeIcon(notification.type)}
                        </span>
                        <span>{notification.message}</span>
                      </p>
                      {notification.type === "interview" && (
                        <p className="text-xs text-[#7315c7] mt-1 ml-6 font-medium">
                          Tap to view details →
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 ml-6">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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

export default NotificationDropdown;
