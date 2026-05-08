import { z } from "zod";

export const createTodoTool = {
  name: "create_todo",
  schema: z.object({
    title: z.string(),
  }),
  execute: async ({ title }) => {
    const res = await fetch("http://localhost:5000/api/v1/assistant/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    return await res.json();
  },
};