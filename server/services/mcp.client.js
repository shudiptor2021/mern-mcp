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

export const callMCP = async (toolName, args) => {
  try {
    const res = await axios.post(
      "http://localhost:4000/mcp",
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
          "Accept": "application/json, text/event-stream" , // <--- required
        },
      }
    );

    return res.data.result;
  } catch (err) {
    console.error("MCP call failed:", err.response?.data || err.message);
    throw err;
  }
};