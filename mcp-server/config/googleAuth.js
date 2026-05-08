// services/calendarClient.service.js
import { google } from "googleapis";
import User from "../models/user.model.js";

export const getCalendarClient = async (userId) => {
  const user = await User.findById(userId);

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