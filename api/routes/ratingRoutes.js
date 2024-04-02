import express from "express";
import { getMyAverageRating, submitRating} from "../controllers/ratingController.js";

const router = express.Router();

// Route to submit a rating
router.post("/", submitRating);

router.get("/", getMyAverageRating);

export default router;
