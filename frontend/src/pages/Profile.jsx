import { useState, useEffect, useRef } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, User, FileText, Upload, Trash2, Eye, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch (error) {
      toast.error("Unauthorized. Please login again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const updatedData = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        bio: user.profile?.bio || "",
        experience: user.profile?.experience || "",
        education: user.profile?.education || "",
        qualifications: user.profile?.qualifications || "",
        skills: user.profile?.skills || "",
      };

       // Since backend expects flat structure for update (based on userController.updateProfile)
       // But user object structure from getProfile might have profile nested
       // Let's adjust based on what getProfile returns. 
       // User model has profile: { bio, skills... }
       // But updateProfile controller expects bio, skills at root of req.body?
       // Let's check updateProfile in userController...
       // It extracts bio, experience etc from req.body directly.
       // So we send them directly.

      await api.put("/auth/profile", updatedData);
      toast.success("Profile Updated Successfully 🎉");
    } catch {
      toast.error("Failed to update");
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteClick = () => {
      setShowDeleteModal(true);
  };

  if (loading || !user)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-[#7315c7]" />
      </div>
    );
  
  // Helper to safely get profile fields whether they are at root or in profile object
  // Based on User model, they are in profile object. 
  // API getProfile returns user object which matches User model.
  const profile = user.profile || {};

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-10 relative">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center text-[#7315c7]">
            <User size={48} />
          </div>
          <h2 className="font-bold text-3xl mt-3 text-gray-900">
            {user?.name}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Resume Section - Only for Applicants */}
        {user.role === 'applicant' && (
            <div className="mb-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#7315c7]" /> Match Resume
                </h3>
                
                {profile.resume && (typeof profile.resume === 'string' || profile.resume.url) ? (
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                                    {profile.resume.filename || (typeof profile.resume === 'string' ? "Resume" : "Resume.pdf")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Uploaded: {profile.resume.uploadedAt ? new Date(profile.resume.uploadedAt).toLocaleDateString() : "Unknown date"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a 
                                href={typeof profile.resume === 'string' ? profile.resume : `http://localhost:5000${profile.resume.url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-[#7315c7] hover:bg-purple-50 rounded-lg transition-colors"
                                title="View Resume"
                            >
                                <Eye className="w-5 h-5" />
                            </a>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Replace Resume"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleDeleteClick}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Resume"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#7315c7] hover:bg-purple-50/30 transition-all group">
                        <div className="mb-3">
                            <Upload className="w-10 h-10 mx-auto text-gray-400 group-hover:text-[#7315c7] transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload your resume to apply for jobs faster. <br/>
                            <span className="text-xs text-gray-400">(PDF, DOC, DOCX up to 2MB)</span>
                        </p>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-[#7315c7] hover:text-[#7315c7] transition-colors disabled:opacity-50"
                        >
                            {uploading ? "Uploading..." : "Select Resume"}
                        </button>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                />
            </div>
        )}

        {/* Editable Fields */}
        <div className="space-y-5">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Profile Details</h3>
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <input
                    type="text"
                    value={user.phoneNumber || ""}
                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none"
                    placeholder="Phone Number"
                  />
              </div>
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Bio</label>
                  <input
                    type="text"
                    value={profile.bio || ""}
                    onChange={(e) => setUser({ ...user, profile: { ...profile, bio: e.target.value } })}
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none"
                    placeholder="Short Bio"
                  />
              </div>
          </div>
          
          <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Skills</label>
              <input
                type="text"
                placeholder="Comma separated (e.g. React, Node.js, Design)"
                value={profile.skills || ""}
                onChange={(e) => setUser({ ...user, profile: { ...profile, skills: e.target.value } })}
                className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none"
              />
          </div>

          <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Experience</label>
              <textarea
                rows="3"
                placeholder="Describe your work experience..."
                value={profile.experience || ""}
                onChange={(e) => setUser({ ...user, profile: { ...profile, experience: e.target.value } })}
                className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none resize-none"
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Education</label>
                  <textarea
                    rows="2"
                    placeholder="Education details..."
                    value={profile.education || ""}
                    onChange={(e) => setUser({ ...user, profile: { ...profile, education: e.target.value } })}
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                  />
              </div>
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Qualifications</label>
                  <textarea
                    rows="2"
                    placeholder="Other qualifications..."
                    value={profile.qualifications || ""}
                    onChange={(e) => setUser({ ...user, profile: { ...profile, qualifications: e.target.value } })}
                    className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                  />
              </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full py-3 bg-[#7315c7] text-white font-semibold rounded-xl shadow-lg
              hover:bg-[#8d23d7] flex justify-center items-center gap-2 disabled:opacity-60 transition-all mt-4"
          >
            {saving ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Save Profile"
            )}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all">
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Resume?</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete your resume? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDeleteResume}
                                className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
