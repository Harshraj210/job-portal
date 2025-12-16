import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { user } = useAuth();

  const toggleSave = async () => {
    try {
      await api.post(`/jobs/${job._id}/save`);
      toast.success("Job saved!");
    } catch {
      toast.error("Failed to save job");
    }
  };