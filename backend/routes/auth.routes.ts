import express from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controllers/auth.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router()

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get("/check", protectRoute, checkAuth);

export default router;