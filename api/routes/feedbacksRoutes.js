import express from 'express';
const router = express.Router();
import { submitFeedback, submitUserThoughts } from "../controllers/feedbackController.js";

// Route to submit feedback
router.post('/', submitFeedback);
router.post('/thoughts', submitUserThoughts)

export default router;
