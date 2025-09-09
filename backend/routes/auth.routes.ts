import express from "express";
import { checkAuth, loginUser, logoutUser, registerUser, resendEmailVerification, verifyEmail } from "../controllers/auth.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router()

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get('/verify-email', verifyEmail)

router.post('/verify-email/resend', resendEmailVerification)

router.get("/check", protectRoute, checkAuth);

export default router;