import { db } from "../db";
import { teams, teamMembers, users } from "../db/schema";
import { eq, sql, count, and } from "drizzle-orm";
import { Context } from "hono";

export const teamController = {
  // 创建团队
  async createTeam(name: string, description?: string, ownerId?: number) {
    const [newTeam] = await db
      .insert(teams)
      .values({ name, description })
      .returning();
    // If ownerId is provided, add the owner as the first member (admin)
    if (newTeam && ownerId) {
      await db
        .insert(teamMembers)
        .values({ teamId: newTeam.id, userId: ownerId, role: "admin" });
    }
    return newTeam;
  },

  // 列出团队 (带成员数量和管理员信息)
  async listTeams() {
    // Subquery to count members per team
    const memberCountSq = db
      .select({
        teamId: teamMembers.teamId,
        count: sql<number>`count(${teamMembers.id})`.as("member_count"),
      })
      .from(teamMembers)
      .groupBy(teamMembers.teamId)
      .as("member_counts");

    // We will join users table directly to get admin info
    const teamList = await db
      .select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
        createdAt: teams.createdAt,
        memberCount: sql<number>`coalesce(${memberCountSq.count}, 0)`,
        adminName: users.name, // Select admin name directly
        adminId: users.id, // Select admin id directly
      })
      .from(teams)
      .leftJoin(memberCountSq, eq(teams.id, memberCountSq.teamId))
      // Join teamMembers to find the admin
      .leftJoin(
        teamMembers,
        and(eq(teams.id, teamMembers.teamId), eq(teamMembers.role, "admin"))
      )
      // Join users table based on the admin member found
      .leftJoin(users, eq(teamMembers.userId, users.id));

    // Since the joins might produce multiple rows if a team has multiple admins or members,
    // we need to process the result to ensure one entry per team.
    // A simple approach for now: assume one admin or take the first found.
    // For better accuracy, grouping in SQL or post-processing might be needed.

    // Basic post-processing to deduplicate based on team id
    const processedList = teamList.reduce((acc, current) => {
      if (!acc[current.id]) {
        acc[current.id] = {
          id: current.id,
          name: current.name,
          description: current.description || "",
          memberCount: current.memberCount,
          createTime: current.createdAt?.toISOString(),
          admin: current.adminName || "N/A", // Use the name from the join
        };
      }
      return acc;
    }, {} as Record<number, any>); // Use team id as key

    return Object.values(processedList); // Return array of unique teams
  },

  // 获取团队详情
  async getTeamById(id: number) {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  },

  // 更新团队
  async updateTeam(id: number, name?: string, description?: string) {
    const updateData: Partial<{
      name: string;
      description: string;
      updatedAt: Date;
    }> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (Object.keys(updateData).length === 0) {
      // Nothing to update, maybe return the existing team or throw an error
      return this.getTeamById(id);
    }
    updateData.updatedAt = new Date();
    const [updatedTeam] = await db
      .update(teams)
      .set(updateData)
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  },

  // 删除团队 (考虑级联删除或成员处理)
  async deleteTeam(id: number) {
    // WARNING: This only deletes the team, not the members association.
    // You might need to delete related teamMembers first or use CASCADE constraints.
    const [deletedTeam] = await db
      .delete(teams)
      .where(eq(teams.id, id))
      .returning();
    // Consider deleting teamMembers associated with this teamId here
    // await db.delete(teamMembers).where(eq(teamMembers.teamId, id));
    return deletedTeam;
  },
};

// Hono 路由处理函数
export const teamRoutes = {
  create: async (c: Context) => {
    try {
      const user = c.get("user") as any; // Assuming user is set in middleware
      const { name, description } = await c.req.json();
      if (!name) return c.json({ error: "缺少团队名称" }, 400);
      const newTeam = await teamController.createTeam(
        name,
        description,
        user?.id
      );
      return c.json(newTeam, 201);
    } catch (error) {
      console.error(error);
      return c.json({ error: "创建团队失败" }, 500);
    }
  },

  list: async (c: Context) => {
    try {
      const teamsList = await teamController.listTeams();
      return c.json(teamsList);
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取团队列表失败" }, 500);
    }
  },

  getById: async (c: Context) => {
    try {
      const teamId = parseInt(c.req.param("teamId"));
      if (isNaN(teamId)) return c.json({ error: "无效的团队 ID" }, 400);
      const team = await teamController.getTeamById(teamId);
      if (!team) return c.json({ error: "团队不存在" }, 404);
      return c.json(team);
    } catch (error) {
      console.error(error);
      return c.json({ error: "获取团队详情失败" }, 500);
    }
  },

  update: async (c: Context) => {
    try {
      const teamId = parseInt(c.req.param("teamId"));
      if (isNaN(teamId)) return c.json({ error: "无效的团队 ID" }, 400);
      const { name, description } = await c.req.json();
      // Add authorization check here: ensure user has permission to update
      const updatedTeam = await teamController.updateTeam(
        teamId,
        name,
        description
      );
      if (!updatedTeam) return c.json({ error: "团队不存在或更新失败" }, 404);
      return c.json(updatedTeam);
    } catch (error) {
      console.error(error);
      return c.json({ error: "更新团队失败" }, 500);
    }
  },

  delete: async (c: Context) => {
    try {
      const teamId = parseInt(c.req.param("teamId"));
      if (isNaN(teamId)) return c.json({ error: "无效的团队 ID" }, 400);
      // Add authorization check here: ensure user has permission to delete
      const deletedTeam = await teamController.deleteTeam(teamId);
      if (!deletedTeam) return c.json({ error: "团队不存在" }, 404);
      return c.json(deletedTeam);
    } catch (error) {
      console.error(error);
      return c.json({ error: "删除团队失败" }, 500);
    }
  },
};
