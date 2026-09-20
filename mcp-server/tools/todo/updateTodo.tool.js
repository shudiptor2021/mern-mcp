import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export const updateTodoTool = {
  name: "update_todo",
  schema: z.object({
    id: z.string(),
    completed: z.boolean(),
  }),
  execute: async ({ id, completed }) => {
    const res = await fetch(`${BACKEND_URL}/api/v1/assistant/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    return await res.json();
  },
};