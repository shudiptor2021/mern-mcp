import { z } from "zod";
import { createEventService } from "../services/calendar.service.js";

export const createEventTool = {
  name: "create_event",
  schema: z.object({
    title: z.string(),
    start: z.string(),
    end: z.string(),
    userId: z.string().optional(),
  }),
  execute: async ({ title, start, end, userId }) => {
    try {
      const event = await createEventService({ title, start, end, userId });

      return {
        success: true,
        link: event.htmlLink,
      };
      // newly added
    } catch (error) {
      console.error("CREATE EVENT TOOL ERROR:", error);

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
