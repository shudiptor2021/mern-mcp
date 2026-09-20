import { google } from "googleapis";
import User from "../models/user.model.js";

// ==========================================
// Create Google OAuth Client
// ==========================================
const createGoogleAuth = () => {
  return new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
};

// ==========================================
// Mark Google Calendar as disconnected
// ==========================================
export const disconnectGoogleCalendar = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    "google.connected": false,
    "google.accessToken": null,
    "google.refreshToken": null,
    "google.expiryDate": null,
  });

  console.log(
    `Google Calendar disconnected for user: ${userId}`
  );
};

// ==========================================
// Get authenticated Google Calendar client
// ==========================================
export const getGoogleCalendar = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (
    !user.google?.connected ||
    !user.google?.refreshToken
  ) {
    throw new Error("Google Calendar is not connected");
  }

  const auth = createGoogleAuth();

  auth.setCredentials({
    refresh_token: user.google.refreshToken,
    access_token: user.google.accessToken,
    expiry_date: user.google.expiryDate,
  });

  // ==========================================
  // Google automatically refreshes access token
  // ==========================================
  auth.on("tokens", async (tokens) => {
    try {
      const updateData = {};

      if (tokens.access_token) {
        updateData["google.accessToken"] = tokens.access_token;
      }

      if (tokens.expiry_date) {
        updateData["google.expiryDate"] = tokens.expiry_date;
      }

      // Sometimes Google sends a new refresh token
      if (tokens.refresh_token) {
        updateData["google.refreshToken"] = tokens.refresh_token;
      }

      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(
          userId,
          updateData
        );

        console.log(
          `Google token updated for user: ${userId}`
        );
      }
    } catch (error) {
      console.error(
        "Failed to update Google token:",
        error
      );
    }
  });

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  return {
    calendar,
    user,
  };
};


export const handleGoogleCalendarError = async (
  error,
  userId
) => {
  const googleError =
    error?.response?.data?.error;

  const statusCode =
    error?.response?.status || error?.code;

  console.error(
    "Google Calendar API Error:",
    googleError,
    statusCode
  );

  // ==========================================
  // Refresh token invalid / revoked / expired
  // ==========================================
  if (
    googleError === "invalid_grant" ||
    statusCode === 401
  ) {
    await disconnectGoogleCalendar(userId);

    return true;
  }

  return false;
};



