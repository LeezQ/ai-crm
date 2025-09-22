# Database Initialization Spec

## Objective
利用 Drizzle ORM 完成数据库初始化流程：创建/更新所有表结构，并写入基础演示数据，以便前端可以立即使用默认账号登陆和体验。

## Plan
1. **检查数据库连接**：确认环境变量 `DATABASE_URL` 指向已启动的 PostgreSQL，并确保可以连通。
2. **执行 Drizzle 迁移**：运行 `pnpm db:migrate` 应用最新 schema 变更（包括新增的语音笔记等字段）。
3. **实现 Drizzle Seed 脚本**：补充缺失的 `src/db/seed.ts`，使用 Drizzle ORM 插入默认用户、团队、成员及示例商机（内容参考 `src/db/init.sql`），确保幂等。
4. **执行种子数据导入**：通过 `pnpm db:seed` 写入演示数据，如果记录已存在则跳过，避免重复。
5. **验证初始化结果**：使用 `psql` 或 Drizzle 查询确认关键表（users、teams、opportunities）已有种子数据。

## Validation
- `pnpm db:migrate`
- `pnpm db:seed`
- 手动查询：`psql $DATABASE_URL -c "SELECT count(*) FROM users;"`
