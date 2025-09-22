import { sql } from "drizzle-orm";
import { db } from ".";

async function main() {
  console.log("开始执行数据库迁移...");

  try {
    // 为 users 表添加 settings 列
    await db.execute(
      sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'`
    );

    // 为 opportunities 表补充金额与下一次跟进信息
    await db.execute(sql`
      ALTER TABLE opportunities
      ADD COLUMN IF NOT EXISTS expected_amount numeric(12,2) DEFAULT 0 NOT NULL
    `);

    await db.execute(
      sql`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS next_follow_up_at timestamp`
    );

    await db.execute(
      sql`ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS next_follow_up_note text`
    );

    // 创建 voice_notes 表（若不存在）
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS voice_notes (
        id serial PRIMARY KEY,
        opportunity_id integer NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
        team_id integer REFERENCES teams(id) ON DELETE SET NULL,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        filename varchar(255) NOT NULL,
        file_path varchar(500) NOT NULL,
        mime_type varchar(100) NOT NULL,
        duration_seconds integer,
        transcript text,
        summary text,
        status varchar(50) NOT NULL DEFAULT 'processing',
        ai_metadata jsonb,
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      )
    `);

    console.log("数据库迁移执行完成");
    process.exit(0);
  } catch (error) {
    console.error("迁移失败:", error);
    process.exit(1);
  }
}

main();
