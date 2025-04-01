import { db } from "../db";
import { opportunities } from "../db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Context } from "hono";
import { User } from "../utils/jwt";

interface OpportunityCreateData {
  companyName: string;
  website?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactWechat?: string;
  contactDepartment?: string;
  contactPosition?: string;
  companySize?: string;
  region?: string;
  industry?: string;
  status?: string; // 'active' in schema, 'new'/'following' etc from form
  priority?: string; // 'normal' in schema, 'high'/'medium'/'low' from form
  description?: string;
  source?: string;
  expectedCloseDate?: string | null;
  ownerId: number; // Required
  teamId?: number;
  // progress is omitted, will use default 'initial'
}

export const opportunityController = {
  async create(data: OpportunityCreateData) {
    const [opportunity] = await db
      .insert(opportunities)
      .values({
        companyName: data.companyName,
        website: data.website,
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        contactWechat: data.contactWechat,
        contactDepartment: data.contactDepartment,
        contactPosition: data.contactPosition,
        companySize: data.companySize,
        region: data.region,
        industry: data.industry,
        // progress: will use default 'initial'
        status: data.status || "active", // Use form status or default
        priority: data.priority || "normal", // Use form priority or default
        description: data.description,
        source: data.source,
        expectedCloseDate: data.expectedCloseDate
          ? new Date(data.expectedCloseDate)
          : null,
        ownerId: data.ownerId,
        teamId: data.teamId,
        // createdAt/updatedAt will use default
      })
      .returning();
    return opportunity;
  },

  async list(params: { page: string; pageSize: string }) {
    const page = parseInt(params.page);
    const pageSize = parseInt(params.pageSize);
    const offset = (page - 1) * pageSize;

    const [total] = await db
      .select({ count: sql<number>`count(*)` })
      .from(opportunities);

    const items = await db
      .select()
      .from(opportunities)
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(opportunities.createdAt));

    return {
      items,
      pagination: {
        total: total.count,
        page,
        pageSize,
        totalPages: Math.ceil(total.count / pageSize),
      },
    };
  },

  async getById(id: number) {
    const [opportunity] = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.id, id));
    return opportunity;
  },

  async update(id: number, data: any) {
    const [opportunity] = await db
      .update(opportunities)
      .set({
        ...data,
        expectedCloseDate: data.expectedCloseDate
          ? new Date(data.expectedCloseDate)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(opportunities.id, id))
      .returning();
    return opportunity;
  },

  async delete(id: number) {
    const [opportunity] = await db
      .delete(opportunities)
      .where(eq(opportunities.id, id))
      .returning();
    return opportunity;
  },
};

export const opportunityRoutes = {
  create: async (c: Context) => {
    try {
      const user = c.get("user") as User & { currentTeamId: string };
      if (!user || !user.id) {
        return c.json({ error: "用户未认证或缺少用户信息" }, 401);
      }
      const body = await c.req.json();

      // Explicitly remove id from body before spreading
      const { id, ...restOfBody } = body;

      const createData: OpportunityCreateData = {
        ...restOfBody, // Use the rest of the body without id
        ownerId: user.id,
        teamId: user.currentTeamId ? parseInt(user.currentTeamId) : undefined,
      };
      const opportunity = await opportunityController.create(createData);
      return c.json(opportunity);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return c.json({ error: `创建商机失败: ${error.message}` }, 500);
      }
      return c.json({ error: "创建商机失败" }, 500);
    }
  },

  list: async (c: Context) => {
    try {
      const page = c.req.query("page") || "1";
      const pageSize = c.req.query("pageSize") || "10";
      const result = await opportunityController.list({ page, pageSize });
      return c.json(result);
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取商机列表失败" }, 500);
    }
  },

  getById: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const opportunity = await opportunityController.getById(id);
      if (!opportunity) {
        return c.json({ error: "商机不存在" }, 404);
      }
      return c.json(opportunity);
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取商机详情失败" }, 500);
    }
  },

  update: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const opportunity = await opportunityController.update(id, body);
      if (!opportunity) {
        return c.json({ error: "商机不存在" }, 404);
      }
      return c.json(opportunity);
    } catch (error) {
      console.error(error);
      return c.json({ error: "更新商机失败" }, 500);
    }
  },

  delete: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const opportunity = await opportunityController.delete(id);
      if (!opportunity) {
        return c.json({ error: "商机不存在" }, 404);
      }
      return c.json(opportunity);
    } catch (error) {
      console.error(error);
      return c.json({ error: "删除商机失败" }, 500);
    }
  },
};
