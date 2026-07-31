type LeadKind = "contact" | "valuation";
type LeadStatus = "new" | "read" | "archived";
type LeadPayload = Record<string, unknown> & {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  city?: string;
  propertyType?: string;
  type?: string;
  subject?: string;
  message: string;
};

type D1Result<T = unknown> = {
  results?: T[];
  meta?: { last_row_id?: number | string };
};
type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  first<T = unknown>(): Promise<T | null>;
};
type D1Database = {
  prepare(sql: string): D1Statement;
};

let leadSchemaReady: Promise<void> | null = null;

async function getLeadDatabase() {
  const { env } = await import(/* webpackIgnore: true */ "cloudflare:workers") as {
    env: { DB?: D1Database };
  };
  if (!env.DB) throw new Error("La base de réception n’est pas disponible.");
  if (!leadSchemaReady) {
    leadSchemaReady = env.DB.prepare(`CREATE TABLE IF NOT EXISTS leads (
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
    )`).run().then(() => undefined).catch((error) => {
      leadSchemaReady = null;
      throw error;
    });
  }
  await leadSchemaReady;
  return env.DB;
}

export async function storeLead(kind: LeadKind, payload: LeadPayload) {
  const db = await getLeadDatabase();
  const now = Date.now();
  const result = await db.prepare(`INSERT INTO leads (
    kind, name, surname, email, phone, city, property_type, subject,
    message, details, status, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`)
    .bind(
      kind,
      payload.name,
      payload.surname,
      payload.email.toLowerCase(),
      payload.phone || null,
      payload.city || null,
      payload.propertyType || payload.type || null,
      payload.subject || null,
      payload.message,
      JSON.stringify(payload),
      now,
      now,
    )
    .run();
  const id = Number(result.meta?.last_row_id || 0);
  if (!id) throw new Error("La demande n’a pas reçu de référence.");
  return { id };
}

export async function listLeads() {
  const db = await getLeadDatabase();
  const result = await db.prepare(`SELECT
    id, kind, name, surname, email, phone, city,
    property_type AS propertyType, subject, message, details,
    status, created_at AS createdAt, updated_at AS updatedAt
    FROM leads ORDER BY created_at DESC`).all<Record<string, unknown>>();
  return (result.results || []).map((row) => {
    let details = row.details;
    if (typeof details === "string") {
      try {
        details = JSON.parse(details);
      } catch {
        details = {};
      }
    }
    return { ...row, details };
  });
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const db = await getLeadDatabase();
  await db.prepare("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?")
    .bind(status, Date.now(), id)
    .run();
  return db.prepare(`SELECT
    id, kind, name, surname, email, phone, city,
    property_type AS propertyType, subject, message, details,
    status, created_at AS createdAt, updated_at AS updatedAt
    FROM leads WHERE id = ?`).bind(id).first<Record<string, unknown>>();
}
