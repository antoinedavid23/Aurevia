// Server-only database access. No connection string is sent to the browser.
export type CrmDatabase = { dialect: "postgres" | "sqlite"; query: (sql: string, values?: unknown[]) => Promise<Record<string, unknown>[]> };

export async function getCrmDatabase(): Promise<CrmDatabase> {
  const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (connection) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(connection);
    return { dialect: "postgres", query: async (statement, values = []) => {
      let parameter = 0;
      return await sql.query(statement.replace(/\?/g, () => `$${++parameter}`), values,
        { fetchOptions: { cache: "no-store", signal: AbortSignal.timeout(15000) } }) as Record<string, unknown>[];
    } };
  }
  if (process.env.VERCEL) throw new Error("Le stockage privé du CRM n’est pas configuré.");
  // Compatibility with the previous Sites deployment; never fall back after a Neon error.
  const moduleName = "cloudflare:workers";
  const { env } = await import(/* webpackIgnore: true */ moduleName) as {
    env: { DB?: { prepare: (sql: string) => { bind: (...values: unknown[]) => { all: () => Promise<{ results?: Record<string, unknown>[] }> } } } } };
  if (!env.DB) throw new Error("Le stockage privé du CRM n’est pas disponible.");
  const db = env.DB;
  return { dialect: "sqlite", query: async (statement, values = []) => (await db.prepare(statement).bind(...values).all()).results || [] };
}
