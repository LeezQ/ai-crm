import { db } from "../db";
import { teamMembers, users } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { Context } from "hono";

export const teamMemberController = {
  // 列出团队成员
  async listMembers(teamId: number) {
    const members = await db
      .select({
        memberId: teamMembers.id,
        userId: users.id,
        name: users.name,
        email: users.email,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
    return members;
  },

  // 添加团队成员 (通过用户邮箱查找并添加)
  async addMemberByEmail(
    teamId: number,
    userEmail: string,
    role: "admin" | "member" = "member"
  ) {
    // 1. 查找用户 ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, userEmail));
    if (!user) {
      throw new Error(`邮箱为 ${userEmail} 的用户不存在`);
    }
    const userId = user.id;

    // 2. 检查用户是否已在该团队
    const [existingMember] = await db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
      );
    if (existingMember) {
      throw new Error(`用户 ${userEmail} 已经是该团队成员`);
    }

    // 3. 添加成员
    const [newMember] = await db
      .insert(teamMembers)
      .values({ teamId, userId, role })
      .returning();
    return newMember;
  },

  // 移除团队成员 (通过 teamMember 记录的 ID)
  async removeMember(memberId: number) {
    const [deletedMember] = await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, memberId))
      // Only return columns that exist
      .returning({
        id: teamMembers.id,
        teamId: teamMembers.teamId,
        userId: teamMembers.userId,
        role: teamMembers.role,
      });
    if (!deletedMember) {
      throw new Error(`ID 为 ${memberId} 的团队成员记录不存在`);
    }
    return deletedMember;
  },
};

// Hono 路由处理函数
export const teamMemberRoutes = {
  list: async (c: Context) => {
    try {
      const teamId = parseInt(c.req.param("teamId"));
      if (isNaN(teamId)) return c.json({ error: "无效的团队 ID" }, 400);
      const members = await teamMemberController.listMembers(teamId);
      return c.json(members);
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取团队成员列表失败" }, 500);
    }
  },

  add: async (c: Context) => {
    try {
      const teamId = parseInt(c.req.param("teamId"));
      if (isNaN(teamId)) return c.json({ error: "无效的团队 ID" }, 400);
      const { email, role } = await c.req.json();
      if (!email) return c.json({ error: "缺少成员邮箱" }, 400);

      const newMember = await teamMemberController.addMemberByEmail(
        teamId,
        email,
        role
      );
      return c.json(newMember, 201);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "添加团队成员失败";
      // 根据错误类型返回不同状态码可能更好，例如用户不存在返回 404
      return c.json(
        { error: message },
        error instanceof Error &&
          (error.message.includes("不存在") || error.message.includes("已经是"))
          ? 400
          : 500
      );
    }
  },

  remove: async (c: Context) => {
    try {
      const teamId = parseInt(c.req.param("teamId")); // teamId 验证，确保权限
      const memberId = parseInt(c.req.param("memberId"));
      if (isNaN(teamId) || isNaN(memberId))
        return c.json({ error: "无效的团队 ID 或成员 ID" }, 400);

      // TODO: 添加权限检查，确保操作者有权管理该团队成员

      const deletedMember = await teamMemberController.removeMember(memberId);
      return c.json(deletedMember);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "移除团队成员失败";
      return c.json(
        { error: message },
        error instanceof Error && error.message.includes("不存在") ? 404 : 500
      );
    }
  },
};
