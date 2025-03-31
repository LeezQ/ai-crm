import { Context } from "hono";
import { db } from "@/db";
import { opportunities, users, teamMembers } from "../db/schema";
import { eq, sql, desc, and } from "drizzle-orm";

export const getOpportunities = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const { page = 1, pageSize = 10 } = c.req.query();
    const offset = (Number(page) - 1) * Number(pageSize);

    const userTeams = await db
      .select({
        teamId: teamMembers.teamId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, userId));

    const teamIds = userTeams.map((team) => team.teamId).filter(Boolean);

    const whereConditions = [eq(opportunities.ownerId, userId)];
    if (teamIds.length > 0) {
      whereConditions.push(sql`${opportunities.teamId} = ANY(${teamIds})`);
    }

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
    return c.json({ error: "获取商机列表失败" }, 500);
  }
};

export const getOpportunity = async (c: Context) => {
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
    return c.json({ error: "获取商机详情失败" }, 500);
  }
};
