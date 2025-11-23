import { useState, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2, User } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/auth/profile", user);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-[#7315c7]" />
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl p-8 border border-gray-100 animate-fade-in">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center text-[#7315c7]">
            <User size={48} />
          </div>
          <h2 className="font-bold text-3xl mt-3 text-gray-900">
            {user?.name}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Editable Fields */}
        <div className="space-y-5">
          {["bio", "experience", "education", "qualifications"].map((field) => (
            <textarea
              key={field}
              rows="2"
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={user?.profile?.[field] || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  profile: {
                    ...user.profile,
                    [field]: e.target.value,
                  },
                })
              }
              className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none"
            />
          ))}

          {/* Skills */}
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={user?.profile?.skills?.join(", ") || ""}
            onChange={(e) =>
              setUser({
                ...user,
                profile: {
                  ...user.profile,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                },
              })
            }
            className="w-full bg-gray-50 border rounded-xl py-3 px-4 focus:border-[#7315c7] focus:ring-2 focus:ring-purple-100 outline-none"
          />

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full py-3 bg-[#7315c7] text-white font-semibold rounded-xl shadow-lg hover:bg-[#8d23d7] flex justify-center items-center gap-2 disabled:opacity-60 transition-all"
          >
            {saving ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
