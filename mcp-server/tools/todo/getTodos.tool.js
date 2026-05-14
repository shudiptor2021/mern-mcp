export const getTodosTool = {
  name: "get_todos",
  schema: {},
  execute: async ({ userId }) => {
    const res = await fetch(`http://localhost:5000/api/v1/assistant/todos?userId=${userId}`);
    return await res.json();
  },
};