"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { sendMessage } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import { FaArrowUp } from "react-icons/fa";


export default function ChatBox({userId, accessToken}: {userId: string, accessToken: string}) {
  const { messages, addMessage, updateLastMessage } = useChatStore();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;

    addMessage({ role: "user", content: input });
    addMessage({ role: "assistant", content: "" });

    const userInput = input;
    setInput("");

    await sendMessage(userInput, accessToken, userId, (chunk) => {
      updateLastMessage(chunk);
    });
  };

  return (
    <div className="flex flex-col w-full max-w-4xl min-h-175 p-4 mt-16">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}
      </div>
      {!userId && (
        <p className="top-52 text-red-400 text-xl font-semibold text-center">
          Please log in to chat with the assistant.
        </p>
      )}

      <div className="flex gap-2 mt-4 sticky bottom-10">
        <input
          className="flex-1 py-2 px-5 rounded-3xl bg-gray-200 text-black/80 font-semibold"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!userId}
        />
        <button onClick={handleSend} disabled={!userId} className="bg-gray-400 hover:bg-gray-400 hover:text-blue-600 cursor-pointer p-4 rounded-full">
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
}