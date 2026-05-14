import express from "express";
import { handleChat } from "../controllers/chat.controller.js";
import requireAuth from "../middleware/require.auth.js";

const router = express.Router();

router.post("/chat", handleChat);

export default router;