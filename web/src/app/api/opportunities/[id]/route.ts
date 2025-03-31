import { NextResponse } from "next/server";
import { db } from "@/db";
import { opportunities, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
      .where(eq(opportunities.id, parseInt(params.id)));

    if (!opportunity) {
      return NextResponse.json({ error: "商机不存在" }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error("获取商机详情失败:", error);
    return NextResponse.json({ error: "获取商机详情失败" }, { status: 500 });
  }
}
