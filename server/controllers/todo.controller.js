import { Todo } from "../models/todo.model.js";

export const createTodo = async (req, res) => {
  const { title, userId } = req.body;
  try {
    if (!title || !userId) {
      return res.status(400).json({ message: "Title and userId are required" });
    }

    const todo = await Todo.create({title, userId});
    res.json(todo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodos = async (req, res) => {
  const userId = req.query.userId;
  try {
    const todos = await Todo.find({ userId });
    // if (todos.length === 0) {
    //   return res.json({ message: "No todos found" });
    // }

    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(todo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
