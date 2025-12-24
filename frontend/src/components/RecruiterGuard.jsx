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
          navigate("/register-company"); // 🚫 BLOCK DASHBOARD
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkCompany();
  }, [navigate]);