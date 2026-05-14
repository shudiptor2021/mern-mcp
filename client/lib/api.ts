const BASE_URL = "http://localhost:5000/api/v1/assistant"; // backend

export const sendMessage = async (message: string, accessToken: string, userId: string, onChunk: (chunk: string) => void) => {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      message,
      userId
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

// log in with google
export const googleLogin = async () => {
    window.location.href =
  "http://localhost:5000/api/v1/auth/google";
};

// connect with google calendar
export const googleCalendarConnect = async (userId: string) => {
    window.location.href =
  `http://localhost:5000/api/v1/auth/google/calendar/connect?userId=${userId}`;
};


// TODOS
export const getTodos = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/todos?userId=${userId}`);
  return res.json();
};

export const createTodo = async (title: string, userId: string) => {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ title, userId }),
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