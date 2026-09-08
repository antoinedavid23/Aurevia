import type { AuditAnswers, AuditFinance } from "../components/audit-content";
import { calculateRevenueEstimate, calculateRevenueOptimization, simulatorBaseNightly } from "./simulator";
import { resolveAuditLocation } from "./audit-location";
import { isAuditPortfolioComplete } from "./audit-portfolio";
import { buildAuditCalendar } from "./audit-calendar";
import { calculateAuditDistribution } from "./audit-distribution";
import { getAuditObjectives } from "./audit-objectives";

export function hasAuditRentalHistory(answers: AuditAnswers, finance: AuditFinance) {
  if (typeof finance.hasRentalHistory === "boolean") return finance.hasRentalHistory;
  // An absent listing does not erase an active/managed property's history.
  if (answers.status === "active" || answers.status === "managed") return true;
  return answers.status !== "launch" && answers.distribution !== "none";
}

export function isAuditFinanceComplete(answers: AuditAnswers, finance: AuditFinance) {
  const inRange = (value: number, min: number, max: number) => Number.isFinite(value) && value >= min && value <= max;
  const notRented = !hasAuditRentalHistory(answers, finance);
  return inRange(finance.area, 20, 1500) && inRange(finance.bedrooms, 1, 12) && Number.isInteger(finance.bedrooms)
    && inRange(finance.guests, 1, 30) && Number.isInteger(finance.guests) && inRange(finance.days, 30, 365) && Number.isInteger(finance.days)
    && inRange(finance.annualCosts, 0, 1000000)
    && (notRented || (inRange(finance.currentNightly, 1, 10000) && inRange(finance.occupancy, 0, 100)))
    && (notRented || inRange(finance.currentManagementRate, 0, 50));
}

export function auditResult(answers: AuditAnswers, finance: AuditFinance) {
  const portfolioCountConfirmed = isAuditPortfolioComplete(answers.portfolio, finance.propertyCount);
  const portfolio = portfolioCountConfirmed ? finance.propertyCount : 0;
  const objectives = getAuditObjectives(answers.objective);
  const urgency = answers.timing === "now" ? 92 : answers.timing === "quarter" ? 78 : answers.timing === "semester" ? 62 : 48;
  const revenue = Math.min(94, 58 + (answers.status === "active" || answers.status === "managed" ? 16 : 8) + (objectives.includes("revenue") ? 14 : 5));
  const operations = Math.min(96, 57 + (objectives.includes("time") ? 19 : 8) + (portfolio > 1 ? 12 : 4));
  const protection = Math.min(95, 61 + (objectives.includes("care") || answers.status === "secondary" ? 22 : 8));
  const fit = Math.round((urgency + revenue + operations + protection) / 4);
  const location = resolveAuditLocation(answers);
  const property = {
    location: location.simulatorLocation, type: finance.propertyType,
    bedrooms: finance.bedrooms, guests: finance.guests, area: finance.area,
    finish: finance.finish, sea: finance.sea, pool: finance.pool,
    terrace: finance.terrace, parking: finance.parking, days: finance.days,
    poolKind: finance.pool ? (finance.poolKind === "none" ? "private" as const : finance.poolKind) : "none" as const,
  };
  const estimate = calculateRevenueEstimate({ ...property, nightlyBaseOverride: location.nightlyBaseOverride });
  const localityEstimate = calculateRevenueEstimate(property);
  const localityBaseNightly = simulatorBaseNightly(location.simulatorLocation);
  const appliedBaseNightly = simulatorBaseNightly(location.simulatorLocation, location.nightlyBaseOverride);

  // Declared performance is historical/input data. Do not apply geographic
  // coefficients to it again, and do not force the scenario to outperform it.
  const notRented = !hasAuditRentalHistory(answers, finance);
  const currentOccupancy = notRented ? 0 : finance.occupancy;
  const currentNightly = notRented ? 0 : finance.currentNightly;
  // Use the owner's explicit fee, including when they primarily self-manage.
  // Only a not-yet-rented property has no historical management commission.
  const currentManagementRate = notRented ? 0 : finance.currentManagementRate;
  const optimization = calculateRevenueOptimization(
    { ...property, nightlyBaseOverride: location.nightlyBaseOverride }, currentNightly, currentOccupancy,
  );
  const currentBookedNights = optimization.currentBookedNights;
  const currentGross = optimization.currentAnnual;
  const targetOccupancy = optimization.occupancy;
  const targetNightly = optimization.nightly;
  const targetBookedNights = optimization.bookedNights;
  const projectedGross = optimization.annual;
  const platformRate = 8;
  const aureviaFeeRate = 25;
  const distribution = calculateAuditDistribution(answers.distribution, finance);
  const currentPlatformRate = currentOccupancy === 0 ? 0 : answers.distribution === "none" ? null : distribution.effectiveRate;
  // Apply percentage points before dividing to avoid 1 - .33 becoming
  // .6699999999999999 and rounding a half-euro down incorrectly.
  const currentNet = currentPlatformRate === null ? null : Math.round((currentGross * (100 - currentPlatformRate - currentManagementRate) - finance.annualCosts * 100) / 100);
  const projectedNet = Math.round((projectedGross * (100 - platformRate - aureviaFeeRate) - finance.annualCosts * 100) / 100);
  const annualGain = currentNet === null ? null : projectedNet - currentNet;
  const offer: "privilege" | "serenity" = portfolio >= 5 || objectives.includes("scale") ? "privilege" : "serenity";

  const perProperty = {
    currentGross, currentNet, projectedGross, projectedNet, annualGain,
    grossGain: optimization.gain,
    occupancyContribution: optimization.occupancyContribution,
    pricingContribution: optimization.pricingContribution,
    currentBookedNights, targetBookedNights,
    monthlyGross: Math.round(projectedGross / 12),
    low: Math.round(projectedGross * (1 - location.uncertainty)),
    high: Math.round(projectedGross * (1 + location.uncertainty)),
    annualCosts: finance.annualCosts,
  };
  return {
    calculationVersion: "declared-rate-plus-20-v6" as const,
    optimization,
    distribution,
    evidence: { marketValidated: false, channelRevenueUpliftCalibrated: false, jointPriceOccupancyValidated: false,
      pricingBasis: optimization.pricingBasis === "declared-rate-plus-20"
        ? "Declared nightly rate +20%, rounded to cents, without additional property or locality coefficients; AUREVIA scenario assumption, not verified comparables"
        : "No declared current rate: existing unvalidated property/locality launch scenario, without an additional 20% uplift",
      occupancyBasis: optimization.occupancyBasis,
      channelCostBasis: !notRented && answers.distribution === "none" ? "historical-channel-costs-not-provided" : distribution.basis,
      targetPlatformBasis: "AUREVIA user-provided blended 8% assumption; not a universal platform rate",
      rangeBasis: "Sensitivity band, not a confidence interval: ±25% for the existing district scenario, ±35% for locality fallback",
      needsReview: ["booked comparable rates by micro-location", "joint annual rate and occupancy", "listing quality and channel conversion", "actual future distribution fees", "private/shared pool availability and seasonality"],
    },
    monthlyPlan: buildAuditCalendar(finance.days, targetBookedNights, targetNightly, projectedGross, portfolio),
    portfolio, portfolioCountConfirmed, objectives, hasRentalHistory: !notRented, urgency, revenue, operations, protection, fit, offer,
    basis: portfolio > 1 ? "representative-property-extrapolation" as const : "single-property" as const,
    perProperty,
    currentGross: currentGross * portfolio,
    currentNet: currentNet === null ? null : currentNet * portfolio,
    projectedGross: projectedGross * portfolio,
    projectedNet: projectedNet * portfolio,
    annualGain: annualGain === null ? null : annualGain * portfolio,
    grossGain: optimization.gain * portfolio,
    occupancyContribution: optimization.occupancyContribution * portfolio,
    pricingContribution: optimization.pricingContribution * portfolio,
    currentBookedNights: currentBookedNights * portfolio,
    targetBookedNights: targetBookedNights * portfolio,
    monthlyGross: Math.round(projectedGross * portfolio / 12),
    low: perProperty.low * portfolio,
    high: perProperty.high * portfolio,
    annualCosts: finance.annualCosts * portfolio,
    targetNightly, targetOccupancy, currentNightly, currentOccupancy, currentManagementRate, aureviaFeeRate, platformRate, currentPlatformRate,
    location: {
      ...location, localityBaseNightly, appliedBaseNightly,
      geographicCoefficient: appliedBaseNightly / localityBaseNightly,
      propertyNightly: estimate.nightly,
      declaredNightly: currentNightly,
      projectedNightly: targetNightly,
      pricingBasis: optimization.pricingBasis,
      nightlyEffectVsLocality: estimate.nightly - localityEstimate.nightly,
      appliedToCentralRate: optimization.pricingBasis === "launch-property-scenario",
      indicativeAnnualGrossPerProperty: projectedGross,
      indicativeAnnualGrossPortfolio: projectedGross * portfolio,
      assumptions: "Existing simulator reference bases are not market-validated. For a declared nightly rate, only +20% is applied: locality and property reference prices remain internal context, not additional multipliers. Without a declared rate, the existing property/locality launch scenario is used without a further uplift. AUREVIA's stated 70% operating target and joint rate/occupancy require validation. Not a guarantee of returns.",
    },
  };
}

export type AuditResult = ReturnType<typeof auditResult>;
