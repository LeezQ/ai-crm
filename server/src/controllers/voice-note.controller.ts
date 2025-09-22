import { Context } from "hono";
import { db } from "../db";
import { voiceNotes, opportunities } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { promises as fs } from "fs";
import { createReadStream } from "fs";
import path from "path";
import { generateObject } from "ai";
import { z } from "zod";
import { getChatModel, getTranscribeClient, AIConfigError, isAIConfigured } from "../services/ai";

const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/webm",
  "audio/ogg",
]);

const summarySchema = z.object({
  summary: z.string(),
  actionItems: z.array(z.string()).default([]),
  followUps: z.array(z.string()).default([]),
  sentiment: z.enum(["positive", "neutral", "negative"]).default("neutral"),
});

async function ensureDirectory(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function saveFile(buffer: Buffer, filename: string, baseDir: string) {
  await ensureDirectory(baseDir);
  const filePath = path.join(baseDir, filename);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

async function transcribeAudio(filePath: string) {
  const { client, model } = getTranscribeClient();
  return client.audio.transcriptions.create({
    file: createReadStream(filePath),
    model,
    response_format: "text",
  });
}

export const voiceNoteController = {
  list: async (c: Context) => {
    try {
      const opportunityId = parseInt(c.req.param("id"));
      const user = c.get("user");
      if (Number.isNaN(opportunityId)) {
        return c.json({ error: "无效的商机 ID" }, 400);
      }

      const records = await db
        .select({
          id: voiceNotes.id,
          filename: voiceNotes.filename,
          mimeType: voiceNotes.mimeType,
          transcript: voiceNotes.transcript,
          summary: voiceNotes.summary,
          status: voiceNotes.status,
          aiMetadata: voiceNotes.aiMetadata,
          createdAt: voiceNotes.createdAt,
        })
        .from(voiceNotes)
        .where(eq(voiceNotes.opportunityId, opportunityId))
        .orderBy(desc(voiceNotes.createdAt));

      return c.json(records);
    } catch (error) {
      console.error("获取语音摘要失败:", error);
      return c.json({ error: "获取语音记录失败" }, 500);
    }
  },

  upload: async (c: Context) => {
    try {
      if (!isAIConfigured()) {
        return c.json({ error: "AI 功能未配置，请联系管理员" }, 503);
      }

      const opportunityId = parseInt(c.req.param("id"));
      if (Number.isNaN(opportunityId)) {
        return c.json({ error: "无效的商机 ID" }, 400);
      }

      const user = c.get("user");
      if (!user?.id) {
        return c.json({ error: "未授权" }, 401);
      }

      const opportunityExists = await db
        .select({ id: opportunities.id })
        .from(opportunities)
        .where(eq(opportunities.id, opportunityId));

      if (opportunityExists.length === 0) {
        return c.json({ error: "商机不存在" }, 404);
      }

      const body = await c.req.parseBody();
      const file = body.file as File | undefined;
      const note = typeof body.note === "string" ? body.note : undefined;

      if (!file) {
        return c.json({ error: "请上传语音文件" }, 400);
      }

      if (!SUPPORTED_AUDIO_TYPES.has(file.type)) {
        return c.json({ error: "不支持的音频格式" }, 400);
      }

      const voiceDir = process.env.VOICE_NOTES_DIR || path.resolve(process.cwd(), "voice-notes");
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]+/g, "_")}`;
      const filePath = await saveFile(fileBuffer, safeName, voiceDir);

      const [record] = await db
        .insert(voiceNotes)
        .values({
          opportunityId,
          teamId: user.currentTeamId ? parseInt(user.currentTeamId) : null,
          userId: user.id,
          filename: file.name,
          filePath,
          mimeType: file.type,
          status: "processing",
          aiMetadata: note ? { note } : null,
        })
        .returning();

      try {
        const transcription = await transcribeAudio(filePath);
        const transcriptText = typeof transcription === "string" ? transcription : (transcription as any)?.text || "";

        const summaryResult = await generateObject({
          model: getChatModel("insight"),
          schema: summarySchema,
          prompt: `你是一名销售经理助手。请根据以下通话文字记录生成简明摘要、主要行动事项和后续跟进建议，输出中文。\n\n通话记录:\n${transcriptText}`,
        });

        const { summary, actionItems, followUps, sentiment } = summaryResult.object;

        const [updated] = await db
          .update(voiceNotes)
          .set({
            transcript: transcriptText,
            summary,
            status: "completed",
            aiMetadata: {
              actionItems,
              followUps,
              sentiment,
              note,
            },
            updatedAt: new Date(),
          })
          .where(eq(voiceNotes.id, record.id))
          .returning();

        return c.json(updated);
      } catch (error) {
        console.error("语音处理失败:", error);
        await db
          .update(voiceNotes)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(voiceNotes.id, record.id));
        if (error instanceof AIConfigError) {
          return c.json({ error: error.message }, 503);
        }
        return c.json({ error: "语音处理失败，请稍后重试" }, 500);
      }
    } catch (error) {
      console.error("上传语音笔记失败:", error);
      if (error instanceof AIConfigError) {
        return c.json({ error: error.message }, 503);
      }
      return c.json({ error: "上传语音失败" }, 500);
    }
  },
};
