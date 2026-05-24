import { Bookmark, BookmarkCheck, MapPin, Clock, Briefcase, IndianRupee } from "lucide-react";
import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(user?.savedJobs?.includes(job._id) || false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const navigate = useNavigate();

  const toggleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
        toast.error("Please login to save jobs");
        return;
    }
    
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
  
  const handleApply = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!user) {
          navigate("/login");
          return;
      }
      
      setIsApplying(true);
      try {
        await api.post(`/applications/${job._id}`);
        toast.success("Application submitted successfully!");
        setHasApplied(true);
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase().includes('already applied')) {
            setHasApplied(true);
        }
        toast.error(error.response?.data?.message || "Application failed");
      } finally {
        setIsApplying(false);
      }
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
             {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
             ) : (
                <span className="text-xl font-bold text-gray-400">{job.companyName?.[0]}</span>
             )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#7315c7] transition-colors line-clamp-1">
                {job.title}
            </h3>
            <p className="text-sm font-medium text-gray-500">{job.companyName}</p>
          </div>
        </div>
        
        {user?.role === "applicant" && (
            <button
            onClick={toggleSave}
            className="text-gray-400 hover:text-[#7315c7] transition-colors"
            >
            {saved ? <BookmarkCheck className="text-[#7315c7]" /> : <Bookmark />}
            </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
             <MapPin size={16} />
             <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
             <Briefcase size={16} />
             <span>{job.jobType}</span>
          </div>
           <div className="flex items-center gap-2 text-sm text-gray-600">
             <IndianRupee size={16} />
             <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
            <Clock size={14} />
            <span>Posted {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : "recently"}</span>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
         <Link 
            to={`/jobs/${job._id}`}
            className="flex items-center justify-center px-4 py-2 border border-blue-100 text-[#7315c7] bg-purple-50 rounded-lg hover:bg-purple-100 font-medium transition-colors"
         >
            View Details
         </Link>
         <button 
           onClick={handleApply}
           disabled={isApplying || hasApplied || user?.role === 'recruiter'}
           className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
             hasApplied || user?.role === 'recruiter' 
               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
               : 'bg-[#7315c7] text-white hover:bg-[#5e11a3] shadow-purple-200'
           } disabled:opacity-70 flex justify-center items-center`}
         >
            {isApplying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
         </button>
      </div>
    </div>
  );
};

export default JobCard;
