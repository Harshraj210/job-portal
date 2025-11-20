import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";

const applyForjob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicantId = req.user.id;

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
      status: "Pending Bro",
    });
    return res.status(201).json(application);
  } catch (error) {
    return res.status(401).json({ message: "Error in apply for Job" });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const applicantId = req.user.id;

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
    const recruiterId = req.user.id;
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
    const recruiterId = req.user.id;
    const { appId } = req.params;
    if (!["pending", "reviewed", "rejected"].includes(status)) {
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
    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({
      message: "Error in updating the Application status",
      error: error.message,
    });
  }
};

export {
  applyForjob,
  getApplicationsForJob,
  updateApplicationStatus,
  getMyApplication,
};
