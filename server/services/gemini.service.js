// import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { getHistory } from "./memory.service.js";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const runAgent = async (message, userId) => {
  try {
    const history = await getHistory(userId);
    // console.log(history)
    const result = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",

      messages: [
        {
          role: "system",
          // content: "You are a helpful AI assistant. Be concise and clear.",
          //           content: `
          // You are an AI assistant that MUST use tools when needed.

          // Rules:
          // - If user wants to schedule meeting → ALWAYS call create_event
          // - If time conflict possible → call check_conflict first
          // - Assume timezone Asia/Dhaka
          // - NEVER ask unnecessary questions
          // - Convert natural language time to ISO format
          // `
          content: `
You are an AI assistant.

Rules:
- ALWAYS use tools when needed
- timezone Asia/Dhaka
- return ISO format time
`,
        },
        ...history,
        {
          role: "user",
          content: message,
        },
      ],

      tools: [
        // todo tools
        // get todos tool
        {
          type: "function",
          function: {
            name: "get_todos",
            parameters: {
              type: "object",
              properties: {
                userId: { type: "string" },
              },
            },
          },
        },

        // create todo tool
        {
          type: "function",
          function: {
            name: "create_todo",
            description: "Create a new todo",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
              },
              required: ["title"],
            },
          },
        },

        // update todo tool
        {
          type: "function",
          function: {
            name: "update_todo",
            description: "Update todo completion",
            parameters: {
              type: "object",
              properties: {
                id: { type: "string" },
                completed: { type: "boolean" },
              },
              required: ["id", "completed"],
            },
          },
        },

        // delete todo tool
        {
          type: "function",
          function: {
            name: "delete_todo",
            description: "Delete a todo",
            parameters: {
              type: "object",
              properties: {
                id: { type: "string" },
              },
              required: ["id"],
            },
          },
        },

        // calendars and meetings tools
        // get meetings tool
        {
          type: "function",
          function: {
            name: "get_meetings_google_calendar",
            description:
              "Get upcoming meetings from the user's Google Calendar",
            parameters: {
              type: "object",
              properties: {
                userId: { type: "string" }
              },
              required: ["userId"],
            },
          },
        },
        // create event/meeting tool
        {
          type: "function",
          function: {
            name: "create_event",
            description: "Create a new calendar event",
            parameters: {
              type: "object",
              properties: {
                userId: { type: "string" },
                title: { type: "string" },
                start: { type: "string" },
                end: { type: "string" },
              },
              required: ["userId", "title", "start", "end"],
            },
          },
        },

        // check conflict tool
        {
          type: "function",
          function: {
            name: "check_conflict",
            description: "Check if a time conflicts with existing events",
            parameters: {
              type: "object",
              properties: {
                time: { type: "string" },
                userId: { type: "string" },
              },
              required: ["time", "userId"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const messageResponse = result.choices[0]?.message;

    // 🔥 check tool call
    const toolCall = messageResponse?.tool_calls?.[0];

    if (toolCall) {
      return {
        type: "tool",
        name: toolCall.function.name,
        args: JSON.parse(toolCall.function.arguments),
      };
    }

    return {
      type: "text",
      content: messageResponse?.content,
    };
  } catch (err) {
    console.log("FULL ERROR:", err.response?.data);
    console.log("ERROR MESSAGE:", err.message);

    return {
      type: "text",
      content: "AI error hoise পরে try করো",
    };
  }
};

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const runAgent = async (message) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//   });

//   const result = await model.generateContent({
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: message }],
//       },
//     ],
//     tools: [
//       {
//         functionDeclarations: [
//           {
//             name: "calculate-bmi",
//             parameters: {
//               type: "object",
//               properties: {
//                 weightKg: { type: "number" },
//                 heightM: { type: "number" },
//               },
//               required: ["weightKg", "heightM"],
//             },
//           },
//           {
//             name: "get-todos",
//             parameters: {
//               type: "object",
//               properties: {
//                 userId: { type: "string" },
//               },
//             },
//           },
//           {
//             name: "get-meetings",
//             parameters: {
//               type: "object",
//               properties: {},
//             },
//           },
//         ],
//       },
//     ],
//   });

//   const response = result.response;

//   // 🔥 check tool call
//   const toolCall = response.candidates?.[0]?.content?.parts?.find(
//     (p) => p.functionCall
//   );

//   if (toolCall) {
//     return {
//       type: "tool",
//       name: toolCall.functionCall.name,
//       args: toolCall.functionCall.args,
//     };
//   }

//   return {
//     type: "text",
//     content: response.text(),
//   };
// };
