export const getTodosTool = {
  name: "get_todos",
  schema: {},
  execute: async () => {
    const res = await fetch("http://localhost:5000/api/v1/assistant/todos");
    return await res.json();
  },
};