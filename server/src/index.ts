import { serve } from "@hono/node-server";
import console from "console";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { routes } from "./routes";
const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

// app.use(
//   "*",
//   jwt({
//     secret: process.env.JWT_SECRET || "your-secret-key",
//   })
// );

const port = 3001;
console.log(`Server is running on port ${port}`);

app.route("/", routes);

serve({
  fetch: app.fetch,
  port,
});
