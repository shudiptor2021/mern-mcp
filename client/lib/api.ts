const BASE_URL = "http://localhost:5000/api/v1/assistant"; // backend

export const sendMessage = async (message: string, onChunk: (chunk: string) => void) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      userId: "demo-user",
    }),
  });

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    onChunk(chunk);
  }
};


// TODOS
export const getTodos = async () => {
  const res = await fetch(`${BASE_URL}/todos`);
  return res.json();
};

export const createTodo = async (title: string) => {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ title }),
  });
  return res.json();
};

export const updateTodo = async (id: string, completed: boolean) => {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ completed }),
  });
  return res.json();
};

export const deleteTodo = async (id: string) => {
  await fetch(`${BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });
};