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

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// Prefix spreadsheet formulas, including formulas hidden behind whitespace.
export function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${(/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
}
