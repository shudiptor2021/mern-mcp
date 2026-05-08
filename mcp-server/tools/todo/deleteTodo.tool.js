import { z } from "zod";

export const deleteTodoTool = {
  name: "delete_todo",
  schema: z.object({
    id: z.string(),
  }),
  execute: async ({ id }) => {
    const res = await fetch(`http://localhost:5000/api/v1/assistant/todos/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  },
};