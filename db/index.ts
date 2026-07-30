import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type RuntimeD1 = Parameters<typeof drizzle>[0] & {
  prepare(sql: string): { run(): Promise<unknown> };
};

let schemaReady: Promise<void> | null = null;

function ensureSchema(db: RuntimeD1) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.prepare(`CREATE TABLE IF NOT EXISTS managed_properties (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        name text NOT NULL,
        slug text NOT NULL UNIQUE,
        location text NOT NULL,
        bedrooms integer DEFAULT 1 NOT NULL,
        guests integer DEFAULT 2 NOT NULL,
        baths integer DEFAULT 1 NOT NULL,
        image text DEFAULT '/images/home/hero-concierge.webp' NOT NULL,
        status text DEFAULT 'draft' NOT NULL,
        created_at integer NOT NULL,
        updated_at integer NOT NULL
      )`).run();
      await db.prepare(`CREATE TABLE IF NOT EXISTS leads (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        kind text NOT NULL,
        name text NOT NULL,
        surname text NOT NULL,
        email text NOT NULL,
        phone text,
        city text,
        property_type text,
        subject text,
        message text NOT NULL,
        details text NOT NULL,
        status text DEFAULT 'new' NOT NULL,
        created_at integer NOT NULL,
        updated_at integer NOT NULL
      )`).run();
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

export async function getDb() {
  const cloudflareWorkersModule = "cloudflare:workers";
  const { env } = await import(/* webpackIgnore: true */ cloudflareWorkersModule) as {
    env: { DB?: RuntimeD1 };
  };
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  await ensureSchema(env.DB);
  return drizzle(env.DB, { schema });
}
