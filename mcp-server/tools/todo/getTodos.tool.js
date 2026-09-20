import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export const getTodosTool = {
  name: "get_todos",
  schema: z.object({}),
  execute: async ({ userId }) => {
    const res = await fetch(`${BACKEND_URL}/api/v1/assistant/todos?userId=${userId}`);
    return await res.json();
  },
};