"use client";

import { useEffect, useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import TodoItem from "./TodoItem";

export default function TodoList({userId}: {userId: string}) {
  const { todos, fetchTodos, addTodo, toggleTodo, deleteTodo } =
    useTodoStore() as any;

  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos(userId);
  }, [userId]);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Todos</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 bg-gray-200 text-black/80 rounded font-semibold"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => {
            addTodo(input, userId);
            setInput("");
          }}
          className="bg-green-600 px-3 rounded"
        >
          Add
        </button>
      </div>

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