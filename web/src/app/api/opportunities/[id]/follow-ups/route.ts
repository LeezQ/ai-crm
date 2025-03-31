import { NextResponse } from "next/server";
import { db } from "@/db";
import { followUps, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
      .where(eq(followUps.opportunityId, parseInt(params.id)))
      .orderBy(followUps.createdAt);

    return NextResponse.json(followUpRecords);
  } catch (error) {
    console.error("获取跟进记录失败:", error);
    return NextResponse.json({ error: "获取跟进记录失败" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const [newFollowUp] = await db
      .insert(followUps)
      .values({
        opportunityId: parseInt(params.id),
        type: data.type,
        content: data.content,
        result: data.result,
        nextPlan: data.nextPlan,
        creatorId: data.creatorId, // 需要从会话中获取当前用户ID
      })
      .returning({
        id: followUps.id,
        type: followUps.type,
        content: followUps.content,
        result: followUps.result,
        nextPlan: followUps.nextPlan,
        createTime: followUps.createdAt,
      });

    return NextResponse.json(newFollowUp);
  } catch (error) {
    console.error("创建跟进记录失败:", error);
    return NextResponse.json({ error: "创建跟进记录失败" }, { status: 500 });
  }
}
