import type { AuditAnswers, AuditFinance } from "../components/audit-content";
import type { AuditResult } from "./audit-model";
import type { Locale } from "./i18n";

export type AuditReceipt = { reference: string; channels: string[]; leadId?: number | null };
export type StoredAudit = {
  version: 2; answers: AuditAnswers; finance: AuditFinance; result: AuditResult;
  name: string; locale: Locale; receipt: AuditReceipt;
};

export function isConfirmedAuditDelivery(value: unknown): value is AuditReceipt & { ok: true } {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Record<string, unknown>;
  return receipt.ok === true && typeof receipt.reference === "string" && receipt.reference.length > 0
    && Array.isArray(receipt.channels) && receipt.channels.some(channel => channel === "inbox" || channel === "email");
}

const storageKey = "aurevia-audit";
let cached: StoredAudit | null = null;
let loaded = false;

// This is only the visitor's display copy. The authoritative dossier is
// delivered to AUREVIA before saving this page-to-page handoff.
export function saveAuditSession(audit: StoredAudit) {
  cached = audit;
  loaded = true;
  try { window.sessionStorage.setItem(storageKey, JSON.stringify(audit)); } catch { /* In-memory handoff still works when storage is blocked. */ }
  window.dispatchEvent(new Event("aurevia:audit-saved"));
}

export function getAuditSession(): StoredAudit | null {
  if (typeof window === "undefined") return null;
  if (loaded) return cached;
  loaded = true;
  try {
    const audit = JSON.parse(window.sessionStorage.getItem(storageKey) || "null") as StoredAudit | null;
    if (audit?.version === 2 && audit.result?.calculationVersion === "declared-rate-plus-20-v6" && audit.result.portfolioCountConfirmed && Number.isFinite(audit.result.projectedGross)
      && audit.result.perProperty && audit.finance && audit.receipt
      && isConfirmedAuditDelivery({ ...audit.receipt, ok: true })) cached = audit;
  } catch { /* An absent/invalid display copy must never produce a sample audit. */ }
  return cached;
}

export function subscribeAuditSession(listener: () => void) {
  window.addEventListener("aurevia:audit-saved", listener);
  return () => window.removeEventListener("aurevia:audit-saved", listener);
}

export function getServerAuditSession(): null { return null; }
