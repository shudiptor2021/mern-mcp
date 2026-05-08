import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: String,
    role: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", chatSchema);