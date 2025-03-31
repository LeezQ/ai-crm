import { Hono } from "hono";
import {
  getOpportunities,
  getOpportunity,
} from "../controllers/opportunity.controller";
import { login, getProfile } from "../controllers/user.controller";
import {
  getFollowUps,
  createFollowUp,
} from "../controllers/follow-up.controller";

const app = new Hono();

// 用户相关路由
app.post("/api/auth/login", login);
app.get("/api/user/profile", getProfile);

// 商机相关路由
app.get("/api/opportunities", getOpportunities);
app.get("/api/opportunities/:id", getOpportunity);

// 跟进相关路由
app.get("/api/opportunities/:id/follow-ups", getFollowUps);
app.post("/api/opportunities/:id/follow-ups", createFollowUp);

export const routes = app;
