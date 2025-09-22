import { streamText } from "ai";
import { Context } from "hono";
import { stream } from "hono/streaming";
import { AIConfigError, getChatModel, isAIConfigured } from "../services/ai";

interface Message {
  role: string;
  content: string;
}

export const streamData = async (c: Context) => {
  try {
    if (!isAIConfigured()) {
      return c.json({ error: "AI 功能未配置，请联系管理员" }, 503);
    }

    // 解析请求体
    const { messages } = await c.req.json();

    // 创建AI流式响应
    const result = streamText({
      model: getChatModel("chat"),
      messages,
    });

    // 设置必要的响应头
    // 标记响应为 v1 数据流
    c.header("X-Vercel-AI-Data-Stream", "v1");
    c.header("Content-Type", "text/plain; charset=utf-8");

    // CORS 头
    c.header("Access-Control-Allow-Origin", "*");
    c.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // 直接使用 stream.pipe，完全按照文档实现
    return stream(c, async (streamObj) => {
      // 获取 Vercel AI SDK 的数据流
      const dataStream = result.toDataStream();

      try {
        // 如果无法使用pipe，则使用手动读取流的方式
        const reader = dataStream.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await streamObj.write(value);
        }
      } catch (error) {
        console.error("流式传输错误:", error);
        // 写入错误消息
        await streamObj.write(
          `\x00{"type":"error","value":"${String(error).replace(
            /"/g,
            '\\"'
          )}"}\x00\n`
        );
      }
    });
  } catch (error) {
    if (error instanceof AIConfigError) {
      return c.json({ error: error.message }, 503);
    }
    console.error("处理请求时出错:", error);
    c.status(500);
    return c.json({ error: "处理请求时出错" });
  }
};
