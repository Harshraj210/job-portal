import { useEffect, useState } from "react";
import api from "../lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Bell, CheckCheck, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    // Navigate based on type
    if (notification.type === "application" && notification.relatedJob) {
       // If recruiter, go to applicants page
       if (user.role === 'recruiter') {
           navigate(`/job-applicants/${notification.relatedJob._id || notification.relatedJob}`);
       }
    }
    // If applicant, maybe go to my-applications? 
    if (notification.type === "status-update") {
        navigate("/applications");
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
                    !notification.isRead ? "bg-purple-50/40" : ""
                  }`}
                >
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      !notification.isRead ? "bg-[#7315c7]" : "bg-transparent"
                  }`} />
                  
                  <div className="flex-1">
                    <p className={`text-base ${!notification.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => deleteNotification(notification._id, e)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
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
  );
};

export default Notifications;
