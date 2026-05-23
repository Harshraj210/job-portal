import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * ProtectedRoute — wraps pages that require authentication.
 *
 * Behaviour:
 *  - While auth is initialising (loading === true): show a full-screen spinner
 *    so the user never sees a flash of the login page before the token is read.
 *  - If no authenticated user: redirect to /login, preserving the attempted
 *    URL in `location.state.from` so Login can bounce back after success.
 *  - If authenticated: render children normally.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
