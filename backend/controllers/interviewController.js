import Interview from "../models/InterviewModel.js";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import Notification from "../models/NotificationModel.js";

// Helper: format date as "25 Feb 2026"
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Helper: format time "15:00" → "3:00 PM"
const formatTime = (time) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

// POST /api/interviews — Schedule a new interview
const scheduleInterview = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const { candidateId, jobId, date, time, mode, meetingLink, location, notes } = req.body;

    if (!candidateId || !jobId || !date || !time || !mode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify the job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: "Not authorized to schedule for this job" });
    }

    // Verify candidate applied to this job
    const application = await Application.findOne({ job: jobId, applicant: candidateId });
    if (!application) {
      return res.status(400).json({ message: "Candidate has not applied to this job" });
    }

    const candidate = await User.findById(candidateId).select("name");
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // Create interview
    const interview = await Interview.create({
      recruiterId,
      candidateId,
      jobId,
      date: new Date(date),
      time,
      mode,
      meetingLink: meetingLink || "",
      location: location || "",
      notes: notes || "",
    });

    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);
    const modeLabel = mode === "online" ? "Online (Zoom/Meet)" : "Offline";

    // Notify candidate
    await Notification.create({
      recipient: candidateId,
      message: `Interview Scheduled 🎉 You have an interview for ${job.title} on ${formattedDate} at ${formattedTime}. Mode: ${modeLabel}`,
      type: "interview",
      relatedJob: jobId,
      interviewId: interview._id,
    });

    // Notify recruiter
    await Notification.create({
      recipient: recruiterId,
      message: `Interview scheduled with ${candidate.name} for ${job.title} on ${formattedDate} at ${formattedTime}`,
      type: "interview",
      relatedJob: jobId,
      interviewId: interview._id,
    });

    const populated = await Interview.findById(interview._id)
      .populate("candidateId", "name email")
      .populate("jobId", "title");

    return res.status(201).json(populated);
  } catch (error) {
    console.error("scheduleInterview error:", error);
    return res.status(500).json({ message: "Server error scheduling interview", error: error.message });
  }
};

// GET /api/interviews/recruiter — Get all interviews for this recruiter
const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiterId: req.user._id })
      .populate("candidateId", "name email")
      .populate("jobId", "title")
      .sort({ date: 1, time: 1 });

    return res.status(200).json(interviews);
  } catch (error) {
    console.error("getRecruiterInterviews error:", error);
    return res.status(500).json({ message: "Server error fetching interviews" });
  }
};

// GET /api/interviews/candidate — Get all interviews for this candidate
const getCandidateInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidateId: req.user._id })
      .populate("recruiterId", "name email")
      .populate("jobId", "title companyName")
      .sort({ date: 1, time: 1 });

    return res.status(200).json(interviews);
  } catch (error) {
    console.error("getCandidateInterviews error:", error);
    return res.status(500).json({ message: "Server error fetching interviews" });
  }
};

// PUT /api/interviews/:id — Update (reschedule) an interview
const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user._id;
    const { date, time, mode, meetingLink, location, notes, status } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Apply updates
    if (date) interview.date = new Date(date);
    if (time) interview.time = time;
    if (mode) interview.mode = mode;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;
    if (location !== undefined) interview.location = location;
    if (notes !== undefined) interview.notes = notes;
    if (status) interview.status = status;

    await interview.save();

    const populated = await Interview.findById(id)
      .populate("candidateId", "name email")
      .populate("jobId", "title");

    // Notify candidate of rescheduling (only if date/time changed)
    if (date || time) {
      await Notification.create({
        recipient: interview.candidateId,
        message: `Your interview for ${populated.jobId.title} has been rescheduled to ${formatDate(interview.date)} at ${formatTime(interview.time)}`,
        type: "interview",
        relatedJob: interview.jobId,
      });
    }

    return res.status(200).json(populated);
  } catch (error) {
    console.error("updateInterview error:", error);
    return res.status(500).json({ message: "Server error updating interview" });
  }
};

// DELETE /api/interviews/:id — Cancel an interview
const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user._id;

    const interview = await Interview.findById(id).populate("jobId", "title");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.recruiterId.toString() !== recruiterId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    interview.status = "cancelled";
    await interview.save();

    // Notify candidate
    await Notification.create({
      recipient: interview.candidateId,
      message: `Your interview for ${interview.jobId?.title || "the position"} on ${formatDate(interview.date)} has been cancelled by the recruiter.`,
      type: "interview",
      relatedJob: interview.jobId?._id,
    });

    return res.status(200).json({ message: "Interview cancelled", interview });
  } catch (error) {
    console.error("cancelInterview error:", error);
    return res.status(500).json({ message: "Server error cancelling interview" });
  }
};

// GET /api/interviews/recruiter-applicants — Get all applicants across recruiter's jobs
const getRecruiterApplicants = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Find all jobs posted by this recruiter
    const jobs = await Job.find({ postedBy: recruiterId }).select("_id title");
    const jobIds = jobs.map((j) => j._id);

    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email")
      .populate("job", "title _id");

    // Build unique candidate-job combos
    const seen = new Set();
    const result = [];
    for (const app of applications) {
      const key = `${app.applicant._id}-${app.job._id}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          candidateId: app.applicant._id,
          candidateName: app.applicant.name,
          candidateEmail: app.applicant.email,
          jobId: app.job._id,
          jobTitle: app.job.title,
        });
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("getRecruiterApplicants error:", error);
    return res.status(500).json({ message: "Server error fetching applicants" });
  }
};

// GET /api/interviews/:id — Get single interview details (for notification popup)
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("candidateId", "name email")
      .populate("jobId", "title")
      .populate("recruiterId", "name email");

    if (!interview) return res.status(404).json({ message: "Interview not found" });

    // Allow both the recruiter and the candidate to fetch details
    const userId = req.user._id.toString();
    const isOwner =
      interview.recruiterId._id.toString() === userId ||
      interview.candidateId._id.toString() === userId;
    if (!isOwner) return res.status(403).json({ message: "Not authorized" });

    return res.status(200).json({
      candidateName: interview.candidateId?.name || "",
      candidateEmail: interview.candidateId?.email || "",
      jobTitle: interview.jobId?.title || "",
      date: interview.date,
      time: interview.time,
      mode: interview.mode,
      meetingLink: interview.meetingLink || "",
      location: interview.location || "",
      notes: interview.notes || "",
      status: interview.status,
    });
  } catch (error) {
    console.error("getInterviewById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
  getRecruiterApplicants,
  getInterviewById,
};
