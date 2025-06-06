import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

console.log(connectionString);

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(connectionString);
export const db = drizzle(client, {
  schema,
  logger: true,
});

export type DbClient = typeof db;
