import express from "express";
import { getConversations,sendMessage, getMessageHistory } from "../controllers/messageController.js";

const router = express.Router();
// Route to get the inbox 
router.get("/", getConversations)

// Route to send a message
router.post("/messages", sendMessage);

// Route to get message history with a specific user
router.get("/:receiverId/messages", getMessageHistory);

export default router;
