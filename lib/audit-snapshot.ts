import { z } from "zod";
import type { StoredAudit } from "./audit-session";

const number = z.number().finite();
const moneyFields = ["currentGross", "projectedGross", "projectedNet", "monthlyGross", "low", "high", "annualCosts", "currentBookedNights", "targetBookedNights"] as const;
const numbers = (keys: readonly string[]) => Object.fromEntries(keys.map(key => [key, number]));
const financial = z.object({ ...numbers(moneyFields), currentNet: number.nullable(), annualGain: number.nullable() }).passthrough();
const snapshotSchema = z.object({
  version: z.literal(1), locale: z.enum(["it", "fr", "en"]),
  answers: z.record(z.unknown()), finance: z.object({ days: number.int().min(30).max(365) }).passthrough(),
  result: financial.extend({
    calculationVersion: z.literal("declared-rate-plus-20-v6"),
    ...numbers(["targetNightly", "targetOccupancy", "currentNightly", "currentOccupancy", "currentManagementRate", "aureviaFeeRate", "platformRate", "grossGain", "occupancyContribution", "pricingContribution", "revenue", "operations", "protection", "urgency"]),
    currentPlatformRate: number.nullable(), portfolio: number.int().positive(), portfolioCountConfirmed: z.literal(true),
    offer: z.enum(["privilege", "serenity"]), perProperty: financial,
    monthlyPlan: z.array(z.object({ monthIndex: number.int().min(0).max(11),
      ...numbers(["availableNightsPerProperty", "bookedNightsPerProperty", "occupancyRate", "nightlyRate", "projectedGrossPerProperty", "projectedGrossPortfolio"]),
    }).passthrough()).length(12),
    location: z.object({ complete: z.boolean(), label: z.string(), pricingBasis: z.string(), calibration: z.string(),
      declaredNightly: number, appliedBaseNightly: number, projectedNightly: number }).passthrough(),
  }).passthrough(),
}).passthrough();

// This validates the saved display copy; it never recalculates an old dossier.
// Inputs and model limits remain in the separately saved complete audit report.
export function readAuditSnapshot(value: unknown, name: string, leadId: number): StoredAudit | null {
  const parsed = snapshotSchema.safeParse(value);
  if (!parsed.success) return null;
  const snapshot = parsed.data;
  if (new Set(snapshot.result.monthlyPlan.map(row => row.monthIndex)).size !== 12) return null;
  return { ...snapshot, version: 2, name, receipt: { reference: `audit-${leadId}`, leadId, channels: ["inbox"] } } as StoredAudit;
}
