import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, ArrowLeft, UserCircle2, BadgeCheck, MessageSquare, X,
  Search, Filter, MapPin, Briefcase, GraduationCap, Download, ExternalLink,
  FileText, CheckCircle2, XCircle, Clock
} from "lucide-react";

// Env-aware backend base URL
const BACKEND_URL = (
  import.meta.env.VITE_API_URL || "https://job-portal-backend-3l3e.onrender.com/api"
).replace(/\/api$/, "");

const STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  viewed: "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
  selected: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [selectedApplicant, setSelectedApplicant] = useState(null); // Full Profile
  const [resumeUrl, setResumeUrl] = useState(null); // Resume Viewer

  const fetchApplications = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data || []);
      if (res.data.length > 0) {
        setJobTitle(res.data[0].job?.title || "");
      } else {
        try {
          const jobRes = await api.get(`/jobs/${jobId}`);
          setJobTitle(jobRes.data?.title || "");
        } catch { }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );
      toast.success(`Applicant marked as ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewProfile = (app) => {
    if (app.status === "pending") {
      handleStatusChange(app._id, "viewed");
    }
    setSelectedApplicant(app);
  };

  const handleViewResume = (app) => {
    if (app.status === "pending") {
      handleStatusChange(app._id, "viewed");
    }
    const path = typeof app.resume === "string" ? app.resume : app.resume?.url;
    if (path) {
      const url = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
      setResumeUrl(url);
    } else {
      toast("No resume available", { icon: "ℹ️" });
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = app.applicant?.name?.toLowerCase().includes(searchLower) || false;
      const emailMatch = app.applicant?.email?.toLowerCase().includes(searchLower) || false;
      const skillsMatch = app.applicant?.profile?.skills?.toLowerCase().includes(searchLower) || false;
      
      const matchesSearch = nameMatch || emailMatch || skillsMatch;
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  // Lock body scroll when a modal is open
  useEffect(() => {
    if (selectedApplicant || resumeUrl) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedApplicant, resumeUrl]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] pb-20">
      
      {/* ── ATS STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm pt-20 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <Link to="/recruiter-dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#7315c7] mb-3 transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                {jobTitle || "Job Applications"}
                <span className="text-sm font-semibold bg-purple-100 text-[#7315c7] px-3 py-1 rounded-full border border-purple-200">
                  {applications.length} Candidates
                </span>
              </h1>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by name, email, or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7315c7]/20 focus:border-[#7315c7] transition-all text-sm font-medium"
              />
            </div>
            <div className="relative w-full sm:w-48 shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7315c7]/20 focus:border-[#7315c7] transition-all text-sm font-medium appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="selected">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── APPLICANTS LIST ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <UserCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No candidates found</h3>
            <p className="text-gray-500 text-sm">Adjust your search or wait for new applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredApplications.map((app, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={app._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:border-[#7315c7]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  
                  {/* Left: Applicant Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={app.applicant?.profilePicture || `https://ui-avatars.com/api/?name=${app.applicant?.name}&background=f3e8ff&color=7315c7`} 
                      alt={app.applicant?.name}
                      className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-none">{app.applicant?.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${STATUS_COLORS[app.status]}`}>
                          {app.status === "selected" ? "Hired" : app.status}
                        </span>
                      </div>
                      
                      <div className="text-sm font-medium text-gray-500 mb-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>{app.applicant?.email}</span>
                        {app.applicant?.phoneNumber && <span>• {app.applicant?.phoneNumber}</span>}
                      </div>

                      {/* Skills Preview */}
                      {app.applicant?.profile?.skills && (
                        <div className="flex flex-wrap gap-1">
                          {app.applicant.profile.skills.split(',').slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              {skill.trim()}
                            </span>
                          ))}
                          {app.applicant.profile.skills.split(',').length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-xs font-medium">
                              +{app.applicant.profile.skills.split(',').length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle: Application Date & Resume */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 px-4 md:border-l md:border-gray-100 shrink-0">
                     <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> Applied {new Date(app.createdAt).toLocaleDateString()}
                     </p>
                     <button 
                       onClick={() => handleViewResume(app)}
                       className="text-sm font-bold text-[#7315c7] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                     >
                       <FileText size={16} />
                       View Resume
                     </button>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 md:pl-4 shrink-0">
                    <button 
                      onClick={() => handleViewProfile(app)}
                      className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                      View Profile
                    </button>
                    
                    {app.status !== 'shortlisted' && app.status !== 'selected' && app.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(app._id, 'shortlisted')}
                        disabled={updatingId === app._id}
                        className="px-4 py-2 text-sm font-bold text-[#7315c7] bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 hover:border-purple-300 transition-all shadow-sm disabled:opacity-50"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status === 'shortlisted' && (
                      <button
                        onClick={() => handleStatusChange(app._id, 'selected')}
                        disabled={updatingId === app._id}
                        className="px-4 py-2 text-sm font-bold text-white bg-[#10b981] border border-[#059669] rounded-xl hover:bg-[#059669] transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        <CheckCircle2 size={16} /> Hire
                      </button>
                    )}
                    
                    {app.status !== 'rejected' && app.status !== 'selected' && (
                      <button
                        onClick={() => handleStatusChange(app._id, 'rejected')}
                        disabled={updatingId === app._id}
                        className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── FULL PROFILE MODAL ── */}
      <AnimatePresence>
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-end sm:justify-center p-0 sm:p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-2xl h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Applicant Profile</h2>
                <button onClick={() => setSelectedApplicant(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="flex items-center gap-5 mb-8">
                  <img 
                    src={selectedApplicant.applicant?.profilePicture || `https://ui-avatars.com/api/?name=${selectedApplicant.applicant?.name}&background=f3e8ff&color=7315c7`} 
                    alt={selectedApplicant.applicant?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">{selectedApplicant.applicant?.name}</h1>
                    <p className="text-gray-500 font-medium">{selectedApplicant.applicant?.email}</p>
                    {selectedApplicant.applicant?.phoneNumber && (
                      <p className="text-gray-500 font-medium">{selectedApplicant.applicant?.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  {selectedApplicant.applicant?.profile?.bio && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <UserCircle2 size={16} className="text-[#7315c7]" /> Bio
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {selectedApplicant.applicant.profile.bio}
                      </p>
                    </section>
                  )}

                  {selectedApplicant.applicant?.profile?.skills && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BadgeCheck size={16} className="text-[#7315c7]" /> Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.applicant.profile.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-50 text-[#7315c7] border border-purple-100 rounded-lg text-sm font-bold">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedApplicant.applicant?.profile?.experience && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#7315c7]" /> Experience
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {selectedApplicant.applicant.profile.experience}
                      </p>
                    </section>
                  )}

                  {selectedApplicant.applicant?.profile?.education && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <GraduationCap size={16} className="text-[#7315c7]" /> Education
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        {selectedApplicant.applicant.profile.education}
                      </p>
                    </section>
                  )}
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setSelectedApplicant(null)} className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors">
                  Close
                </button>
                <button 
                  onClick={() => {
                    handleViewResume(selectedApplicant);
                  }}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#7315c7] rounded-xl hover:bg-[#6011a6] transition-colors shadow-sm flex items-center gap-2"
                >
                  <FileText size={16} /> Open Resume
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── RESUME VIEWER MODAL ── */}
      <AnimatePresence>
        {resumeUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-8 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-5xl h-full sm:h-[95vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            >
              {/* Resume Header */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#7315c7]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Resume Preview</h2>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#7315c7] bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <ExternalLink size={16} /> Open in new tab
                  </a>
                  <a 
                    href={resumeUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Download size={16} /> <span className="hidden sm:inline">Download</span>
                  </a>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button 
                    onClick={() => setResumeUrl(null)} 
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Resume Body */}
              <div className="flex-1 bg-gray-100 overflow-hidden relative">
                {/* Fallback if iframe fails to load */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
                   <FileText className="w-16 h-16 text-gray-300 mb-4" />
                   <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Viewer Loading...</h3>
                   <p className="text-gray-500 max-w-md mb-6">If the PDF doesn't display automatically, you can open it in a new tab or download it directly.</p>
                   <div className="flex gap-4">
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#7315c7] text-white font-bold rounded-xl hover:bg-[#6011a6] shadow-sm">Open in New Tab</a>
                   </div>
                </div>
                
                {/* Embedded PDF */}
                <iframe 
                  src={`${resumeUrl}#toolbar=0`} 
                  className="relative z-10 w-full h-full border-none bg-white"
                  title="Resume Viewer"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default JobApplicants;
