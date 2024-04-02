// Import necessary modules
import express from 'express';
import { getUserReports, submitReport } from '../controllers/reportController.js';

// Create a router instance
const router = express.Router();

// Define the route for submitting a report
router.post('/', submitReport);
router.get('/', getUserReports);

// Export the router
export default router;
