import React, { useState, useEffect, useRef } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { 
  Loader2, User, FileText, Upload, Trash2, Eye, RefreshCw, AlertCircle,
  Briefcase, GraduationCap, MapPin, Edit2, Plus, Calendar, CheckCircle2, Save, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = (import.meta.env.VITE_API_URL || "https://job-portal-backend-3l3e.onrender.com/api").replace(/\/api$/, "");

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const Profile = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    designation: "",
    country: "",
    city: "",
    dateOfBirth: "",
    gender: "",
    locationPreference: "On Site", // 'On Site', 'Remote', 'Hybrid'
    skills: [],
    experience: [],
    education: []
  });

  const [newSkill, setNewSkill] = useState("");
  
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({ title: "", company: "", duration: "", type: "" });

  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({ institution: "", degree: "", year: "", specialization: "" });

  const fetchProfile = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
      parseAndSetFormData(res.data);
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      const msg = error.response?.data?.message || error.message || "Failed to load profile";
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const parseAndSetFormData = (userData) => {
    const profile = userData.profile || {};
    
    // Parse Skills
    let parsedSkills = [];
    try {
        parsedSkills = profile.skills ? JSON.parse(profile.skills) : [];
        if (!Array.isArray(parsedSkills)) {
            parsedSkills = profile.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
    } catch (e) {
        parsedSkills = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    }

    // Parse Experience
    let parsedExperience = [];
    try {
        parsedExperience = profile.experience ? JSON.parse(profile.experience) : [];
        if (!Array.isArray(parsedExperience)) parsedExperience = [];
    } catch (e) {
        if (profile.experience && profile.experience.trim() !== "") {
            parsedExperience = [{ id: Date.now(), title: 'Experience', company: profile.experience, duration: '', type: '' }];
        }
    }

    // Parse Education
    let parsedEducation = [];
    try {
        parsedEducation = profile.education ? JSON.parse(profile.education) : [];
        if (!Array.isArray(parsedEducation)) parsedEducation = [];
    } catch (e) {
         if (profile.education && profile.education.trim() !== "") {
            parsedEducation = [{ id: Date.now(), institution: profile.education, degree: '', year: '', specialization: '' }];
        }
    }

    // Parse Qualifications for extra details
    let parsedQuals = {};
    try {
        parsedQuals = profile.qualifications ? JSON.parse(profile.qualifications) : {};
    } catch (e) {
        parsedQuals = { designation: profile.qualifications || '' };
    }

    setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        designation: parsedQuals.designation || "",
        country: parsedQuals.country || "",
        city: parsedQuals.city || "",
        dateOfBirth: parsedQuals.dateOfBirth || "",
        gender: parsedQuals.gender || "",
        locationPreference: parsedQuals.locationPreference || "On Site",
        skills: parsedSkills,
        experience: parsedExperience,
        education: parsedEducation
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bio: user.profile?.bio || "",
        skills: JSON.stringify(formData.skills),
        experience: JSON.stringify(formData.experience),
        education: JSON.stringify(formData.education),
        qualifications: JSON.stringify({
            designation: formData.designation,
            country: formData.country,
            city: formData.city,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            locationPreference: formData.locationPreference
        })
      };

      const res = await api.put("/auth/profile", updatedData);
      setUser(res.data.user);
      parseAndSetFormData(res.data.user);
      setEditMode(false);
      toast.success("Profile Updated Successfully 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
          if (selectedFile.size > 2 * 1024 * 1024) {
              toast.error("File size must be less than 2MB");
              return;
          }
          if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
              toast.error("Only PDF, DOC, DOCX allowed");
              return;
          }
          setFile(selectedFile);
          handleUpload(selectedFile);
      }
  };

  const handleUpload = async (fileToUpload) => {
      if (!fileToUpload) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", fileToUpload);

      try {
          const res = await api.post("/auth/upload-resume", formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });
          setUser(res.data.user);
          toast.success("Resume uploaded successfully");
          setFile(null);
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to upload resume");
      } finally {
          setUploading(false);
          if(fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  const confirmDeleteResume = async () => {
      try {
          const res = await api.delete("/auth/delete-resume");
          setUser(res.data.user);
          toast.success("Resume deleted successfully");
          setShowDeleteModal(false);
      } catch (error) {
          toast.error("Failed to delete resume");
      }
  };

  // Add/Remove Helpers
  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };
  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addExperience = () => {
    if (!newExp.title || !newExp.company) {
      toast.error("Title and Company are required");
      return;
    }
    setFormData({
      ...formData,
      experience: [...formData.experience, { ...newExp, id: Date.now() }]
    });
    setNewExp({ title: "", company: "", duration: "", type: "" });
    setShowAddExp(false);
  };
  const removeExperience = (id) => {
    setFormData({ ...formData, experience: formData.experience.filter(e => e.id !== id) });
  };

  const addEducation = () => {
    if (!newEdu.institution || !newEdu.degree) {
      toast.error("Institution and Degree are required");
      return;
    }
    setFormData({
      ...formData,
      education: [...formData.education, { ...newEdu, id: Date.now() }]
    });
    setNewEdu({ institution: "", degree: "", year: "", specialization: "" });
    setShowAddEdu(false);
  };
  const removeEducation = (id) => {
    setFormData({ ...formData, education: formData.education.filter(e => e.id !== id) });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-3 bg-gray-50/50">
        <Loader2 className="animate-spin w-10 h-10 text-purple-600" />
        <p className="text-sm font-medium text-gray-500">Loading your profile dashboard...</p>
      </div>
    );

  if (fetchError || !user)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4 bg-gray-50/50">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-gray-700 font-medium text-center">{fetchError || "Could not load profile"}</p>
        <button
          onClick={fetchProfile}
          className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
        >
          Retry Connection
        </button>
      </div>
    );

  const profile = user.profile || {};

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 pt-6 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* LEFT SIDEBAR */}
        <motion.div variants={itemVariants} className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="h-28 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center text-purple-600">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-purple-400" />
                  )}
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6 text-center border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-sm font-medium text-purple-600 mt-1">{formData.designation || "Add your designation"}</p>
            </div>
            
            {/* Sidebar Summaries */}
            <div className="p-6 space-y-6 bg-gray-50/30">
              
              {/* Experience Summary */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" /> Experience
                </h3>
                <div className="space-y-4">
                  {formData.experience.length > 0 ? formData.experience.slice(0,2).map((exp) => (
                    <div key={exp.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 mt-0.5">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{exp.title}</p>
                        <p className="text-xs text-gray-500">{exp.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{exp.duration}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic">No experience added.</p>
                  )}
                </div>
              </div>

              {/* Education Summary */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-orange-500" /> Education
                </h3>
                <div className="space-y-4">
                  {formData.education.length > 0 ? formData.education.slice(0,2).map((edu) => (
                    <div key={edu.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-orange-600 mt-0.5">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.degree}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{edu.year}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic">No education added.</p>
                  )}
                </div>
              </div>

              {/* Skills Summary */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? formData.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-full shadow-sm">
                      {skill}
                    </span>
                  )) : (
                    <p className="text-xs text-gray-400 italic">No skills added.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* MAIN CONTENT AREA */}
        <motion.div variants={itemVariants} className="flex-1 flex flex-col gap-6">
          
          {/* Header Actions */}
          <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl">
               <button className="px-6 py-2 bg-white shadow-sm text-sm font-semibold text-purple-700 rounded-lg">Personal Details</button>
               {/* Could add 'Settings' tab here if needed in future */}
            </div>
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-100"
              >
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setEditMode(false); parseAndSetFormData(user); }}
                  className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors shadow-md shadow-purple-200 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Personal Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Info</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                  {editMode ? (
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.name || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Designation</label>
                  {editMode ? (
                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.designation || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                  {editMode ? (
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.phoneNumber || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                  {editMode ? (
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.email || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Country</label>
                  {editMode ? (
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.country || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City</label>
                  {editMode ? (
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.city || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</label>
                  {editMode ? (
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900" />
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.dateOfBirth || "-"}</div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</label>
                  {editMode ? (
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm font-medium text-gray-900">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="py-2.5 px-4 bg-gray-50/50 rounded-xl border border-transparent text-sm font-medium text-gray-900">{formData.gender || "-"}</div>
                  )}
                </div>
             </div>
          </div>

          {/* Location Preference */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h3 className="text-lg font-bold text-gray-900">Location Preference</h3>
             <div className="flex gap-4">
               {['On Site', 'Remote', 'Hybrid'].map((type) => (
                 <label key={type} className={`flex items-center gap-2 cursor-pointer ${!editMode && 'pointer-events-none'}`}>
                   <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.locationPreference === type ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                     {formData.locationPreference === type && <CheckCircle2 className="w-3 h-3 text-white" />}
                   </div>
                   <input 
                     type="radio" 
                     name="locationPreference" 
                     value={type} 
                     checked={formData.locationPreference === type}
                     onChange={handleInputChange}
                     className="hidden" 
                   />
                   <span className="text-sm font-medium text-gray-700">{type}</span>
                 </label>
               ))}
             </div>
          </div>

          {/* Resume Upload - Only for applicants */}
          {user.role === 'applicant' && (
             <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Resume / CV</h3>
                </div>

                {profile.resume && (typeof profile.resume === 'string' || profile.resume.url) ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-purple-50 to-white p-5 rounded-2xl border border-purple-100 shadow-sm gap-4">
                        <div className="flex items-center gap-4 overflow-hidden w-full">
                            <div className="w-12 h-12 bg-white shadow-sm border border-red-100 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 truncate">
                                    {profile.resume.filename || (typeof profile.resume === 'string' ? "Resume" : "Resume.pdf")}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Uploaded successfully
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <a 
                                href={typeof profile.resume === 'string' ? profile.resume : `${BACKEND_URL}${profile.resume.url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:text-purple-700 hover:border-purple-200 hover:bg-purple-50 rounded-xl transition-all shadow-sm flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" /> View
                            </a>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Replace
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2 text-red-500 bg-white border border-gray-200 hover:text-red-700 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                ) : (
                    <label className={`relative flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${uploading ? 'bg-gray-50 border-gray-300 opacity-70' : 'bg-gray-50/50 border-purple-200 hover:bg-purple-50 hover:border-purple-400'}`}>
                        <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                           {uploading ? <Loader2 className="w-6 h-6 text-purple-600 animate-spin" /> : <Upload className="w-6 h-6 text-purple-600" />}
                        </div>
                        <p className="text-sm font-bold text-gray-900 mb-1">
                            {uploading ? "Uploading..." : "Click to upload resume"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Supported formats: PDF, DOC, DOCX (Max 2MB)
                        </p>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                )}
             </div>
          )}

          {/* Experience Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Experience</h3>
                {editMode && (
                  <button 
                    onClick={() => setShowAddExp(!showAddExp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    {showAddExp ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showAddExp ? 'Cancel' : 'Add Experience'}
                  </button>
                )}
             </div>

             <AnimatePresence>
               {showAddExp && editMode && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                       <input type="text" placeholder="Work Title (e.g. UX Designer)" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                       <input type="text" placeholder="Company Name" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                       <input type="text" placeholder="Duration (e.g. Feb 2022 - Present)" value={newExp.duration} onChange={e => setNewExp({...newExp, duration: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                       <input type="text" placeholder="Work Type (e.g. Remote, Full-time)" value={newExp.type} onChange={e => setNewExp({...newExp, type: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                     </div>
                     <button onClick={addExperience} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">Save Experience</button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {formData.experience.map((exp) => (
                 <motion.div whileHover={{ y: -2 }} key={exp.id} className="p-5 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all group relative">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-xl bg-purple-50 flex-shrink-0 flex items-center justify-center text-purple-600">
                         <Briefcase className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-gray-900">{exp.title}</h4>
                         <p className="text-sm font-medium text-gray-600 mt-0.5">{exp.company} {exp.type && <span className="text-gray-400 font-normal ml-1">• {exp.type}</span>}</p>
                         <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</p>
                       </div>
                    </div>
                    {editMode && (
                      <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                 </motion.div>
               ))}
               {formData.experience.length === 0 && !showAddExp && (
                 <p className="text-gray-500 text-sm">No experience added yet.</p>
               )}
             </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Education</h3>
                {editMode && (
                  <button 
                    onClick={() => setShowAddEdu(!showAddEdu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    {showAddEdu ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showAddEdu ? 'Cancel' : 'Add Education'}
                  </button>
                )}
             </div>

             <AnimatePresence>
               {showAddEdu && editMode && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                       <input type="text" placeholder="Institution (e.g. Oxford University)" value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                       <input type="text" placeholder="Degree (e.g. Bachelor's)" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                       <input type="text" placeholder="Specialization (e.g. Software Eng.)" value={newEdu.specialization} onChange={e => setNewEdu({...newEdu, specialization: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                       <input type="text" placeholder="Year (e.g. 2018 - 2022)" value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none" />
                     </div>
                     <button onClick={addEducation} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">Save Education</button>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {formData.education.map((edu) => (
                 <motion.div whileHover={{ y: -2 }} key={edu.id} className="p-5 rounded-2xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-all group relative">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-xl bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600">
                         <GraduationCap className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                         <p className="text-sm font-medium text-gray-600 mt-0.5">{edu.degree} {edu.specialization && <span className="text-gray-400 font-normal ml-1">• {edu.specialization}</span>}</p>
                         <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> {edu.year}</p>
                       </div>
                    </div>
                    {editMode && (
                      <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                 </motion.div>
               ))}
               {formData.education.length === 0 && !showAddEdu && (
                 <p className="text-gray-500 text-sm">No education added yet.</p>
               )}
             </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <AnimatePresence>
                {formData.skills.map((skill, index) => (
                  <motion.span 
                    key={`${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl flex items-center gap-2 group"
                  >
                    {skill}
                    {editMode && (
                      <button onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            
            {editMode && (
              <form onSubmit={addSkill} className="flex gap-2 max-w-sm mt-4">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. React, UI Design..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm focus:border-purple-500 outline-none"
                />
                <button type="submit" className="px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-xl hover:bg-purple-200 transition-colors">
                  Add
                </button>
              </form>
            )}
          </div>

        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10"
                >
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Resume?</h3>
                        <p className="text-sm text-gray-500 mb-8">
                            Are you sure you want to delete your uploaded resume? This action cannot be undone.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={confirmDeleteResume}
                                className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Yes, Delete Resume
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
