import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/axios";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RecruiterGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const runGuard = async () => {
      // wait for auth
      if (authLoading) return;

      // not logged in
      if (!user) {
        navigate("/login");
        return;
      }

      // not recruiter
      if (user.role !== "recruiter") {
        navigate("/");
        return;
      }

     
      if (location.pathname === "/register-company") {
        setChecking(false);
        return;
      }

      // ALLOW accessing registration page itself
      if (location.pathname === "/register-company") {
        setChecking(false);
        return;
      }

      // Check company status
      try {
        const res = await api.get("/company/check");

        if (!res.data.hasCompany) {
          // If no company, FORCE redirect to register page
          // (User cannot access dashboard until registered)
          navigate("/register-company");
          return;
        }

        setChecking(false);
      } catch {
        navigate("/login");
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
