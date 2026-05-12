import { create } from "zustand";
import * as api from "@/lib/api";

export const useTodoStore = create((set) => ({
  todos: [],

  fetchTodos: async () => {
    const data = await api.getTodos();
    set({ todos: data });
  },

  addTodo: async (title: string) => {
    await api.createTodo(title);
    const data = await api.getTodos();
    set({ todos: data });
  },

  toggleTodo: async (id: string, completed: boolean) => {
    await api.updateTodo(id, completed);
    const data = await api.getTodos();
    set({ todos: data });
  },

  deleteTodo: async (id: string) => {
    await api.deleteTodo(id);
    const data = await api.getTodos();
    set({ todos: data });
  },
}));