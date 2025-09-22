import { Context } from "hono";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { getChatModel, isAIConfigured, AIConfigError } from "../services/ai";
import { db } from "../db";
import { opportunities, teamMembers } from "../db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

const insightPlanSchema = z.object({
  intent: z.enum([
    "count_opportunities",
    "sum_expected_amount",
    "status_breakdown",
  ]),
  filters: z
    .object({
      status: z.array(z.string()).optional(),
      timeframe: z
        .object({
          scope: z.enum(["all_time", "last_days", "between"]),
          lastDays: z.number().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  rationale: z.string().optional(),
});

function buildDateFilter(filter?: {
  scope: "all_time" | "last_days" | "between";
  lastDays?: number;
  startDate?: string;
  endDate?: string;
}) {
  if (!filter || filter.scope === "all_time") {
    return null;
  }

  if (filter.scope === "last_days" && filter.lastDays) {
    return sql`${opportunities.createdAt} >= now() - (${filter.lastDays} * interval '1 day')`;
  }

  if (filter.scope === "between" && filter.startDate && filter.endDate) {
    return sql`${opportunities.createdAt} BETWEEN ${new Date(
      filter.startDate
    )} AND ${new Date(filter.endDate)}`;
  }

  return null;
}

export const aiInsightController = {
  ask: async (c: Context) => {
    try {
      if (!isAIConfigured()) {
        return c.json({ error: "AI 功能未配置，请联系管理员" }, 503);
      }

      const user = c.get("user");
      if (!user?.id) {
        return c.json({ error: "未授权" }, 401);
      }

      const { question } = await c.req.json();
      if (!question || typeof question !== "string") {
        return c.json({ error: "请输入问题" }, 400);
      }

      const planResult = await generateObject({
        model: getChatModel("insight"),
        schema: insightPlanSchema,
        prompt: `你是 CRM 销售分析助手。请读取用户问题并给出最合适的数据分析意图。仅在以下意图中选择一个：\n- count_opportunities：统计商机数量\n- sum_expected_amount：计算预期成交金额总和\n- status_breakdown：按状态统计商机数量\n请根据问题同时判断需要的筛选条件，如状态或时间范围。问题：${question}`,
      });

      const plan = planResult.object;

      const filters = [] as any[];
      const isAdmin = user.role === "admin" || user.role === "manager";
      const currentTeamId = user.currentTeamId ? parseInt(user.currentTeamId) : null;

      if (currentTeamId) {
        filters.push(eq(opportunities.teamId, currentTeamId));
      } else if (!isAdmin) {
        const memberships = await db
          .select({ teamId: teamMembers.teamId })
          .from(teamMembers)
          .where(eq(teamMembers.userId, user.id));

        const teamIds = memberships.map((m) => m.teamId).filter(Boolean);
        if (teamIds.length > 0) {
          filters.push(inArray(opportunities.teamId, teamIds));
        } else {
          filters.push(eq(opportunities.ownerId, user.id));
        }
      }

      if (plan.filters?.status?.length) {
        filters.push(inArray(opportunities.status, plan.filters.status));
      }

      const timeframeClause = buildDateFilter(plan.filters?.timeframe);
      if (timeframeClause) {
        filters.push(timeframeClause);
      }

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      let data: unknown;

      if (plan.intent === "count_opportunities") {
        const [result] = await db
          .select({ value: sql<number>`count(*)::int` })
          .from(opportunities)
          .where(whereClause);
        data = { value: result?.value ?? 0 };
      } else if (plan.intent === "sum_expected_amount") {
        const [result] = await db
          .select({
            value: sql<string>`coalesce(sum(${opportunities.expectedAmount})::text, '0')`,
          })
          .from(opportunities)
          .where(whereClause);
        const numericValue = Number(result?.value ?? "0");
        data = { value: numericValue };
      } else if (plan.intent === "status_breakdown") {
        const results = await db
          .select({
            status: opportunities.status,
            count: sql<number>`count(*)::int`,
          })
          .from(opportunities)
          .where(whereClause)
          .groupBy(opportunities.status);
        data = results;
      } else {
        return c.json({ error: "暂不支持该问题类型" }, 400);
      }

      const summary = await generateText({
        model: getChatModel("insight"),
        system:
          "你是负责销售数据解释的分析师，请根据结构化数据输出简洁中文回答，避免虚构。",
        prompt: `用户的问题：${question}\nAI 解析意图：${plan.intent}\n筛选条件：${JSON.stringify(
          plan.filters || {}
        )}\n查询结果：${JSON.stringify(data)}\n请用 2-3 句话总结，并根据需要给出简单建议。`,
      });

      return c.json({
        success: true,
        intent: plan.intent,
        filters: plan.filters || {},
        data,
        answer: summary.text,
      });
    } catch (error) {
      console.error("处理 AI 数据问题失败:", error);
      if (error instanceof AIConfigError) {
        return c.json({ error: error.message }, 503);
      }
      return c.json({ error: "无法处理该问题，请稍后再试" }, 500);
    }
  },
};
