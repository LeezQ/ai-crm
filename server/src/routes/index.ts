import { Hono } from "hono";
import {
  login,
  getProfile,
  register,
  updateProfile,
  changePassword,
  updateSettings,
} from "../controllers/user.controller";
import { opportunityRoutes } from "../controllers/opportunity";
import { teamRoutes } from "../controllers/team";
import { teamMemberRoutes } from "../controllers/teamMember";
import { streamData } from "../controllers/chat.controller";
import { getDashboardData } from "../controllers/dashboard";

const app = new Hono();

// 用户相关路由
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/user/profile", getProfile);
app.patch("/api/user/profile", updateProfile);
app.post("/api/user/change-password", changePassword);
app.patch("/api/user/settings", updateSettings);

// 团队相关路由
app.post("/api/teams", teamRoutes.create);
app.get("/api/teams", teamRoutes.list);
app.get("/api/teams/:teamId", teamRoutes.getById);
app.put("/api/teams/:teamId", teamRoutes.update);
app.delete("/api/teams/:teamId", teamRoutes.delete);

// 团队成员相关路由
app.get("/api/teams/:teamId/members", teamMemberRoutes.list);
app.post("/api/teams/:teamId/members", teamMemberRoutes.add);
app.delete("/api/teams/:teamId/members/:memberId", teamMemberRoutes.remove);

// 商机相关路由
app.post("/api/opportunities", opportunityRoutes.create);
app.get("/api/opportunities", opportunityRoutes.list);
app.get("/api/opportunities/:id", opportunityRoutes.getById);
app.put("/api/opportunities/:id", opportunityRoutes.update);
app.delete("/api/opportunities/:id", opportunityRoutes.delete);

// 跟进相关路由
app.get("/api/opportunities/:id/follow-ups", opportunityRoutes.getFollowUps);
app.post("/api/opportunities/:id/follow-ups", opportunityRoutes.createFollowUp);

// 聊天相关路由
app.post("/api/ai/chat", streamData);

// Dashboard routes
app.get("/api/dashboard", getDashboardData);

export const routes = app;
