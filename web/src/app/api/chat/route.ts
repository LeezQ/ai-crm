import { createOpenAI, openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const customAPI = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.sealos.vip/v1",
  apiKey:
    process.env.OPENAI_API_KEY ||
    "sk-DtkY5AgFJeSyUE5iC0B9773c56B744299f9292Ef8984F5D9",
});

const model = customAPI("gpt-4o-mini");

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: model,
    messages,
  });

  return result.toDataStreamResponse();
}
