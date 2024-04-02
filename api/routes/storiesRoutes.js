import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/storiesController.js";

const router = express.Router();

router.get("/", getStories);
router.post("/", addStory);
router.delete("/:id", deleteStory);

export default router;