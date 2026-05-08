import { z } from "zod";

export const updateTodoTool = {
  name: "update_todo",
  schema: z.object({
    id: z.string(),
    completed: z.boolean(),
  }),
  execute: async ({ id, completed }) => {
    const res = await fetch(`http://localhost:5000/api/v1/assistant/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    return await res.json();
  },
};