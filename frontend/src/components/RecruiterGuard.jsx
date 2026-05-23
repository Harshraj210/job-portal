import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/axios";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/**
 * RecruiterGuard — second-tier guard applied AFTER ProtectedRoute.
 *
 * By the time this runs, ProtectedRoute has already guaranteed:
 *   - Auth is initialised (loading === false)
 *   - user !== null
 *
 * This guard additionally checks:
 *   1. The user's role is "recruiter" (non-recruiters → redirect to home)
 *   2. The recruiter has a registered company (no company → /register-company)
 *      EXCEPT when already on /register-company (avoids infinite loop).
 */
const RecruiterGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const runGuard = async () => {
      // Wait for auth initialisation to finish
      if (authLoading) return;

      // ProtectedRoute should have caught !user, but guard defensively
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // Non-recruiters → home
      if (user.role !== "recruiter") {
        navigate("/", { replace: true });
        return;
      }

      // On the registration page itself — allow through without company check
      if (location.pathname === "/register-company") {
        setChecking(false);
        return;
      }

      // For all other recruiter routes, verify company registration
      try {
        const res = await api.get("/company/check");
        if (!res.data.hasCompany) {
          navigate("/register-company", { replace: true });
          return;
        }
        setChecking(false);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    runGuard();
  }, [user, authLoading, location.pathname, navigate]);

  if (authLoading || checking) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return children;
};

export default RecruiterGuard;
