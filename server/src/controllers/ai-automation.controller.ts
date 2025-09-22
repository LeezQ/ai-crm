import { Context } from "hono";
import { z } from "zod";
import { generateObject } from "ai";
import { getChatModel, isAIConfigured, AIConfigError } from "../services/ai";
import { opportunityController } from "./opportunity";

const extractionSchema = z.object({
  opportunity: z
    .object({
      companyName: z.string().optional(),
      website: z.string().optional(),
      contactPerson: z.string().optional(),
      contactPhone: z.string().optional(),
      contactWechat: z.string().optional(),
      contactDepartment: z.string().optional(),
      contactPosition: z.string().optional(),
      companySize: z.string().optional(),
      region: z.string().optional(),
      industry: z.string().optional(),
      status: z.string().optional(),
      priority: z.string().optional(),
      expectedAmount: z.string().optional(),
      expectedCloseDate: z.string().optional(),
      description: z.string().optional(),
      source: z.string().optional(),
      nextFollowUpAt: z.string().optional(),
      nextFollowUpNote: z.string().optional(),
    })
    .optional(),
  followUp: z
    .object({
      type: z.string().optional(),
      content: z.string().optional(),
      result: z.string().optional(),
      nextPlan: z.string().optional(),
    })
    .optional(),
  confidence: z.number().min(0).max(1).default(0.6),
  summary: z.string().optional(),
});

const requestSchema = z.object({
  input: z.string().min(10, "请提供更完整的描述"),
  autoCreate: z.boolean().optional(),
});

export const aiAutomationController = {
  assistOpportunity: async (c: Context) => {
    try {
      if (!isAIConfigured()) {
        return c.json({ error: "AI 功能未配置，请联系管理员" }, 503);
      }

      const user = c.get("user");
      if (!user?.id) {
        return c.json({ error: "未授权" }, 401);
      }

      const body = requestSchema.parse(await c.req.json());

      const extraction = await generateObject({
        model: getChatModel("insight"),
        schema: extractionSchema,
        prompt: `你是一名 CRM 助手，请从以下输入中提取潜在客户信息，并尽量补全销售商机字段。
- 如果无法确定字段，则留空。
- expectedAmount 使用纯数字。
- status 可选: new, qualified, proposition, negotiation, closed_won, closed_lost。
- priority 可选: high, medium, low。
- followUp 如果文本中包含下一步行动，则填写。
输入：${body.input}`,
      });

      const structured = extraction.object;

      let created = null;
      const opportunityInput = structured.opportunity;

      if (body.autoCreate) {
        if (!opportunityInput || !opportunityInput.companyName) {
          return c.json(
            {
              error: "未识别到商机的必填字段（公司名称）",
            },
            400
          );
        }

        created = await opportunityController.create({
          ...opportunityInput,
          companyName: opportunityInput.companyName,
          ownerId: user.id,
          teamId: user.currentTeamId ? parseInt(user.currentTeamId) : undefined,
        });
      }

      return c.json({
        success: true,
        structured,
        autoCreated: Boolean(created),
        opportunity: created,
      });
    } catch (error) {
      console.error("AI 自动化生成商机失败:", error);
      if (error instanceof AIConfigError) {
        return c.json({ error: error.message }, 503);
      }
      if (error instanceof z.ZodError) {
        return c.json({ error: error.issues[0]?.message || "输入有误" }, 400);
      }
      return c.json({ error: "无法生成商机，请稍后再试" }, 500);
    }
  },
};
