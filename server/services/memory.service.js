// services/memory.service.js
import Chat from "../models/chat.model.js";

const MAX_HISTORY = 20;
const MAX_DB = 20;

export const saveMessage = async (userId, role, content) => {
  await Chat.create({ userId, role, content });

  // old delete content
  const count = await Chat.countDocuments({ userId });

  if (count > MAX_DB) {
    const oldChats = await Chat.find({ userId })
      .sort({ createdAt: 1 }) // oldest first
      .limit(count - MAX_DB)
      .select("_id");

    const ids = oldChats.map(c => c._id);

    await Chat.deleteMany({ _id: { $in: ids } });
  }
};

// get all history
export const getHistory = async (userId) => {
  const chats = await Chat.find({ userId })
    .sort({ createdAt: -1 })
    .limit(MAX_HISTORY)
    .lean();

  return chats.reverse().map(c => ({
    role: c.role,
    content: c.content,
    // parts: [{ text: c.content }]
  }));
};