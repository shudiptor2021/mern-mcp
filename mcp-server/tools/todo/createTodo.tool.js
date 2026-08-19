import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api/v1/assistant";

export const createTodoTool = {
  name: "create_todo",
  schema: z.object({
    title: z.string(),
    // userId: z.string().optional(),
  }),
  execute: async ({ title, userId }) => {
    const res = await fetch(`${BACKEND_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userId }),
    });

    return await res.json();
  },
};