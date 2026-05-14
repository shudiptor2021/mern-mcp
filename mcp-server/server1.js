import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { getMeetingsTool } from "./tools/getMeetings.tool.js";
import { createEventTool } from "./tools/createEvent.tool.js";
import { checkConflictTool } from "./tools/checkConflict.tool.js";
import { createTodoTool } from "./tools/todo/createTodo.tool.js";
import { getTodosTool } from "./tools/todo/getTodos.tool.js";
import { updateTodoTool } from "./tools/todo/updateTodo.tool.js";
import { deleteTodoTool } from "./tools/todo/deleteTodo.tool.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
await connectDB();

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    enableJsonResponse: true,
    useStandardContentType: true,
  });

  res.on("close", () => {
    transport.close();
  });

  try {
    // 🔥 new server per request
    const server = new McpServer({
      name: "calendar-mcp-pro",
      version: "2.0.0",
    });

    // re-register tools
    const register = (tool) => {
      server.registerTool(
        tool.name,
        {
          title: tool.name,
          inputSchema: tool.schema,
        },
        async (input) => ({
          content: [
            {
              type: "text",
              text: JSON.stringify(await tool.execute(input)),
            },
          ],
        }),
      );
    };

//     const register = (tool) => {
//   server.registerTool(
//     tool.name,
//     {
//       title: tool.name,
//       inputSchema: tool.schema,
//     },

//     async (input) => {
//       const finalInput = {
//         ...input,
//         userId: req.user._id.toString(),
//       };

//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify(
//               await tool.execute(finalInput)
//             ),
//           },
//         ],
//       };
//     }
//   );
// };

    // register google calendar tools
    register(getMeetingsTool);
    register(createEventTool);
    register(checkConflictTool);

    // register todo tools
    register(createTodoTool);
    register(getTodosTool);
    register(updateTodoTool);
    register(deleteTodoTool);

    await server.connect(transport); // ✅ now safe
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "MCP request failed" });
  }
});

// const server = new McpServer({
//   name: "calendar-mcp-pro",
//   version: "2.0.0",
// });

// // helper
// const register = (tool) => {
//   server.registerTool(
//     tool.name,
//     {
//       title: tool.name,
//       inputSchema: tool.schema,
//     },
//     async (input) => ({
//       content: [
//         {
//           type: "text",
//           text: JSON.stringify(await tool.execute(input)),
//         },
//       ],
//     })
//   );
// };

// // register all tools
// register(getMeetingsTool);
// register(createEventTool);
// register(checkConflictTool);

// // routes
// app.use("/mcp", (req, res, next) => {
//   req.headers.accept = "application/json";
//   next();
// });

// app.post("/mcp", async (req, res) => {

//   const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });

//   res.on("close", () => {
//     transport.close();
//   });

//   try {
//     await server.connect(transport); // connect MCP server to this transport
//     await transport.handleRequest(req, res, req.body); // handle the incoming request
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "MCP request failed" });
//   }
// });

// app.get("/health", (_req, res) => {
//   res.json({ status: "ok" });
// });

// app.listen(4000, () => {
//   console.log("MCP Server running on port 4000");
// });

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => {
  console.log("MCP Server running on port 4000");
});
