export type SimulatorInput={location:string;type:string;bedrooms:number;guests:number;area:number;finish:string;sea:boolean;pool:boolean;terrace:boolean;parking:boolean;days:number;nightlyBaseOverride?:number;poolKind?:"none"|"private"|"shared"|"jacuzzi"};
export type RevenueEstimate={annual:number;low:number;high:number;nightly:number;occupancy:number;bookedNights:number;monthlyAverage:number;seasonHigh:number;seasonLow:number};

const base:Record<string,number>={Gênes:155,Nervi:190,Camogli:215,Rapallo:205,"Santa Margherita Ligure":245,Portofino:340,"Autre localité en Ligurie":165};

export function simulatorBaseNightly(location:string, override?:number):number {
 return typeof override === "number" && Number.isFinite(override) && override > 0 ? override : (base[location] || 165);
}

export function calculateRevenueEstimate(i:SimulatorInput):RevenueEstimate{
 const type={Appartement:1,Attique:1.18,Villa:1.38,"Maison indépendante":1.2}[i.type]||1;
 const finish={Essentiel:.82,Soigné:1,Premium:1.22,Luxe:1.48}[i.finish]||1;
 const privatePool = i.pool && (!i.poolKind || i.poolKind === "private");
 const amenity=1+(i.sea?.16:0)+(privatePool?.15:0)+(i.terrace?.07:0)+(i.parking?.04:0);
 const size=1+Math.min(Math.max(i.bedrooms-1,0)*.13,.52)+Math.min(Math.max(i.area-70,0)/1000,.16);
 const capacity=1+Math.min(Math.max(i.guests-2,0)*.018,.15);
 const occupancy=Math.min(76,Math.max(60,Math.round(49+(i.sea?5:0)+(i.finish==="Luxe"?6:i.finish==="Premium"?3:0)+(i.location==="Portofino"?3:0)+(privatePool?2:0))));
 const rawNightly=simulatorBaseNightly(i.location,i.nightlyBaseOverride)*type*finish*amenity*size*capacity;
 const nightly=Math.round(rawNightly + Number.EPSILON * Math.abs(rawNightly));
 const bookedNights=Math.round(i.days*(occupancy/100));
 const annual=Math.round(nightly*bookedNights/100)*100;
 return{
  annual,
  low:Math.round(annual*.82/100)*100,
  high:Math.round(annual*1.18/100)*100,
  nightly,
  occupancy,
  bookedNights,
  monthlyAverage:Math.round(annual/12/100)*100,
  seasonHigh:Math.round(nightly*1.42),
  seasonLow:Math.round(nightly*.68),
 };
}

// Shared by the public simulator and the audit. These are scenario assumptions,
// not observed market performance or a guaranteed increase in owner net.
export function calculateRevenueOptimization(i: SimulatorInput, currentNightly: number, currentOccupancy: number) {
 const estimate = calculateRevenueEstimate(i);
 const money = (value: number) => Math.round(value * 100) / 100;
 const currentBookedNights = Math.round(i.days * currentOccupancy / 100);
 const currentAnnual = money(currentNightly * currentBookedNights);
 // AUREVIA's stated operating target, not a measured market occupancy rate.
 // Do not combine a higher price with a high historical occupancy as if both
 // could necessarily be achieved together. A joint benchmark is still needed.
 const hasDeclaredRate = Number.isFinite(currentNightly) && currentNightly > 0;
 // One uplift on the owner's rate, rounded to cents. Never stack locality,
 // standing or amenity coefficients on top of this declared-price scenario.
 // A launch without a current rate retains the explicitly unvalidated fallback.
 const nightly = hasDeclaredRate ? Math.round(Math.round(currentNightly * 100) * 120 / 100) / 100 : estimate.nightly;
 const occupancy = nightly > currentNightly ? 70 : Math.max(70, currentOccupancy);
 const bookedNights = Math.round(i.days * occupancy / 100);
 const annual = money(nightly * bookedNights);
 const additionalNights = bookedNights - currentBookedNights;
 const occupancyContribution = money(additionalNights * currentNightly);
 const gain = money(annual - currentAnnual);
 const pricingContribution = money(gain - occupancyContribution);
 return {
  modelVersion: "declared-rate-plus-20-v3" as const,
  pricingBasis: hasDeclaredRate ? "declared-rate-plus-20" as const : "launch-property-scenario" as const,
  evidence: "unvalidated-scenario" as const,
  occupancyBasis: "AUREVIA stated 70% operating target; higher historical occupancy retained only at an unchanged rate",
  jointPriceOccupancyValidated: false,
  currentAnnual, currentBookedNights, occupancy, nightly, bookedNights,
  additionalNights, occupancyContribution, pricingContribution, annual, gain,
  gainRate: currentAnnual ? Math.round((annual / currentAnnual - 1) * 100) : 0,
  multiplier: currentAnnual ? annual / currentAnnual : 0,
  nightlyUpliftPercent: currentNightly ? Math.round((nightly / currentNightly - 1) * 1000) / 10 : 0,
  occupancyUpliftPoints: Math.round((occupancy - currentOccupancy) * 10) / 10,
  estimatedNightly: nightly,
  propertyReferenceNightly: estimate.nightly,
 };
}
