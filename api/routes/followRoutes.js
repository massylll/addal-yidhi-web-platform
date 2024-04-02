import express from "express";
import { getFollow, addFollow,deleteFollow, getFollowSuggestions } from "../controllers/followController.js";

const router = express.Router()

router.get("/", getFollow)
router.post("/", addFollow)
router.get("/suggestions", getFollowSuggestions);
router.delete("/", deleteFollow)


export default router;