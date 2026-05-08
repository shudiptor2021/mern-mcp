import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import dotenv from "dotenv";
import { getMeetings } from "./tools/calendar.tool.js";
dotenv.config();

const app = express();
app.use(express.json());

const server = new McpServer({
  name: "my-mcp",
  version: "1.0.0",
});

// TODOS
server.registerTool(
  "get-todos",
  {
    title: "Get Todos",
    inputSchema: z.object({
      userId: z.string(),
    }),
  },
  async () => {
    return {
      content: [{ type: "text", text: "Todo: Learn AI, Build SaaS" }],
    };
  }
);

// MEETINGS
server.registerTool(
  "get_meetings_google_calendar",
  {
    title: "Get Meetings From Google Calendar",
    inputSchema: z.object({}),
  },
  async () => {
     const meetings = await getMeetings();
    return {
      content: [
    //     {
    //   type: "text",
    //   text: JSON.stringify(meetings, null, 2),
    // },
    // {
    //     type: "text",
    //     text: meetings.length
    //       ? meetings
    //           .map(
    //             (m, i) => `${i + 1}. ${m.summary} at ${m.time}`
    //           )
    //           .join("\n")
    //       : "No upcoming meetings found.",
    //   },
      ],
      content: [{ type: "text", text: JSON.stringify(meetings) }],
    };
  }
);

app.use("/mcp", (req, res, next) => {
  req.headers.accept = "application/json";
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy" });
});


// app.post("/mcp", async (req, res) => {
//   const transport = new StreamableHTTPServerTransport({
//     sessionIdGenerator: undefined,
//     enableJsonResponse: true,
//   });

//   res.on("close", () => {
//     transport.close();
//   });
//   await server.connect(transport);
//   await transport.handleRequest(req, res, req.body);
// });



app.post("/mcp", async (req, res) => {
  // console.log("HEADERS:", req.headers);
  // console.log("BODY:", req.body);
  const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });

  res.on("close", () => {
    transport.close();
  });

  try {
    await server.connect(transport); // connect MCP server to this transport
    await transport.handleRequest(req, res, req.body); // handle the incoming request
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "MCP request failed" });
  }
});

app.listen(4000, ()=> {
    console.log("Server on running on port 4000")
});