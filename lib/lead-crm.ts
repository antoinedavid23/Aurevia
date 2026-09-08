export const leadStatuses = ["new", "read", "contacted", "appointment", "closed", "archived"] as const;
export type LeadStatus = typeof leadStatuses[number];
export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Nouveau", read: "À suivre", contacted: "Contacté", appointment: "Rendez-vous", closed: "Clôturé", archived: "Archivé",
};
export type CrmLead = {
  id: number; kind: "contact" | "valuation"; name: string; surname: string;
  email: string; phone: string | null; city: string | null; propertyType: string | null;
  subject: string | null; message: string; details: Record<string, unknown>;
  status: LeadStatus; createdAt: string | number;
};

export type CrmLeadSummary = Omit<CrmLead, "details" | "message"> & { isAudit: boolean; propertyCount: number | null };
export type LeadFilters = { page: number; query: string; status: "active" | "all" | LeadStatus; kind: "all" | "audit" | "contact" };
export const leadPageSize = 25;
export type LeadPage = {
  items: CrmLeadSummary[]; page: number; pageSize: number; total: number;
  counts: { total: number; new: number; audits: number; appointments: number };
};

export function parseLeadFilters(params: URLSearchParams): LeadFilters | null {
  const page = params.get("page") || "1";
  const status = params.get("status") || "active";
  const kind = params.get("kind") || "all";
  const query = (params.get("q") || "").trim();
  if (!/^\d+$/.test(page) || !Number.isSafeInteger(Number(page)) || Number(page) < 1 || Number(page) > 100000
    || !["active", "all", ...leadStatuses].includes(status) || !["all", "audit", "contact"].includes(kind) || query.length > 120) return null;
  return { page: Number(page), status: status as LeadFilters["status"], kind: kind as LeadFilters["kind"], query };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Prefix spreadsheet formulas, including formulas hidden behind whitespace.
export function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${(/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
}
