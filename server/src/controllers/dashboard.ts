import { Context } from "hono";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { opportunities } from "../db/schema";

export async function getDashboardData(c: Context) {
  try {
    const user = c.get("user");
    // 确保有 user 和 user.id
    if (!user || !user.id) {
      return c.json({ error: "未授权" }, 401);
    }

    // 如果有 teamId，则使用 teamId，否则不过滤 teamId
    const teamId = c.get("teamId");
    const whereClause = teamId
      ? sql`${opportunities.teamId} = ${parseInt(teamId)}`
      : sql`1=1`; // 不过滤 teamId

    // 获取商机总数
    const [totalOpportunities] = await db
      .select({ count: sql<number>`count(*)` })
      .from(opportunities)
      .where(whereClause);

    // 获取不同状态的商机数量
    const statusCounts = await db
      .select({
        status: opportunities.status,
        count: sql<number>`count(*)`,
      })
      .from(opportunities)
      .where(whereClause)
      .groupBy(opportunities.status);

    // 获取最近创建的商机
    const recentOpportunities = await db
      .select({
        id: opportunities.id,
        companyName: opportunities.companyName,
        contactPerson: opportunities.contactPerson,
        status: opportunities.status,
        priority: opportunities.priority,
        expectedAmount: opportunities.expectedAmount,
        createdAt: opportunities.createdAt,
      })
      .from(opportunities)
      .where(whereClause)
      .orderBy(sql`${opportunities.createdAt} desc`)
      .limit(5);

    return c.json({
      totalOpportunities: totalOpportunities.count,
      statusCounts,
      recentOpportunities,
    });
  } catch (error) {
    console.error("获取仪表盘数据失败:", error);
    return c.json({ error: "获取仪表盘数据失败" }, 500);
  }
}
