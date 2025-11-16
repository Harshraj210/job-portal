import express from "express";
import { protect, isRecruiter,isApplicant } from "../middleware/authMiddleware.js";

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

router.get('/', getallJobs);
router.get("/:id",getJobById)
router.get('/search', searchJobs);
router.get('/filter', filterJobs);
router.get('/saved', protect, isApplicant, getSavedJobs);

// protected Routes

router.post('/', protect, isRecruiter, createJob);
router.get('/myjobs', protect, isRecruiter, getMyJobs);
router.put('/:id', protect, isRecruiter, updateJob);
router.delete('/:id', protect, isRecruiter, deleteJob);
router.post('/:id/save', protect, isApplicant, saveJob);
router.delete('/:id/save', protect, isApplicant, unsaveJob);

export default router