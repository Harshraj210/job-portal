import { X, User, Briefcase, CalendarDays, Clock, Video, MapPin, StickyNote } from "lucide-react";

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

const statusStyle = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const InterviewDetailModal = ({ data, onClose, loading }) => {
  // Trap focus inside the modal on Escape key
  const handleKey = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onKeyDown={handleKey}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#7315c7] to-[#9d3fdf] text-white">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            <h2 className="text-lg font-bold">Interview Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-[#7315c7] rounded-full animate-spin" />
            </div>
          ) : !data ? (
            <p className="text-center text-gray-500 py-8">Interview details not found.</p>
          ) : (
            <>
              {/* Status badge */}
              <div className="flex justify-end mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyle[data.status] || "bg-gray-100 text-gray-600"}`}>
                  {data.status}
                </span>
              </div>

              <div className="space-y-3">
                {/* Candidate */}
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <User className="w-4 h-4 text-[#7315c7] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Candidate</p>
                    <p className="font-semibold text-gray-900">{data.candidateName || "—"}</p>
                    {data.candidateEmail && (
                      <p className="text-xs text-gray-500">{data.candidateEmail}</p>
                    )}
                  </div>
                </div>

                {/* Job */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <Briefcase className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Position</p>
                    <p className="font-semibold text-gray-900">{data.jobTitle || "—"}</p>
                  </div>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <CalendarDays className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                      <p className="font-semibold text-gray-900 text-sm">{formatDateDisplay(data.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                      <p className="font-semibold text-gray-900 text-sm">{formatTime(data.time)}</p>
                    </div>
                  </div>
                </div>

                {/* Mode */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {data.mode === "online" ? (
                    <Video className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mode</p>
                    <p className="font-semibold text-gray-900 capitalize">{data.mode}</p>
                    {data.mode === "online" && data.meetingLink && (
                      <a
                        href={data.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-sm text-[#7315c7] hover:underline font-medium break-all"
                      >
                        🔗 Join Meeting
                      </a>
                    )}
                    {data.mode === "offline" && data.location && (
                      <p className="text-sm text-gray-600 mt-0.5">{data.location}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {data.notes && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <StickyNote className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Notes</p>
                      <p className="text-sm text-gray-700 mt-0.5">{data.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#7315c7] text-white font-semibold rounded-xl hover:bg-[#5e11a3] transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailModal;
