import express from "express";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";
import todoRouter from "./routes/todo.routes.js";
import googleCaneldarRouter from "./routes/googleAuth.routes.js"; 
import googleAuthRouter from "./routes/user.routes.js"; 
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
await connectDB();

// middlewares
// app.use(cors());
app.use(
    cors({
        origin: "https://mern-mcp-frontend.vercel.app",
        // origin: "http://localhost:3000",
        credentials: true,
    })
)
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/assistant', chatRouter);
app.use("/api/v1/assistant/todos", todoRouter);
app.use("/api/v1/auth/google/calendar", googleCaneldarRouter);
app.use("/api/v1/auth", googleAuthRouter);


// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// default error handler
const errorHandler = (err, req, res, next) => {
    if(res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err.message });
};

app.use(errorHandler);

app.listen(5000, ()=> {
    console.log("Server on running on port 5000")
})