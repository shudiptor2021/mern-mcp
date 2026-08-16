import axios from "axios";

// export const callMCP = async (toolName, args) => {
//   const res = await axios.post(
//     "http://localhost:4000/mcp",
//     {
//       method: "tools/call",
//       params: {
//         name: toolName,
//         arguments: args,
//       },
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json", // 🔥 VERY IMPORTANT
//         "Connection": "keep-alive",
//       },
//     }
//   );

//   return res.data;
// };

// export const callMCP = async (toolName, args) => {
//   const res = await axios.post("http://localhost:4000/mcp", {
//     type: "tool_call",
//     tool_name: toolName,
//     arguments: args,
//   }, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//   return res.data;
// };

export const callMCP = async (toolName, args, userId) => {
  try {

    console.log("========== MCP CALL ==========");
    console.log("toolName:", toolName);
    console.log("args:", args);
    console.log("userId:", userId);

    const res = await axios.post(
      // "http://localhost:4000/mcp",
      "https://mern-mcp-server.vercel.app/mcp",
      {
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
          "Accept": "application/json, text/event-stream" , // <--- required
        },
        timeout: 15000,
      }
    );

    console.log("MCP STATUS:", res.status);
    console.log("MCP RESPONSE:", res.data);

    return res.data.result;
  } catch (err) {
    console.error("MCP call failed:", err.response?.data || err.message);
    console.error("========== MCP ERROR ==========");
    console.error("message:", err.message);
    console.error("status:", err.response?.status);
    throw err;
  }
};