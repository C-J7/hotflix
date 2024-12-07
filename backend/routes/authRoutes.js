import { Router } from "express";
import { googleLogin } from "../controllers/authController";
const router = Router();
// POST route for Google login
router.post("/google-login", googleLogin);
export default router;