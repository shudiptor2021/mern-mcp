"use client";

import { useEffect, useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoItem from "./TodoItem";

export default function TodoList({ userId }: { userId: string }) {
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo } =
    useTodoStore() as any;

  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos(userId);
  }, [userId]);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Todos</h1>

      <div className="flex gap-2 ">
        <input
          className="flex-1 p-2 bg-gray-200 text-black/80 rounded font-semibold cursor-pointer"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New todo"
          disabled={!userId}
        />
        <button
          onClick={() => {
            addTodo(input, userId);
            setInput("");
          }}
          className="bg-green-600 px-3 rounded cursor-pointer"
          disabled={!userId}
        >
          Add
        </button>
      </div>

      {!userId && (
        <p className="text-red-400 text-xl font-semibold">
          Please log in to manage your todos.
        </p>
      )}

      {todos?.length === 0 && <p className="text-gray-500">No todos yet.</p>}

      {todos?.map((todo: any) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          userId={userId}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}
