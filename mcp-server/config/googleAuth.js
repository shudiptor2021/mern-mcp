// services/calendarClient.service.js
import { google } from "googleapis";
import User from "../models/user.model.js";

export const getCalendarClient = async (userId) => {
  const user = await User.findById(userId);

  // console.log("USER:", user.email);
  // console.log("CONNECTED:", user.google.connected);
  // console.log("REFRESH TOKEN:", !!user.google.refreshToken);

  if (!user?.google?.connected) {
    throw new Error("Google account not connected");
  }

  const auth = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  auth.setCredentials({
    refresh_token: user.google.refreshToken,
  });

   try {
    const token = await auth.getAccessToken();
    // console.log("ACCESS TOKEN:", token);
  } catch (err) {
    console.error("TOKEN ERROR:", err.response?.data || err.message);
  }

  return google.calendar({ version: "v3", auth });
};




// import { google } from "googleapis";
// import dotenv from "dotenv";

// dotenv.config();

// const auth = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// auth.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// export const calendar = google.calendar({
//   version: "v3",
//   auth,
// });