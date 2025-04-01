import { Hono } from "hono";
import { login, getProfile } from "../controllers/user.controller";
import {
  getFollowUps,
  createFollowUp,
} from "../controllers/follow-up.controller";
import { opportunityRoutes } from "../controllers/opportunity";

const app = new Hono();

// 用户相关路由
app.post("/api/auth/login", login);
app.get("/api/user/profile", getProfile);

// 商机相关路由
app.post("/api/opportunities", opportunityRoutes.create);
app.get("/api/opportunities", opportunityRoutes.list);
app.get("/api/opportunities/:id", opportunityRoutes.getById);
app.put("/api/opportunities/:id", opportunityRoutes.update);
app.delete("/api/opportunities/:id", opportunityRoutes.delete);

// 跟进相关路由
app.get("/api/opportunities/:id/follow-ups", getFollowUps);
app.post("/api/opportunities/:id/follow-ups", createFollowUp);

export const routes = app;
