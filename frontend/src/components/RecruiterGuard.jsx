import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { Loader2 } from "lucide-react";

const RecruiterGuard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompany = async () => {
      try {
        const res = await api.get("/company/check");

        if (!res.data.hasCompany) {
          navigate("/register-company");
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkCompany();
  }, [navigate]);
   if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return children;
};

export default RecruiterGuard;