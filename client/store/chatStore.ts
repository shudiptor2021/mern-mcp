import { create } from "zustand";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatState = {
  messages: Message[];
  addMessage: (msg: Message) => void;
  updateLastMessage: (chunk: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (chunk) =>
  set((state) => {
    const messages = [...state.messages];
    const last = { ...messages[messages.length - 1] };

    last.content += chunk;
    messages[messages.length - 1] = last;

    return { messages };
  }),
}));