import { google } from "googleapis";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const url = auth.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar"],
  prompt: "consent",
});

console.log("Open this URL in your browser:\n", url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await auth.getToken(code);
    console.log("Here are your tokens:", tokens);
  } catch (error) {
    console.error("Error retrieving tokens:", error);
  } finally {
    rl.close();
  }
});