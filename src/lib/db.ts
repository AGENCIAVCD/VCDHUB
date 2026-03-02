import { Pool, QueryResultRow } from "pg";

declare global {
  var __wpphubPool: Pool | undefined;
}

function getPool() {
  if (global.__wpphubPool) {
    return global.__wpphubPool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  if (process.env.NODE_ENV !== "production") {
    global.__wpphubPool = pool;
  }

  return pool;
}

export async function query<T extends QueryResultRow>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(sql, params);
  return result.rows;
}

export async function getClient() {
  return getPool().connect();
}
