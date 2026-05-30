import express from "express";
import { protectRoute, isRecruiter,isApplicant } from "../middleware/authMiddleware.js";
import cacheMiddleware from "../middleware/cacheMiddleware.js";
import cacheKeys from "../utils/cacheKeys.js";
import { postJobLimiter } from "../middleware/rateLimiter.js";

import {
  getallJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
  searchJobs,
  filterJobs,
} from "../controllers/jobController.js";


const router = express.Router()
// public routes

router.get("/", cacheMiddleware(() => cacheKeys.JOBS_ALL, 300), getallJobs);


router.get("/search", cacheMiddleware((req) => cacheKeys.jobSearch(req.query.keyword), 300), searchJobs);
router.get("/filter", cacheMiddleware((req) => cacheKeys.jobFilter(JSON.stringify(req.query)), 300), filterJobs);

// PROTECTED ROUTES
router.post("/create", protectRoute, isRecruiter, postJobLimiter, createJob);
router.get("/myjobs", protectRoute, isRecruiter, getMyJobs);

// SAVED JOBS (applicant)
router.get("/saved", protectRoute, isApplicant, getSavedJobs);
router.post("/:id/save", protectRoute, isApplicant, saveJob);
router.delete("/:id/unsave", protectRoute, isApplicant, unsaveJob);

//  PARAM ROUTES LAST
router.get("/:id", getJobById);
router.put("/:id/update", protectRoute, isRecruiter, updateJob);
router.delete("/:id/delete", protectRoute, isRecruiter, deleteJob);

export default router;