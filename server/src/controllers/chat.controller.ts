import { createOpenAI, openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Context } from "hono";
import { stream } from "hono/streaming";

interface Message {
  role: string;
  content: string;
}

const customAPI = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.sealos.vip/v1",
  apiKey:
    process.env.OPENAI_API_KEY ||
    "sk-DtkY5AgFJeSyUE5iC0B9773c56B744299f9292Ef8984F5D9",
});

const model = customAPI("gpt-4o-mini");

export const streamData = async (c: Context) => {
  const { messages } = await c.req.json();

  const result = streamText({
    model: model,
    messages,
  });

  // 标记响应为v1数据流
  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  // 使用Hono的stream直接传输数据流
  return stream(c, (stream) => stream.pipe(result.toDataStream()));
};
