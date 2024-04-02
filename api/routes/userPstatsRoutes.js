import express from "express";
import { getNumberOfFollowers, getNumberOfFollowing, getNumberOfPosts } from "../controllers/userPstatsController.js";


const router = express.Router()//setting the express router

router.get("/numberposts/:userId", getNumberOfPosts);
router.get("/numberfollowers/:userId", getNumberOfFollowers);
router.get("/numberfollowing/:userId", getNumberOfFollowing);


export default router;