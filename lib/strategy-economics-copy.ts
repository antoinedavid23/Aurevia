import type { StrategyLocale } from "./strategy-locale";

type EconomicsCopy = {
  properties: string; adr: string; occupancy: string; fee: string;
  gmv: string; revenue: string; contribution: string; perProperty: string;
  nights: string; commissionHint: string; contributionHint: string; fixedCostHint: string;
  gmvTarget: string; revenueTarget: string; occupancySuffix: string;
  gmvExplanation: string; revenueExplanation: string; method: string;
};

export const strategyEconomicsCopy: Record<StrategyLocale, EconomicsCopy> = {
  it: {
    properties: "Immobili", adr: "ADR medio", occupancy: "Occupazione", fee: "Commissione Aurevia",
    gmv: "GMV prenotazioni / mese", revenue: "Ricavi Aurevia / mese", contribution: "Margine di contribuzione", perProperty: "Ricavi per immobile",
    nights: "notti occupate per immobile", commissionHint: "commissione applicata al GMV", contributionHint: "ipotesi obiettivo 40%, non EBITDA", fixedCostHint: "prima dei costi fissi centrali",
    gmvTarget: "Se 200.000 € significa GMV prenotazioni", revenueTarget: "Se 200.000 € significa ricavi Aurevia", occupancySuffix: "di occupazione",
    gmvExplanation: "Con gli input attuali. In alternativa servirebbe un ADR di {adr} all’occupazione selezionata.",
    revenueExplanation: "Richiederebbe {gmv} di GMV mensile: non plausibile con {properties} immobili agli input attuali.",
    method: "Formula: immobili × 30 giorni × occupazione × ADR. Sono scenari direzionali basati sugli input del fondatore, non una previsione di mercato. Pulizie, imposta di soggiorno, IVA, costi del proprietario e ricavi accessori sono esclusi.",
  },
  fr: {
    properties: "Biens", adr: "Tarif moyen / nuit", occupancy: "Occupation", fee: "Commission Aurevia",
    gmv: "Réservations brutes / mois", revenue: "Revenus Aurevia / mois", contribution: "Marge de contribution", perProperty: "Revenus par bien",
    nights: "nuits occupées par bien", commissionHint: "commission appliquée aux réservations brutes", contributionHint: "hypothèse cible de 40 %, pas l’EBITDA", fixedCostHint: "avant les coûts fixes centraux",
    gmvTarget: "Si 200 000 € désigne les réservations brutes", revenueTarget: "Si 200 000 € désigne les revenus Aurevia", occupancySuffix: "d’occupation",
    gmvExplanation: "Avec les paramètres actuels. Sinon, il faudrait un tarif moyen de {adr} par nuit au taux d’occupation sélectionné.",
    revenueExplanation: "Il faudrait {gmv} de réservations brutes mensuelles : non plausible avec {properties} biens et les paramètres actuels.",
    method: "Formule : biens × 30 jours × occupation × tarif moyen par nuit. Ce sont des scénarios de pilotage fondés sur les paramètres du fondateur, pas une prévision de marché. Ménage, taxe de séjour, TVA, coûts du propriétaire et revenus annexes sont exclus.",
  },
  en: {
    properties: "Properties", adr: "Average nightly rate", occupancy: "Occupancy", fee: "Aurevia commission",
    gmv: "Booking GMV / month", revenue: "Aurevia revenue / month", contribution: "Contribution margin", perProperty: "Revenue per property",
    nights: "occupied nights per property", commissionHint: "commission applied to GMV", contributionHint: "40% target assumption, not EBITDA", fixedCostHint: "before central fixed costs",
    gmvTarget: "If €200,000 means booking GMV", revenueTarget: "If €200,000 means Aurevia revenue", occupancySuffix: "occupancy",
    gmvExplanation: "With the current inputs. Alternatively, an ADR of {adr} would be needed at the selected occupancy.",
    revenueExplanation: "This would require {gmv} in monthly GMV: not plausible with {properties} properties at the current inputs.",
    method: "Formula: properties × 30 days × occupancy × ADR. These are directional scenarios based on the founder’s inputs, not a market forecast. Cleaning, tourist tax, VAT, owner costs and ancillary revenue are excluded.",
  },
};
