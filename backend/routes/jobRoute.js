import express from "express";
import { protectRoute, isRecruiter,isApplicant } from "../middleware/authMiddleware.js";

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
router.get('/saved', protectRoute, isApplicant, getSavedJobs);

// protected Routes

router.post('/', protectRoute, isRecruiter, createJob);
router.get('/myjobs', protectRoute, isRecruiter, getMyJobs);
router.put('/:id', protectRoute, isRecruiter, updateJob);
router.delete('/:id', protectRoute, isRecruiter, deleteJob);
router.post('/:id/save', protectRoute, isApplicant, saveJob);
router.delete('/:id/save', protectRoute, isApplicant, unsaveJob);

export default router