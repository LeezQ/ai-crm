import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }),
  name: varchar("name", { length: 50 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  avatar: varchar("avatar", { length: 200 }),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  // 暂时注释掉settings列定义
  // settings: jsonb("settings").default({}),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  website: varchar("website", { length: 200 }),
  contactPerson: varchar("contact_person", { length: 50 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  contactWechat: varchar("contact_wechat", { length: 50 }),
  contactDepartment: varchar("contact_department", { length: 100 }),
  contactPosition: varchar("contact_position", { length: 50 }),
  companySize: varchar("company_size", { length: 50 }),
  region: varchar("region", { length: 50 }),
  industry: varchar("industry", { length: 50 }),
  progress: text("progress").notNull().default("initial"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  priority: varchar("priority", { length: 50 }).notNull().default("normal"),
  description: text("description"),
  source: varchar("source", { length: 50 }),
  expectedCloseDate: timestamp("expected_close_date"),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const followUps = pgTable("follow_ups", {
  id: serial("id").primaryKey(),
  opportunityId: integer("opportunity_id")
    .notNull()
    .references(() => opportunities.id),
  type: varchar("type", { length: 50 }).notNull(),
  content: text("content").notNull(),
  result: text("result"),
  nextPlan: text("next_plan"),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    role: varchar("role", { length: 50 }).notNull().default("member"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      teamUserIdx: uniqueIndex("team_members_team_user_idx").on(
        table.teamId,
        table.userId
      ),
    };
  }
);
