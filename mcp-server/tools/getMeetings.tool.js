import { z } from "zod";
import { getMeetingsService } from "../services/calendar.service.js";

export const getMeetingsTool = {
  name: "get_meetings_google_calendar",
  schema: z.object(),
  execute: async ({userId}) => {
    return await getMeetingsService(userId);
  },
};