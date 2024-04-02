import express from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

// Route to get notifications for a user
router.get("/", getNotifications)
   

// Route to mark a notification as "READ"
router.put("/:notificationId", markNotificationAsRead)
   
export default router;
