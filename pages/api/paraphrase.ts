import type { NextApiRequest, NextApiResponse } from 'next';

if(!process.env.NEXT_PUBLIC_ENV_VARIABLE_OPEN_AI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export type ChatGPTAgent = 'user' | 'system';

interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: String;
}

interface PromptPayload {
  model: String;
  messages: ChatGPTMessage[];
  temperature: Number;
  max_tokens: Number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return new Response("No prompt in the request", { status: 400 });

      const payload: PromptPayload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "prompt" }],
        temperature: 1,
        max_tokens: 500
      };

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_VARIABLE_OPEN_AI_API_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return res.json(data);
    }
  } catch(error) {
    console.log("The error: ", error)
  }
};

export default handler;
