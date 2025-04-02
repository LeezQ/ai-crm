import { openai } from "@ai-sdk/openai";
import { createDataStream, streamText } from "ai";
import { Context } from "hono";
import { stream } from "hono/streaming";

export const streamData = async (c: Context) => {
  // immediately start streaming the response
  const model = openai("gpt-4o");
  const dataStream = createDataStream({
    execute: async (dataStreamWriter) => {
      dataStreamWriter.writeData("initialized call");

      const result = streamText({
        model,
        prompt: "Invent a new holiday and describe its traditions.",
      });

      result.mergeIntoDataStream(dataStreamWriter);
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });

  // Mark the response as a v1 data stream:
  c.header("X-Vercel-AI-Data-Stream", "v1");
  c.header("Content-Type", "text/plain; charset=utf-8");

  return stream(c, (stream) =>
    stream.pipe(dataStream.pipeThrough(new TextEncoderStream()))
  );
};
