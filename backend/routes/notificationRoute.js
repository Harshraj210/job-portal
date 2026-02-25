import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.get("/unread-count", protectRoute, getUnreadCount);
router.put("/:id/read", protectRoute, markAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
