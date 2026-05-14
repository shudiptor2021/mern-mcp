import { runAgent } from "../services/gemini.service.js";
import { callMCP } from "../services/mcp.client.js";
import { saveMessage } from "../services/memory.service.js";


export const handleChat = async (req, res) => {
  const { message, userId } = req.body;
  // const userId = req.user.id;

  // headers for streaming
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  // save the message first
  await saveMessage(userId, "user", message);

  // call ai
  const ai = await runAgent(message, userId);

  let finalText = "";

  // if tool call
  if (ai.type === "tool") {
    const result = await callMCP(ai.name, {
      ...ai.args,
      userId,
    });

  //   let cleanResult = "";

  // try {
  //   const text = result?.content?.[0]?.text;

  //   // যদি JSON string হয় → parse করো
  //   cleanResult = JSON.parse(text);
  // } catch (err) {
  //   console.error("Parse error:", err);
  //   cleanResult = result;
  // }
  const cleanResult = result?.content?.[0]?.text || JSON.stringify(result);

  const final = await runAgent(
`You are a helpful assistant.

The tool successfully returned data.

User question:
${message}

Tool result (authoritative data):
${typeof cleanResult === "string" 
  ? cleanResult 
  : JSON.stringify(cleanResult, null, 2)
}

Respond naturally and NEVER say the tool failed.`,
userId
);

//      const final = await runAgent(
//       `User asked: ${message}
// Tool result: ${JSON.stringify(cleanResult, null, 2)}
// Give a helpful natural response.`, userId
//     );
    console.log("Final AI:", final);

  finalText = final?.content || final?.text || "";
// ---------------------------------------
    // finalText = final.content;

    // return res.json({
    //   reply: final.content,
    // });
  } else {
    console.log("AI:", ai);

  finalText = ai?.content || ai?.text || "";
    // finalText = ai.content;
  }

  if (!finalText || typeof finalText !== "string") {
  console.error("Invalid finalText:", finalText);
  finalText = "Sorry, something went wrong.";
}

  try {
  // Typing effect simulation
  // for (let i = 0; i < finalText.length; i++) {
  //   res.write(finalText[i]); // send one char at a time
  //   await new Promise((r) => setTimeout(r, 20)); // speed control
  // }

  const chunkSize = 5;

for (let i = 0; i < finalText.length; i += chunkSize) {
  res.write(finalText.slice(i, i + chunkSize));
  await new Promise((r) => setTimeout(r, 20));
}

  await saveMessage(userId, "assistant", finalText);

  } catch (err) {
  console.error("Streaming error:", err);

  // client কে কিছু জানাও
  res.write("\n[Error occurred while streaming]");
  
} finally {
  res.end();

  // return res.json({
  //   reply: ai.content,
  // });
  }
};