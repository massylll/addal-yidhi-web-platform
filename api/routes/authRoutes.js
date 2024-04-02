import express from "express"; // we import express so we can set after our express router
import { login, register, logout } from "../controllers/authController.js"; // we import the functions needed to handle login, logout and registration

const router = express.Router(); // we set our express router

// we define our routes while importing the functions we defined in authController.js to handle the registration,login and finally logout process
router.post("/register", register);// the path for the registration is : http://localhost:8800/api/auth/register
router.post("/login", login);// the path for the login is : http://localhost:8800/api/auth/login
router.post("/logout", logout);// the path for logout is : http://localhost:8800/api/auth/logout

export default router; // we then export it
