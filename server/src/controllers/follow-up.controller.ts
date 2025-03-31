import { Context } from "hono";
import { db } from "@/db";
import { followUps, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getFollowUps = async (c: Context) => {
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
      .orderBy(followUps.createdAt);

    return c.json(followUpRecords);
  } catch (error) {
    return c.json({ error: "获取跟进记录失败" }, 500);
  }
};

export const createFollowUp = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();

    const [newFollowUp] = await db
      .insert(followUps)
      .values({
        opportunityId: parseInt(id),
        type: data.type,
        content: data.content,
        result: data.result,
        nextPlan: data.nextPlan,
        creatorId: c.get("user").id,
      })
      .returning({
        id: followUps.id,
        type: followUps.type,
        content: followUps.content,
        result: followUps.result,
        nextPlan: followUps.nextPlan,
        createTime: followUps.createdAt,
      });

    return c.json(newFollowUp);
  } catch (error) {
    return c.json({ error: "创建跟进记录失败" }, 500);
  }
};
