import { create } from "zustand";
import * as api from "@/lib/api";

export const useTodoStore = create((set) => ({
  todos: [],

  fetchTodos: async (userId: string) => {
    const data = await api.getTodos(userId);
    set({ todos: data });
  },

  addTodo: async (title: string, userId: string) => {
    await api.createTodo(title, userId);
    const data = await api.getTodos(userId);
    set({ todos: data });
  },

  toggleTodo: async (id: string, completed: boolean, userId: string) => {
    await api.updateTodo(id, completed);
    const data = await api.getTodos(userId);
    set({ todos: data });
  },

  deleteTodo: async (id: string, userId: string) => {
    await api.deleteTodo(id);
    const data = await api.getTodos(userId);
    set({ todos: data });
  },
}));