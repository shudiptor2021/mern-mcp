import { z } from "zod";
import { getMeetingsService } from "../services/calendar.service.js";

export const checkConflictTool = {
  name: "check_conflict",
  schema: z.object({
    userId: z.string().optional(),
    time: z.string(),
  }),
  execute: async ({ userId, time }) => {
    try {
      const events = await getMeetingsService(userId);

      const conflict = events.find((e) => e.start.includes(time));

      return {
        conflict: !!conflict,
        event: conflict?.summary || null,
      };
      // newly added
    } catch (error) {
      console.error("CHECK CONFLICT TOOL ERROR:", error);

      if (error.code === "GOOGLE_CALENDAR_EXPIRED" ||
      error.code === "GOOGLE_ACCOUNT_NOT_CONNECTED") {
        return {
          success: false,
          connected: false,
          code: error.code,
          message:
            "Google Calendar connection expired. Please reconnect your Google Calendar.",
        };
      }

      throw error;
    }
  },
};
