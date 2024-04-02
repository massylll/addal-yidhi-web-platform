import express from 'express';
const router = express.Router();
import {  deleteRequest, getRequests, submitRequest } from "../controllers/requestController.js"; //importing the functions defining the logic

// Route to submit a request
router.post('/', submitRequest);


// Route to get requests 
router.get('/:category/:location?', getRequests);
router.delete('/:id',deleteRequest);


export default router;
