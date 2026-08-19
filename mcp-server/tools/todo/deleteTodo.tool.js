import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api/v1/assistant";

export const deleteTodoTool = {
  name: "delete_todo",
  schema: z.object({
    id: z.string(),
  }),
  execute: async ({ id }) => {
    const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  },
};