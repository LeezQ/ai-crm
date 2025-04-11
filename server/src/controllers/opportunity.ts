import { db } from "../db";
import { opportunities, users, teamMembers, followUps } from "../db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
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
    const pageSize = parseInt(params.pageSize || "20");
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
      const user = c.get("user") as User & { currentTeamId: string };
      const userId = user.id;
      const currentTeamId = user.currentTeamId
        ? parseInt(user.currentTeamId)
        : null;
      const isAdmin = user.role === "admin";
      const { page = "1", pageSize = "20" } = c.req.query();
      const offset = (Number(page) - 1) * Number(pageSize);

      // 如果是管理员，直接返回所有商机
      if (isAdmin) {
        const [{ total }] = await db
          .select({
            total: sql<number>`count(*)::int`,
          })
          .from(opportunities);

        const items = await db
          .select()
          .from(opportunities)
          .orderBy(desc(opportunities.id))
          .limit(Number(pageSize))
          .offset(offset);

        return c.json({
          items,
          pagination: {
            total,
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages: Math.ceil(total / Number(pageSize)),
          },
        });
      }

      // 非管理员，查询用户所在团队
      const userTeams = await db
        .select({
          teamId: teamMembers.teamId,
        })
        .from(teamMembers)
        .where(eq(teamMembers.userId, userId));

      const teamIds = userTeams.map((team) => team.teamId).filter(Boolean);

      // 构建查询条件
      const whereConditions = [];
      if (currentTeamId) {
        // 优先使用当前选择的团队
        whereConditions.push(eq(opportunities.teamId, currentTeamId));
      } else if (teamIds.length > 0) {
        // 如果未选择特定团队，则查询用户所有团队的商机
        whereConditions.push(
          sql`${opportunities.teamId} IN (${sql.join(teamIds, sql`, `)})`
        );
      }

      // 执行查询
      const [{ total }] = await db
        .select({
          total: sql<number>`count(*)::int`,
        })
        .from(opportunities)
        .where(and(...whereConditions));

      const items = await db
        .select()
        .from(opportunities)
        .where(and(...whereConditions))
        .orderBy(desc(opportunities.id))
        .limit(Number(pageSize))
        .offset(offset);

      return c.json({
        items,
        pagination: {
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil(total / Number(pageSize)),
        },
      });
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取商机列表失败" }, 500);
    }
  },

  getById: async (c: Context) => {
    try {
      const id = c.req.param("id");

      const [opportunity] = await db
        .select({
          id: opportunities.id,
          companyName: opportunities.companyName,
          website: opportunities.website,
          contactPerson: opportunities.contactPerson,
          contactPhone: opportunities.contactPhone,
          contactWechat: opportunities.contactWechat,
          contactDepartment: opportunities.contactDepartment,
          contactPosition: opportunities.contactPosition,
          companySize: opportunities.companySize,
          region: opportunities.region,
          industry: opportunities.industry,
          progress: opportunities.progress,
          status: opportunities.status,
          priority: opportunities.priority,
          description: opportunities.description,
          source: opportunities.source,
          expectedCloseDate: opportunities.expectedCloseDate,
          createTime: opportunities.createdAt,
          owner: users.name,
        })
        .from(opportunities)
        .leftJoin(users, eq(opportunities.ownerId, users.id))
        .where(eq(opportunities.id, parseInt(id)));

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

  getFollowUps: async (c: Context) => {
    try {
      const id = c.req.param("id");

      const followUpRecords = await db
        .select({
          id: followUps.id,
          type: followUps.type,
          content: followUps.content,
          result: followUps.result,
          nextPlan: followUps.nextPlan,
          creator: users.name,
          createTime: followUps.createdAt,
        })
        .from(followUps)
        .leftJoin(users, eq(followUps.creatorId, users.id))
        .where(eq(followUps.opportunityId, parseInt(id)))
        .orderBy(desc(followUps.createdAt));

      return c.json(followUpRecords);
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取跟进记录失败" }, 500);
    }
  },

  createFollowUp: async (c: Context) => {
    try {
      const id = c.req.param("id");
      const user = c.get("user") as User;
      const data = await c.req.json();

      const [newFollowUp] = await db
        .insert(followUps)
        .values({
          opportunityId: parseInt(id),
          type: data.type,
          content: data.content,
          result: data.result || "",
          nextPlan: data.nextPlan || "",
          creatorId: user.id,
        })
        .returning();

      // 获取创建者信息以返回完整记录
      const [record] = await db
        .select({
          id: followUps.id,
          type: followUps.type,
          content: followUps.content,
          result: followUps.result,
          nextPlan: followUps.nextPlan,
          creator: users.name,
          createTime: followUps.createdAt,
        })
        .from(followUps)
        .leftJoin(users, eq(followUps.creatorId, users.id))
        .where(eq(followUps.id, newFollowUp.id));

      return c.json(record);
    } catch (error) {
      console.error(error);
      return c.json({ error: "创建跟进记录失败" }, 500);
    }
  },
};
