import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api/v1/assistant";

export const updateTodoTool = {
  name: "update_todo",
  schema: z.object({
    id: z.string(),
    completed: z.boolean(),
  }),
  execute: async ({ id, completed }) => {
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    return await res.json();
  },
};