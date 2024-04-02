import express from "express";// we import express so we can use it to create or set our express router
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";// here we are simply importing the fucntions we defined earlier in commentController.js which basically handles : adding a comment, deleting a comment or also getting comments

const router = express.Router();// here we set our express router using express that we imported

// we define our routes so we can implement the functions we defined in commentController.js earlier
router.get("/", getComments);// the route to getting comments 
router.post("/", addComment);// the route to post comments which means adding a comment
router.delete("/:id", deleteComment);// the route to delete a comment.

export default router;// we then export our router