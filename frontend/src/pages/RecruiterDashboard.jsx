import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import { Loader2, PlusCircle, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const [hasCompany, setHasCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const checkCompany = async () => {
      try {
        const res = await api.get("/company/check");
        setHasCompany(res.data.hasCompany);
      } catch (error) {
        console.error("Failed to check company status", error);
        setHasCompany(false);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "recruiter") {
      checkCompany();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-6 py-20 flex justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Recruiter Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-600 mb-8">
          Welcome back,{" "}
          <span className="font-bold text-blue-600">{user?.name}</span>!
        </p>

        {!hasCompany ? (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Register Your Company
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              To start posting jobs and managing applications, you first need to
              register your company profile.
            </p>
            <Link
              to="/register-company"
              className="inline-flex items-center px-6 py-3 bg-[#7315c7] text-white font-semibold rounded-lg hover:bg-[#5e11a3] transition-colors shadow-lg shadow-purple-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Register Company
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/recruiter-dashboard/post-job">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="font-bold text-xl text-blue-700 mb-2">
                  Post a New Job
                </h3>
                <p className="text-sm text-gray-600">
                  Create listings to find the perfect candidate for your open
                  roles.
                </p>
              </div>
            </Link>

            <Link to="/recruiter-dashboard/manage-jobs">
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-100 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="font-bold text-xl text-purple-700 mb-2">
                  Manage Jobs
                </h3>
                <p className="text-sm text-gray-600">
                  Edit or remove job listings you have posted.
                </p>
              </div>
            </Link>
            <Link to="/recruiter-dashboard/applications">
              <div className="p-6 bg-green-50 rounded-lg border border-green-100 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="font-bold text-xl text-green-700 mb-2">
                  View Applications
                </h3>
                <p className="text-sm text-gray-600">
                  Review resumes and manage the status of your applicants.
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
