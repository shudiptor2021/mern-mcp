import { z } from "zod";
import { getMeetingsService } from "../services/calendar.service.js";

export const checkConflictTool = {
  name: "check_conflict",
  schema: z.object({
    userId: z.string().optional(),
    time: z.string(),
  }),
  execute: async ({ userId, time }) => {
    const events = await getMeetingsService(userId);

    const conflict = events.find(e => e.start.includes(time));

    return {
      conflict: !!conflict,
      event: conflict?.summary || null,
    };
  },
};