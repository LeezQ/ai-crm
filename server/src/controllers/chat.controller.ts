import { createOpenAI } from "@ai-sdk/openai";
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
  compatibility: "strict",
});

export const streamData = async (c: Context) => {
  try {
    const { messages } = await c.req.json();
    const model = customAPI("qwen-max");

    const result = streamText({
      model,
      prompt: messages[messages.length - 1].content,
    });

    c.header("Content-Type", "text/event-stream");
    c.header("Cache-Control", "no-cache");
    c.header("Connection", "keep-alive");

    return stream(c, (stream) => stream.pipe(result.textStream));
  } catch (error) {
    console.error("Error in streamData:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "聊天请求处理失败" },
      500
    );
  }
};
