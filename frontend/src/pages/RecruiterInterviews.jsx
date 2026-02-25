import { useState, useEffect, useMemo } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import {
  Loader2,
  CalendarDays,
  Plus,
  X,
  Video,
  MapPin,
  Clock,
  User,
  Briefcase,
  RotateCcw,
  XCircle,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const formatDateDisplay = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (time) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

const EMPTY_FORM = {
  candidateId: "",
  jobId: "",
  jobTitle: "",
  date: "",
  time: "",
  mode: "online",
  meetingLink: "",
  location: "",
  notes: "",
};

// ── status / mode badge styles ────────────────────────────────────────────────

const statusStyle = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const modeStyle = {
  online: "bg-purple-100 text-purple-700 border-purple-200",
  offline: "bg-gray-100 text-gray-600 border-gray-200",
};

// ─────────────────────────────────────────────────────────────────────────────

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [applicants, setApplicants] = useState([]); // [{candidateId, candidateName, jobId, jobTitle}]
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rescheduleId, setRescheduleId] = useState(null); // if editing existing

  // ── data fetching ────────────────────────────────────────────────────────

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/interviews/recruiter");
      setInterviews(res.data);
    } catch {
      toast.error("Failed to fetch interviews");
    }
  };

  const fetchApplicants = async () => {
    try {
      const res = await api.get("/interviews/recruiter-applicants");
      setApplicants(res.data);
    } catch {
      toast.error("Failed to fetch applicants");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchInterviews(), fetchApplicants()]);
      setLoading(false);
    };
    init();
  }, []);

  // ── modal helpers ────────────────────────────────────────────────────────

  const openNewModal = () => {
    setForm(EMPTY_FORM);
    setRescheduleId(null);
    setShowModal(true);
  };

  const openRescheduleModal = (interview) => {
    setForm({
      candidateId: interview.candidateId?._id || interview.candidateId,
      jobId: interview.jobId?._id || interview.jobId,
      jobTitle: interview.jobId?.title || "",
      date: interview.date ? interview.date.substring(0, 10) : "",
      time: interview.time || "",
      mode: interview.mode || "online",
      meetingLink: interview.meetingLink || "",
      location: interview.location || "",
      notes: interview.notes || "",
    });
    setRescheduleId(interview._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setRescheduleId(null);
  };

  // When candidate changes, auto-fill jobId from the first matching record
  const handleCandidateChange = (e) => {
    const candidateId = e.target.value;
    const match = applicants.find((a) => a.candidateId.toString() === candidateId);
    setForm((prev) => ({
      ...prev,
      candidateId,
      jobId: match ? match.jobId.toString() : "",
      jobTitle: match ? match.jobTitle : "",
    }));
  };

  // Jobs available for the selected candidate
  const availableJobs = useMemo(() => {
    if (!form.candidateId) return [];
    return applicants.filter(
      (a) => a.candidateId.toString() === form.candidateId
    );
  }, [form.candidateId, applicants]);

  const handleJobChange = (e) => {
    const jobId = e.target.value;
    const match = applicants.find((a) => a.jobId.toString() === jobId && a.candidateId.toString() === form.candidateId);
    setForm((prev) => ({
      ...prev,
      jobId,
      jobTitle: match ? match.jobTitle : "",
    }));
  };

  // ── submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.candidateId || !form.jobId || !form.date || !form.time || !form.mode) {
      return toast.error("Please fill all required fields");
    }
    setSubmitting(true);
    try {
      const payload = {
        candidateId: form.candidateId,
        jobId: form.jobId,
        date: form.date,
        time: form.time,
        mode: form.mode,
        meetingLink: form.meetingLink,
        location: form.location,
        notes: form.notes,
      };

      if (rescheduleId) {
        await api.put(`/interviews/${rescheduleId}`, payload);
        toast.success("Interview rescheduled!");
      } else {
        await api.post("/interviews", payload);
        toast.success("Interview scheduled! Candidate notified ✅");
      }
      closeModal();
      fetchInterviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save interview");
    } finally {
      setSubmitting(false);
    }
  };

  // ── cancel interview ─────────────────────────────────────────────────────

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this interview? The candidate will be notified.")) return;
    try {
      await api.delete(`/interviews/${id}`);
      toast.success("Interview cancelled");
      fetchInterviews();
    } catch {
      toast.error("Failed to cancel interview");
    }
  };

  // ── calendar grouping ────────────────────────────────────────────────────

  const calendarData = useMemo(() => {
    const groups = {};
    interviews
      .filter((iv) => iv.status !== "cancelled")
      .forEach((iv) => {
        const key = iv.date ? iv.date.substring(0, 10) : "Unknown";
        if (!groups[key]) groups[key] = [];
        groups[key].push(iv);
      });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [interviews]);

  // ── unique candidates for dropdown ───────────────────────────────────────

  const uniqueCandidates = useMemo(() => {
    const seen = new Set();
    return applicants.filter((a) => {
      if (seen.has(a.candidateId.toString())) return false;
      seen.add(a.candidateId.toString());
      return true;
    });
  }, [applicants]);

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#7315c7]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-[#7315c7]" />
              Interview Scheduler
            </h1>
            <p className="text-gray-500 mt-1">Schedule and manage candidate interviews</p>
          </div>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7315c7] text-white font-semibold rounded-xl hover:bg-[#5e11a3] transition-colors shadow-lg shadow-purple-200"
          >
            <Plus className="w-5 h-5" />
            Schedule Interview
          </button>
        </div>

        {/* ── Calendar View ── */}
        {calendarData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#7315c7]" />
              Calendar View
            </h2>
            <div className="space-y-4">
              {calendarData.map(([dateKey, dayInterviews]) => (
                <div key={dateKey} className="flex gap-4">
                  <div className="min-w-[90px] text-right">
                    <span className="inline-block bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-lg">
                      {formatDateDisplay(dateKey)}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1 border-l-2 border-purple-100 pl-4">
                    {dayInterviews.map((iv) => (
                      <p key={iv._id} className="text-sm text-gray-700">
                        <span className="font-medium">{iv.candidateId?.name || "—"}</span>
                        <span className="text-gray-400"> — </span>
                        {formatTime(iv.time)}
                        <span className="text-gray-400"> — </span>
                        {iv.jobId?.title || "—"}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Upcoming Interviews List ── */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#7315c7]" />
            All Interviews
          </h2>

          {interviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
              <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No interviews scheduled yet.</p>
              <p className="text-gray-400 text-sm mt-1">Click "Schedule Interview" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map((iv) => (
                <div
                  key={iv._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4"
                >
                  {/* Card top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-[#7315c7] shrink-0" />
                        <p className="font-bold text-gray-900 truncate">
                          {iv.candidateId?.name || "Unknown Candidate"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{iv.jobId?.title || "—"}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize shrink-0 ${
                        statusStyle[iv.status] || "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {iv.status}
                    </span>
                  </div>

                  {/* Date / time / mode */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDateDisplay(iv.date)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(iv.time)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs rounded-lg px-2.5 py-1 border ${
                        modeStyle[iv.mode]
                      }`}
                    >
                      {iv.mode === "online" ? (
                        <Video className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                      {iv.mode === "online" ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* Meeting link / location */}
                  {iv.mode === "online" && iv.meetingLink && (
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-purple-600 hover:underline truncate"
                    >
                      🔗 {iv.meetingLink}
                    </a>
                  )}
                  {iv.mode === "offline" && iv.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {iv.location}
                    </p>
                  )}
                  {iv.notes && (
                    <p className="text-xs text-gray-400 italic">📝 {iv.notes}</p>
                  )}

                  {/* Actions */}
                  {iv.status !== "cancelled" && (
                    <div className="flex gap-2 pt-1 border-t border-gray-50">
                      <button
                        onClick={() => openRescheduleModal(iv)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(iv._id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Schedule / Reschedule Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {rescheduleId ? "Reschedule Interview" : "Schedule Interview"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Candidate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Candidate <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.candidateId}
                  onChange={handleCandidateChange}
                  required
                  disabled={!!rescheduleId}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">— Select Candidate —</option>
                  {uniqueCandidates.map((a) => (
                    <option key={a.candidateId} value={a.candidateId}>
                      {a.candidateName} ({a.candidateEmail})
                    </option>
                  ))}
                </select>
                {applicants.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No applicants found. Post a job and wait for applications first.</p>
                )}
              </div>

              {/* Job */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Job <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.jobId}
                  onChange={handleJobChange}
                  required
                  disabled={!!rescheduleId || !form.candidateId}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">— Select Job —</option>
                  {(rescheduleId
                    ? [{ jobId: form.jobId, jobTitle: form.jobTitle }]
                    : availableJobs
                  ).map((a) => (
                    <option key={a.jobId} value={a.jobId}>
                      {a.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().substring(0, 10)}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interview Mode <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  {["online", "offline"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, mode: m }))}
                      className={`flex-1 py-2.5 rounded-xl font-medium text-sm border transition-colors ${
                        form.mode === m
                          ? m === "online"
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-gray-700 text-white border-gray-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {m === "online" ? "🎥 Online" : "🏢 Offline"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting Link (online) */}
              {form.mode === "online" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={form.meetingLink}
                    onChange={(e) => setForm((p) => ({ ...p, meetingLink: e.target.value }))}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                  />
                </div>
              )}

              {/* Location (offline) */}
              {form.mode === "offline" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. HQ Office, 3rd Floor, Room 12"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="e.g. Technical round, bring portfolio..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 outline-none text-sm resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#7315c7] text-white font-semibold rounded-xl hover:bg-[#5e11a3] transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {rescheduleId ? "Save Changes" : "Schedule Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviews;
