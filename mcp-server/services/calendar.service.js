import { calendar } from "../config/googleAuth.js";

export const getMeetingsService = async (userId) => {
   const calendar = await getCalendarClient(userId);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  return (res.data.items || []).map(event => ({
    id: event.id,
    summary: event.summary,
    start: event.start?.dateTime || event.start?.date,
  }));
};

export const createEventService = async ({ title, start, end, userId }) => {
  const calendar = await getCalendarClient(userId);

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      start: { dateTime: start },
      end: { dateTime: end },
    },
  });

  return res.data;
};