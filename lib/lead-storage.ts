import { getCrmDatabase, type CrmDatabase } from "./crm-database";
import { isRecord, leadPageSize, type CrmLead, type LeadFilters, type LeadPage, type LeadStatus } from "./lead-crm";

type LeadPayload = Record<string, unknown> & { name: string; surname: string; email: string; message: string; phone?: string; city?: string; propertyType?: string; type?: string; subject?: string };
const columns = `id, kind, name, surname, email, phone, city, property_type AS "propertyType", subject, status, created_at AS "createdAt"`;
function normalize(row: Record<string, unknown>) { return { ...row, id: Number(row.id), createdAt: Number(row.createdAt) }; }
function expressions(db: CrmDatabase) {
  return db.dialect === "postgres"
    ? { audit: "is_audit", count: "property_count" }
    : { audit: "json_type(details, '$.auditReport') = 'object'", count: "json_extract(details, '$.propertyCount')" };
}

export function leadWhere(filters: LeadFilters, audit: string) {
  const conditions: string[] = []; const values: unknown[] = [];
  if (filters.status === "active") conditions.push("status NOT IN ('closed', 'archived')");
  else if (filters.status !== "all") { conditions.push("status = ?"); values.push(filters.status); }
  if (filters.kind !== "all") conditions.push(filters.kind === "audit" ? `(${audit})` : `NOT COALESCE((${audit}), FALSE)`);
  if (filters.query) {
    conditions.push("LOWER(name || ' ' || surname || ' ' || email || ' ' || COALESCE(phone, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(subject, '')) LIKE ? ESCAPE '!'");
    values.push(`%${filters.query.toLocaleLowerCase("fr").replace(/[!%_]/g, character => `!${character}`)}%`);
  }
  return { clause: conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "", values };
}

export async function storeLead(kind: "contact" | "valuation", payload: LeadPayload) {
  const db = await getCrmDatabase(); const now = Date.now();
  const rows = await db.query(`INSERT INTO leads (kind, name, surname, email, phone, city, property_type, subject, message, details, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?) RETURNING id`,
    [kind, payload.name, payload.surname, payload.email.toLowerCase(), payload.phone || null, payload.city || null,
      payload.propertyType || payload.type || null, payload.subject || null, payload.message, JSON.stringify(payload), now, now]);
  const id = Number(rows[0]?.id);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error("La demande n’a pas reçu de référence.");
  return { id };
}

export async function listLeads(filters: LeadFilters): Promise<LeadPage> {
  const db = await getCrmDatabase(); const expr = expressions(db); const where = leadWhere(filters, expr.audit);
  // The inbox deliberately never selects message, details or the complete audit snapshot.
  const [rows, totals, counts] = await Promise.all([
    db.query(`SELECT ${columns}, CASE WHEN ${expr.audit} THEN 1 ELSE 0 END AS "isAudit", ${expr.count} AS "propertyCount"
      FROM leads${where.clause} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`, [...where.values, leadPageSize, (filters.page - 1) * leadPageSize]),
    db.query(`SELECT COUNT(*) AS total FROM leads${where.clause}`, where.values),
    db.query(`SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS "new",
      SUM(CASE WHEN ${expr.audit} THEN 1 ELSE 0 END) AS audits, SUM(CASE WHEN status = 'appointment' THEN 1 ELSE 0 END) AS appointments FROM leads`),
  ]);
  return { items: rows.map(row => ({ ...normalize(row), isAudit: Number(row.isAudit) === 1,
    propertyCount: Number(row.propertyCount) > 0 ? Number(row.propertyCount) : null })) as LeadPage["items"],
    page: filters.page, pageSize: leadPageSize, total: Number(totals[0]?.total || 0),
    counts: { total: Number(counts[0]?.total || 0), new: Number(counts[0]?.new || 0), audits: Number(counts[0]?.audits || 0), appointments: Number(counts[0]?.appointments || 0) } };
}

export async function getLead(id: number): Promise<CrmLead | null> {
  const db = await getCrmDatabase();
  const [row] = await db.query(`SELECT ${columns}, message, details FROM leads WHERE id = ?`, [id]);
  if (!row) return null;
  const details = typeof row.details === "string" ? JSON.parse(row.details) : row.details;
  if (!isRecord(details)) throw new Error("Le dossier enregistré est illisible.");
  return { ...normalize(row), details } as CrmLead;
}

export async function updateLeadStatus(id: number, status: LeadStatus) {
  const db = await getCrmDatabase();
  const [row] = await db.query(`UPDATE leads SET status = ?, updated_at = ? WHERE id = ? RETURNING id, status`, [status, Date.now(), id]);
  return row ? { id: Number(row.id), status: row.status } : null;
}
