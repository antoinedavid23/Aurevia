const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const demandWeights = [.055, .055, .065, .075, .09, .105, .115, .12, .11, .085, .065, .06];

// Largest remainders, capped by each month's available nights. The sum must
// always reconcile with the annual model; this is not an observed calendar.
function allocate(total: number, weights: number[], caps = weights.map(() => Infinity)) {
  if (!Number.isFinite(total) || total <= 0) return weights.map(() => 0);
  const target = Math.min(Math.floor(total), caps.reduce((sum, cap) => sum + cap, 0));
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const ideal = weights.map(weight => weightSum ? target * weight / weightSum : 0);
  const values = ideal.map((value, index) => Math.min(Math.floor(value), caps[index]));
  let remaining = target - values.reduce((sum, value) => sum + value, 0);
  while (remaining > 0) {
    let best = -1;
    for (let index = 0; index < values.length; index++) {
      if (values[index] < caps[index] && (best < 0 || ideal[index] - values[index] > ideal[best] - values[best])) best = index;
    }
    if (best < 0) break;
    values[best]++;
    remaining--;
  }
  return values;
}

export function buildAuditCalendar(days: number, soldNights: number, nightly: number, annualGross: number, count: number) {
  const availability = allocate(days, monthDays, monthDays);
  const booked = allocate(soldNights, demandWeights, availability);
  // Allocate cents so decimal nightly rates also reconcile with annual gross.
  const revenueCents = allocate(Math.round(annualGross * 100), booked);
  return monthDays.map((_, index) => ({
    monthIndex: index,
    availableNightsPerProperty: availability[index],
    bookedNightsPerProperty: booked[index],
    nightlyRate: nightly,
    occupancyRate: availability[index] ? Math.round(booked[index] / availability[index] * 1000) / 10 : 0,
    projectedGrossPerProperty: revenueCents[index] / 100,
    projectedGrossPortfolio: revenueCents[index] * count / 100,
  }));
}
