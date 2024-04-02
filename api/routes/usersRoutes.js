import express from "express";
import { getMe , updateMe, getMyRequests} from "../controllers/userController.js"; 

const router = express.Router()//setting the express router

router.get("/find/:userId", getMe);
router.put("/", updateMe);
router.get("/myrequests", getMyRequests);


export default router