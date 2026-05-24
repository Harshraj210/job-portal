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
