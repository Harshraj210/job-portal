import express from "express";
import { protect, isRecruiter } from "../middleware/authMiddleware.js";

import {
  getallJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";


const router = express.Router()
// public routes

router.get('/', getallJobs);
router.get("/:id",getJobById)

// protected Routes

router.post('/', protectRoute, isRecruiter, createJob);
router.get('/myjobs', protectRoute, isRecruiter, getMyJobs);
router.put('/:id', protectRoute, isRecruiter, updateJob);
router.delete('/:id', protectRoute, isRecruiter, deleteJob);

export default router