import express from "express";
import {
  applyForjob,
  getMyApplication,
  getApplicationsForJob,
  updateApplicationStatus,
  sendRecruiterMessage,
} from "../controllers/applicationController.js";
import {
  protectRoute,
  isApplicant,
  isRecruiter,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /my-applications MUST be declared before POST /:jobId
// otherwise Express matches the literal string "my-applications" as a :jobId param
router.get("/my-applications", protectRoute, isApplicant, getMyApplication);
router.get("/analytics", protectRoute, isRecruiter, async (req, res) => {
    try {
        const recruiterId = req.user._id;
        const { default: Job } = await import("../models/jobModel.js");
        const { default: Application } = await import("../models/applicationModel.js");
        const { default: Interview } = await import("../models/InterviewModel.js").catch(() => ({ default: null }));
        
        // 1. Total active jobs
        const activeJobsCount = await Job.countDocuments({ postedBy: recruiterId });
        
        // 2. Get all job IDs posted by this recruiter
        const recruiterJobs = await Job.find({ postedBy: recruiterId }).select('_id');
        const jobIds = recruiterJobs.map(job => job._id);

        // 3. Total applicants across all jobs
        const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });
        
        // 4. Hired/Selected candidates
        const hiredCount = await Application.countDocuments({ job: { $in: jobIds }, status: "selected" });

        // 5. Interviews scheduled (if the model exists and links to recruiter/job)
        let interviewsScheduled = 0;
        if (Interview) {
            interviewsScheduled = await Interview.countDocuments({ job: { $in: jobIds }, status: "scheduled" });
        }

        return res.status(200).json({
            activeJobs: activeJobsCount,
            totalApplicants,
            hiredCandidates: hiredCount,
            interviewsScheduled,
            acceptanceRate: totalApplicants > 0 ? Math.round((hiredCount / totalApplicants) * 100) : 0
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ message: "Server error generating analytics" });
    }
});
router.post("/:jobId", protectRoute, isApplicant, applyForjob);
// Update an application's status
router.get("/job/:jobId", protectRoute, isRecruiter, getApplicationsForJob);
router.put(
  "/:appId/status",
  protectRoute,
  isRecruiter,
  updateApplicationStatus
);
router.post(
  "/:appId/message",
  protectRoute,
  isRecruiter,
  sendRecruiterMessage
);

export default router;
