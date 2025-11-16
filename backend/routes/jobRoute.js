import express from "express";
import { protect, isRecruiter } from "../middleware/authMiddleware.js";

import {
  getallJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";


const router = express.Router()
// public routes

router.get('/', getallJobs);
router.get("/:id",getJobById)
router.get('/search', searchJobs);
router.get('/filter', filterJobs);

// protected Routes

router.post('/', protect, isRecruiter, createJob);
router.get('/myjobs', protect, isRecruiter, getMyJobs);
router.put('/:id', protect, isRecruiter, updateJob);
router.delete('/:id', protect, isRecruiter, deleteJob);

export default router