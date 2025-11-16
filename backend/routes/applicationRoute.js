import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import {
  protectRoute,
  isApplicant,
  isRecruiter,
} from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/:jobId', protectRoute, isApplicant, applyForJob);
router.get('/my-applications', protectRoute, isApplicant, getMyApplications);
// Update an application's status
router.get(
  '/job/:jobId',
  protectRoute,
  isRecruiter,
  getApplicationsForJob
);
export default router;