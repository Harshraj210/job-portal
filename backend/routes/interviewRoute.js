import express from "express";
import {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  updateInterview,
  cancelInterview,
  getRecruiterApplicants,
  getInterviewById,
} from "../controllers/interviewController.js";
import {
  protectRoute,
  isRecruiter,
  isApplicant,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Recruiter routes
router.post("/", protectRoute, isRecruiter, scheduleInterview);
router.get("/recruiter", protectRoute, isRecruiter, getRecruiterInterviews);
router.get("/recruiter-applicants", protectRoute, isRecruiter, getRecruiterApplicants);
router.put("/:id", protectRoute, isRecruiter, updateInterview);
router.delete("/:id", protectRoute, isRecruiter, cancelInterview);

// Candidate route
router.get("/candidate", protectRoute, isApplicant, getCandidateInterviews);

// Detail by ID (both recruiter and candidate can view — controller checks ownership)
router.get("/:id", protectRoute, getInterviewById);

export default router;
