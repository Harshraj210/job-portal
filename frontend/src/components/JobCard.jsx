import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

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
    <div className="bg-white p-6 rounded-xl shadow border">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p className="text-gray-500">{job.location}</p>
      <p className="mt-2">{job.description}</p>

      {user?.role === "applicant" && (
        <button
          onClick={toggleSave}
          className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-lg text-[#7315c7]"
        >
          {saved ? <BookmarkCheck /> : <Bookmark />}
          {saved ? "Saved" : "Save Job"}
        </button>
      )}
    </div>
  );
};

export default JobCard;
