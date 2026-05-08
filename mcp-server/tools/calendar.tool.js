// not for server1 this is demo
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

auth.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth });

export const getMeetings = async () => {
  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 5,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.data.items.map(event => ({
      summary: event.summary,
      time: event.start?.dateTime || event.start?.date,
    }));
  } catch (err) {
    console.error("Google Calendar ERROR:", err.response?.data || err.message);

    return {
      error: true,
      message: err.message
    };
  }
};

// export const getMeetings = async () => {
//   const res = await calendar.events.list({
//     calendarId: "primary",
//     timeMin: new Date().toISOString(),
//     maxResults: 5,
//     singleEvents: true,
//     orderBy: "startTime",
//   });

//   return res.data.items.map(event => ({
//     summary: event.summary,
//     time: event.start.dateTime || event.start.date,
//   }));
// };
