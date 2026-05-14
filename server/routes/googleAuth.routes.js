import express from "express";
import { google } from "googleapis";
import User from "../models/user.model.js";

const router = express.Router();

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 👉 Step 1: redirect user to Google
router.get("/connect", (req, res) => {
  const { userId } = req.query;

  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
    state: userId, // 🔥 VERY IMPORTANT
  });

  res.redirect(url);
});

// 👉 Step 2: callback from Google
router.get("/callback", async (req, res) => {
  const { code, state: userId } = req.query;

  try {
    const { tokens } = await auth.getToken(code);

    await User.findByIdAndUpdate(userId, {
      google: {
        connected: true,
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        expiryDate: tokens.expiry_date,
      },
    });

    // res.send("✅ Google Calendar connected সফলভাবে");
    return res.redirect("http://localhost:3000");
  } catch (err) {
    console.error(err);
    res.status(500).send("Auth failed");
  }
});

export default router;