import { createOpenAI, openai } from "@ai-sdk/openai";
import { createDataStream, streamText } from "ai";
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

  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      dataStreamWriter.writeData("初始化...");

      const result = streamText({
        model: model,
        messages,
      });

      result.mergeIntoDataStream(dataStreamWriter);
    },
    onError: (error) => {
      return error instanceof Error ? error.message : String(error);
    },
  });

  // 设置响应头
  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  return stream(c, (stream) =>
    stream.pipe(dataStream.pipeThrough(new TextEncoderStream()))
  );
};
