import dotenv from "dotenv";
import { z } from "zod";

// 加载环境变量
dotenv.config();

// 环境变量验证schema
const envSchema = z.object({
  // 服务器配置
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // 数据库配置
  DATABASE_URL: z.string(),
  DATABASE_POOL_MIN: z.string().default("2"),
  DATABASE_POOL_MAX: z.string().default("10"),

  // JWT配置
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // 文件上传配置
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_FILE_SIZE: z.string().default("5242880"),

  // 邮件配置
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  // AI配置
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string().default("gpt-3.5-turbo"),

  // 其他配置
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  API_PREFIX: z.string().default("/api/v1"),
});

// 验证环境变量
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ 环境变量验证失败:",
    JSON.stringify(parsedEnv.error.format(), null, 4)
  );
  process.exit(1);
}

// 导出配置对象
export const env = parsedEnv.data;

// 导出类型
export type Env = z.infer<typeof envSchema>;
