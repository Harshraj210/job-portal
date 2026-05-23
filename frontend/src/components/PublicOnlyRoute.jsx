import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * PublicOnlyRoute — wraps pages that should NOT be accessible when logged in
 * (i.e., /login, /register, /forgot-password).
 *
 * Behaviour:
 *  - While auth is initialising: show a full-screen spinner to prevent flicker.
 *  - If already authenticated: redirect away to the page the user was trying to
 *    reach originally (state.from), or fall back to the home dashboard "/".
 *  - If not authenticated: render children normally.
 */
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  if (user) {
    const destination = location.state?.from?.pathname || "/";
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
