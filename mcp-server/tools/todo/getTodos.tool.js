import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api/v1/assistant";

export const getTodosTool = {
  name: "get_todos",
  schema: z.object({}),
  execute: async ({ userId }) => {
    const res = await fetch(`${BACKEND_URL}/todos?userId=${userId}`);
    return await res.json();
  },
};