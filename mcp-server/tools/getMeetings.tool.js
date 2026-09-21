import { z } from "zod";
import { getMeetingsService } from "../services/calendar.service.js";

// export const getMeetingsTool = {
//   name: "get_meetings_google_calendar",
//   schema: z.object({}),
//   execute: async ({userId}) => {
//     return await getMeetingsService(userId);
//   },
// };

export const getMeetingsTool = {
  name: "get_meetings_google_calendar",
  schema: z.object({}),
  execute: async ({ userId }) => {
    try {
      const meetings = await getMeetingsService(userId);

      return {
        success: true,
        meetings,
      };
    } catch (error) {
      console.error("GET MEETINGS TOOL ERROR:", error);

      if (error.code === "GOOGLE_CALENDAR_EXPIRED") {
        return {
          success: false,
          connected: false,
          code: "GOOGLE_CALENDAR_EXPIRED",
          message:
            "Google Calendar connection expired. Please reconnect your Google Calendar.",
        };
      }

      throw error;
    }
  },
};
