import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";
import toast from "react-hot-toast";

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/jobs/${job._id}/unsave`);
        toast.success("Removed from saved jobs");
      } else {
        await api.post(`/jobs/${job._id}/save`);
        toast.success("Job saved");
      }
      setSaved(!saved);
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="job-card">
      {/* job details */}

      {user?.role === "applicant" && (
        <button
          onClick={toggleSave}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg text-[#7315c7]"
        >
          {saved ? <BookmarkCheck /> : <Bookmark />}
          {saved ? "Saved" : "Save Job"}
        </button>
      )}
    </div>
  );
};
