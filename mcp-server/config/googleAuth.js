// services/calendarClient.service.js
import { google } from "googleapis";
import User from "../models/user.model.js";
import { disconnectGoogleCalendar } from "../services/backend.service.js";

export const getCalendarClient = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user?.google?.connected) {
    const error = new Error("Google account not connected");
    error.code = "GOOGLE_ACCOUNT_NOT_CONNECTED";

    throw error;
  }

  if (!user?.google?.refreshToken) {
    const error = new Error("Google refresh token not found");
    error.code = "GOOGLE_ACCOUNT_NOT_CONNECTED";

    throw error;
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
    await auth.getAccessToken();

  } catch (err) {
    console.error(
      "GOOGLE TOKEN ERROR:",
      err.response?.data || err.message
    );

    const googleError = err.response?.data?.error;

    if (googleError === "invalid_grant") {
      console.log(
        `Refresh token invalid for user: ${userId}`
      );

      // Backend DB -> connected false
      await disconnectGoogleCalendar(userId);

      const error = new Error(
        "Google Calendar connection expired"
      );

      error.code = "GOOGLE_CALENDAR_EXPIRED";

      throw error;
    }

    throw err;
  }

  return google.calendar({
    version: "v3",
    auth,
  });
};

// export const getCalendarClient = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   // console.log("USER:", user.email);
//   // console.log("CONNECTED:", user.google.connected);
//   // console.log("REFRESH TOKEN:", !!user.google.refreshToken);

//   if (!user?.google?.connected) {
//     throw new Error("Google account not connected");
//   }

//   if (!user?.google?.refreshToken) {
//     throw new Error("Google refresh token not found");
//   }

//   const auth = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI,
//   );

//   auth.setCredentials({
//     refresh_token: user.google.refreshToken,
//   });

//   try {
//     const token = await auth.getAccessToken();
//     // console.log("ACCESS TOKEN:", token);
//   } catch (err) {
//     console.error("GOOGLE TOKEN ERROR:", err.response?.data || err.message);
//     const googleError = err.response?.data?.error;
//     // Refresh token is invalid / revoked
//     if (googleError === "invalid_grant") {
//       console.log(`Refresh token invalid for user: ${userId}`);
//       // Tell backend to update MongoDB
//       await disconnectGoogleCalendar(userId);
//       // throw new Error("Google Calendar connection expired. Please reconnect.");
//       const error = new Error(
//         "Google Calendar connection expired. Please reconnect.",
//       );

//       error.code = "GOOGLE_CALENDAR_EXPIRED";

//       throw error;
//     }
//     throw err;
//   }

//   return google.calendar({ version: "v3", auth });
// };

// old code
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
