import "dotenv/config";
import { serve } from "@hono/node-server";
import console from "console";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { routes } from "./routes";
import { logger } from "hono/logger";
import { verifyToken, User } from "./utils/jwt";

const app = new Hono<{
  Variables: {
    user: User & { currentTeamId: string };
  };
}>();

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(logger());

// JWT 中间件
app.use("*", async (c, next) => {
  if (c.req.path === "/api/auth/login" || c.req.path === "/api/auth/register") {
    await next();
    return;
  }

  const authHeader = c.req.header("Authorization");
  const teamId = c.req.header("Teamid") as any;
  if (!authHeader) {
    return c.json({ error: "未提供认证信息" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ error: "无效的认证信息" }, 401);
  }

  try {
    const decoded = verifyToken(token);
    c.set("user", {
      ...decoded,
      currentTeamId: teamId,
    });
    await next();
  } catch (error) {
    return c.json({ error: "认证失败" }, 401);
  }
});

const port = 3001;
console.log(`Server is running on port ${port}`);

app.route("/", routes);

serve({
  fetch: app.fetch,
  port,
});
