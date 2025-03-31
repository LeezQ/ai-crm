import { NextResponse } from "next/server";
import { db } from "@/db";
import { opportunities, users } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const offset = (page - 1) * pageSize;

    // 获取总记录数
    const [{ total }] = await db
      .select({
        total: sql<number>`count(*)::int`,
      })
      .from(opportunities);

    // 获取分页数据
    const items = await db
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
        description: opportunities.description,
        ownerId: opportunities.ownerId,
        teamId: opportunities.teamId,
        expectedAmount: opportunities.expectedAmount,
        priority: opportunities.priority,
        source: opportunities.source,
        expectedCloseDate: opportunities.expectedCloseDate,
        createdAt: opportunities.createdAt,
        updatedAt: opportunities.updatedAt,
      })
      .from(opportunities)
      .orderBy(desc(opportunities.id))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("获取商机列表失败:", error);
    return NextResponse.json({ error: "获取商机列表失败" }, { status: 500 });
  }
}
