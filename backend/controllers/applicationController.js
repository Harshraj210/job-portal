import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import Notification from "../models/NotificationModel.js";

const applyForjob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(401).json({ message: "Job not found" });
    }
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (alreadyApplied) {
      return res
        .status(401)
        .json({ message: "You have already applied for this job!!" });
    }
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      status: "pending",
      resume: req.user.profile?.resume?.url || req.user.profile?.resume || "No resume uploaded"
    });

    // Create Notification for Recruiter
    await Notification.create({
      recipient: job.postedBy,
      message: `New application: ${req.user.name} applied for ${job.title}`,
      type: "application",
      relatedJob: jobId,
    });
    return res.status(201).json(application);
  } catch (error) {
    return res.status(401).json({ message: "Error in apply for Job" });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const applicantId = req.user._id;

    const applications = await Application.findOne({
      applicant: applicantId,
    })
      .populate("job", "title companyName location jobType salary")
      .sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user._id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // Check if the loggedin recruiter is the one who posted this job

    if (job.postedBy.toString() !== recruiterId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applications for this job" });
    }
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: 1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // Recruiters sends the statuses
    const recruiterId = req.user._id;
    const { appId } = req.params;
    if (!["pending", "viewed", "shortlisted", "rejected", "selected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const application = await Application.findById(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    const job = await Job.findById(application.job);
    if (!job) {
      return res.status(404).json({ message: "Associated job not found" });
    }
    // check if loggedin recruiter posted this job
    if (job.postedBy.toString() !== recruiterId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }
    application.status = status;
    await application.save();

    // Create Notification for Applicant
    let message = "";
    if (status === "viewed") message = `Your application for ${job.title} was viewed`;
    else if (status === "shortlisted") message = `You were shortlisted for ${job.title}`;
    else if (status === "rejected") message = `Your application for ${job.title} was rejected`;
    else if (status === "selected") message = `You were selected for ${job.title}`;

    if (message) {
      await Notification.create({
        recipient: application.applicant,
        message,
        type: "status-update",
        relatedJob: application.job,
      });
    }

    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({
      message: "Error in updating the Application status",
      error: error.message,
    });
  }
};

const sendRecruiterMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { appId } = req.params;
        const recruiterId = req.user._id;

        const application = await Application.findById(appId);
        if(!application) return res.status(404).json({message: "Application not found"});

        const job = await Job.findById(application.job);
        if(job.postedBy.toString() !== recruiterId) {
            return res.status(403).json({message: "Not authorized"});
        }

        application.recruiterMessage = message;
        await application.save();

        await Notification.create({
            recipient: application.applicant,
            message: `Message from Recruiter: ${message}`,
            type: "info",
            relatedJob: application.job
        });

        return res.status(200).json({message: "Message sent successfully"});

    } catch (error) {
        return res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

export {
  applyForjob,
  getApplicationsForJob,
  updateApplicationStatus,
  getMyApplication,
  sendRecruiterMessage,
};
