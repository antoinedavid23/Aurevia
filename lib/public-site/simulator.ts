export type SimulatorInput = {
  location: string;
  type: string;
  bedrooms: number;
  guests: number;
  area: number;
  finish: string;
  transit: boolean;
  elevator: boolean;
  outdoor: boolean;
  parking: boolean;
  days: number;
};

export type RevenueEstimate = {
  annual: number;
  low: number;
  high: number;
  nightly: number;
  occupancy: number;
  bookedNights: number;
  monthlyAverage: number;
  seasonHigh: number;
  seasonLow: number;
};

export type ManagedProjectionInput = SimulatorInput & {
  currentNightly: number;
  currentOccupancy: number;
};

export type ManagedProjection = {
  nightlyNow: number;
  currentAnnual: number;
  occupancy: number;
  nightly: number;
  bookedNights: number;
  additionalNights: number;
  occupancyContribution: number;
  pricingContribution: number;
  occupancyLift: number;
  priceLiftPercent: number;
  annual: number;
  low: number;
  high: number;
  gain: number;
  activeAmenities: number;
};

const baseNightly: Record<string, number> = {
  "Centro storico": 80,
  Castelletto: 84,
  Albaro: 88,
  Foce: 82,
  Marassi: 72,
  Sampierdarena: 70,
  Nervi: 98,
  Boccadasse: 104,
  "Autre quartier de Genova": 76,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const rounded = (value: number, precision = 1) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const locationLift: Record<string, { price: number; occupancy: number }> = {
  "Centro storico": { price: 1.4, occupancy: .7 },
  Castelletto: { price: .8, occupancy: .4 },
  Albaro: { price: 1.6, occupancy: .5 },
  Foce: { price: .7, occupancy: .5 },
  Marassi: { price: .2, occupancy: .2 },
  Sampierdarena: { price: 0, occupancy: .1 },
  Nervi: { price: 1.8, occupancy: .7 },
  Boccadasse: { price: 2.2, occupancy: .8 },
  "Autre quartier de Genova": { price: .3, occupancy: .2 },
};

/**
 * Builds a deliberately moderate scenario from the owner's current figures.
 * Every field displayed by the simulator contributes to the projection; the
 * coefficients are hypotheses, not historic market data or a guarantee.
 */
export function calculateManagedProjection(i: ManagedProjectionInput): ManagedProjection {
  const days = clamp(Math.round(i.days || 90), 90, 365);
  const nightlyNow = clamp(Math.round(i.currentNightly || 20), 20, 200);
  const currentOccupancy = clamp(rounded(i.currentOccupancy || 25), 25, 80);
  const currentBookedNights = Math.round(days * (currentOccupancy / 100));
  const currentAnnual = Math.round(nightlyNow * currentBookedNights);
  const location = locationLift[i.location] || locationLift["Autre quartier de Genova"];

  const typePrice = ({
    Studio: 0,
    "Deux-pièces": .2,
    "Trois-pièces": .7,
    "Quatre-pièces et plus": 1.2,
    "Petit logement indépendant": 1.4,
  } as Record<string, number>)[i.type] ?? .2;
  const typeOccupancy = ({
    Studio: .1,
    "Deux-pièces": .2,
    "Trois-pièces": .3,
    "Quatre-pièces et plus": .2,
    "Petit logement indépendant": .3,
  } as Record<string, number>)[i.type] ?? .1;
  const finishPrice = ({
    "À rafraîchir": -2,
    "Simple et fonctionnel": -.5,
    Soigné: .6,
    "Très soigné": 2,
  } as Record<string, number>)[i.finish] ?? 0;
  const finishOccupancy = ({
    "À rafraîchir": -1,
    "Simple et fonctionnel": 0,
    Soigné: .4,
    "Très soigné": 1,
  } as Record<string, number>)[i.finish] ?? 0;

  const bedroomPrice = clamp((clamp(i.bedrooms || 0, 0, 5) - 1) * .25, -.25, .75);
  const bedroomOccupancy = clamp((clamp(i.bedrooms || 0, 0, 5) - 1) * .12, -.1, .35);
  const areaPrice = clamp((clamp(i.area || 20, 20, 180) - 65) / 80, -.75, 1.25);
  const areaOccupancy = clamp((clamp(i.area || 20, 20, 180) - 65) / 100, -.35, .45);
  const capacityPrice = clamp((clamp(i.guests || 1, 1, 8) - 2) * .12, -.15, .6);
  const capacityOccupancy = clamp((clamp(i.guests || 1, 1, 8) - 2) * .12, -.1, .5);
  const amenityPrice = (i.transit ? .4 : 0) + (i.elevator ? .5 : 0) + (i.outdoor ? 1.2 : 0) + (i.parking ? .7 : 0);
  const amenityOccupancy = (i.transit ? .8 : 0) + (i.elevator ? .4 : 0) + (i.outdoor ? .7 : 0) + (i.parking ? .3 : 0);

  const priceLiftPercent = rounded(clamp(
    1.5 + location.price + typePrice + bedroomPrice + areaPrice + capacityPrice + finishPrice + amenityPrice,
    -1,
    9,
  ));
  const occupancyLift = rounded(clamp(
    3.5 + location.occupancy + typeOccupancy + bedroomOccupancy + areaOccupancy + capacityOccupancy + finishOccupancy + amenityOccupancy,
    3,
    9,
  ));

  const occupancy = rounded(clamp(currentOccupancy + occupancyLift, 25, 92));
  const bookedNights = Math.round(days * (occupancy / 100));
  const nightly = Math.round(nightlyNow * (1 + priceLiftPercent / 100));
  const annual = Math.round(nightly * bookedNights);
  const additionalNights = Math.max(0, bookedNights - currentBookedNights);
  const occupancyContribution = Math.round(additionalNights * nightlyNow);
  const pricingContribution = Math.round((nightly - nightlyNow) * bookedNights);

  return {
    nightlyNow,
    currentAnnual,
    occupancy,
    nightly,
    bookedNights,
    additionalNights,
    occupancyContribution,
    pricingContribution,
    occupancyLift,
    priceLiftPercent,
    annual,
    low: Math.round(annual * .9 / 100) * 100,
    high: Math.round(annual * 1.1 / 100) * 100,
    gain: Math.max(0, annual - currentAnnual),
    activeAmenities: [i.transit, i.elevator, i.outdoor, i.parking].filter(Boolean).length,
  };
}

export function calculateRevenueEstimate(i: SimulatorInput): RevenueEstimate {
  const typeFactor = {
    Studio: .9,
    "Deux-pièces": .96,
    "Trois-pièces": 1.03,
    "Quatre-pièces et plus": 1.09,
    "Petit logement indépendant": 1.12,
  }[i.type] || 1;
  const finishFactor = {
    "À rafraîchir": .9,
    "Simple et fonctionnel": .96,
    Soigné: 1,
    "Très soigné": 1.05,
  }[i.finish] || 1;
  const amenityFactor = 1 + (i.transit ? .025 : 0) + (i.elevator ? .03 : 0) + (i.outdoor ? .05 : 0) + (i.parking ? .035 : 0);
  const sizeFactor = 1 + Math.min(Math.max(i.bedrooms - 1, 0) * .025, .075) + Math.min(Math.max(i.area - 65, 0) / 2000, .045);
  const capacityFactor = 1 + Math.min(Math.max(i.guests - 2, 0) * .008, .04);
  const neighborhoodBonus = ["Nervi", "Boccadasse", "Albaro"].includes(i.location) ? 1 : 0;
  const occupancy = clamp(Math.round(51 + (i.transit ? 3 : 0) + (i.outdoor ? 2 : 0) + (i.elevator ? 1 : 0) + (i.finish === "Très soigné" ? 2 : 0) + neighborhoodBonus), 50, 65);
  const nightly = clamp(Math.round((baseNightly[i.location] || 76) * typeFactor * finishFactor * amenityFactor * sizeFactor * capacityFactor), 70, 110);
  const bookedNights = Math.round(i.days * (occupancy / 100));
  const annual = Math.round(nightly * bookedNights / 100) * 100;

  return {
    annual,
    low: Math.round(annual * .88 / 100) * 100,
    high: Math.round(annual * 1.12 / 100) * 100,
    nightly,
    occupancy,
    bookedNights,
    monthlyAverage: Math.round(annual / 12 / 50) * 50,
    seasonHigh: clamp(Math.round(nightly * 1.12), 70, 110),
    seasonLow: clamp(Math.round(nightly * .88), 70, 110),
  };
}
