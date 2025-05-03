import { sql } from "drizzle-orm";
import { db } from ".";

async function main() {
  console.log("开始执行数据库迁移...");

  try {
    // 为users表添加settings列
    await db.execute(
      sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'`
    );

    console.log("迁移成功：users表添加settings列完成");
    process.exit(0);
  } catch (error) {
    console.error("迁移失败:", error);
    process.exit(1);
  }
}

main();
