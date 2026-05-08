import { z } from "zod";
import { getMeetingsService } from "../services/calendar.service.js";

export const getMeetingsTool = {
  name: "get_meetings_google_calendar",
  schema: z.object({
    userId: z.string(),
  }),
  execute: async ({userId}) => {
    return await getMeetingsService(userId);
  },
};