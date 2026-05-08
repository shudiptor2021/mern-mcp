import express from "express";
import { getUserInfoHandler, googleAuthCallbackHandler, googleAuthStartHandler, logoutHandler } from "../controllers/user.controller.js";
import requireAuth from "../middleware/require.auth.js";

const router = express.Router();

router.get("/userme", requireAuth, getUserInfoHandler);
router.get("/google", googleAuthStartHandler);
router.get("/google/callback", googleAuthCallbackHandler);
router.post("/logout", logoutHandler);


export default router;