import express from "express";
import protectRoute from "../middleware/protectRoute";
import { getAllUsers } from "../controllers/user.controller";

const router = express.Router()

router.get('/', protectRoute, getAllUsers)

export default router;