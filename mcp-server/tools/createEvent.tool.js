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
    const event = await createEventService({ title, start, end, userId });

    return {
      success: true,
      link: event.htmlLink,
    };
  },
};