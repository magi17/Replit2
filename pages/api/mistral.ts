import { NextApiRequest, NextApiResponse } from "next";
import { Mistral } from "@mistralai/mistralai";


const apiKey = "cixQtTuj5ql7j0mf25m79mk75n6jdPoU";
if (!apiKey) {
  throw new Error("Missing MISTRAL_API_KEY in .env.local file");
}

const client = new Mistral({ apiKey });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed. Use GET request." });
  }

  const { message } = req.query;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Message is required. Example: /api/chat?message=What%20is%20the%20best%20French%20cheese?",
    });
  }

  try {
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: message }],
    });

    const botResponse = chatResponse.choices[0]?.message.content || "No response received";
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
}