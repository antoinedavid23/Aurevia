export function auditPortfolioRange(group: string) {
  switch (group) {
    case "1": return { min: 1, max: 1 };
    case "2-4": return { min: 2, max: 4 };
    case "5-15": return { min: 5, max: 15 };
    case "16+": return { min: 16, max: 10000 };
    default: return null;
  }
}

export function isAuditPortfolioComplete(group: string, count: number) {
  const range = auditPortfolioRange(group);
  return Boolean(range && Number.isInteger(count) && count >= range.min && count <= range.max);
}

export const portfolioCopy = {
  it: {
    nights: "notti affittate all’anno", current: "Ricavi lordi attuali", projected: "Ricavi lordi simulati",
    rateBasis: "Tariffa dichiarata +20%, senza ulteriori coefficienti. In assenza di una tariffa attuale, stima iniziale basata sul bene. Scenario da validare, non una garanzia.",
    optimizationRule: "Tariffa simulata = tariffa dichiarata ×1,20, arrotondata ai centesimi. Obiettivo operativo AUREVIA: 70% di occupazione. Notti arrotondate all’intero più vicino. Senza tariffa attuale, si usa il riferimento indicativo del bene, senza aggiungere il 20%. Tariffa e occupazione restano da validare insieme.",
    occupancyLever: "Effetto delle notti vendute", pricingLever: "Effetto della tariffa", grossGain: "Variazione lorda simulata",
    count: "Numero esatto di immobili", perProperty: "Per immobile", total: "Totale portafoglio",
    inputNote: "Descriva un immobile rappresentativo. Tariffe, disponibilità e costi vanno indicati per un solo immobile.",
    assumption: "Proiezione estesa al numero di immobili indicato, ipotizzando lo stesso profilo, quartiere, calendario e costi. Le differenze tra immobili saranno verificate durante l’appuntamento.",
    missingCount: "Indichi il numero esatto di immobili.", properties: "immobili", gross: "Ricavi lordi annui", net: "Netto annuo stimato, prima delle imposte",
  },
  fr: {
    nights: "nuits louées par an", current: "Revenus bruts actuels", projected: "Revenus bruts simulés",
    rateBasis: "Tarif déclaré +20 %, sans autre coefficient. Sans tarif actuel, estimation de départ selon le bien. Scénario à valider, pas une garantie.",
    optimizationRule: "Tarif simulé = tarif déclaré ×1,20, arrondi au centime. Objectif opérationnel AUREVIA : 70 % d’occupation. Nuits arrondies à l’entier le plus proche. Sans tarif actuel, le repère indicatif du bien est utilisé, sans ajouter 20 %. Tarif et occupation restent à valider ensemble.",
    occupancyLever: "Effet des nuits vendues", pricingLever: "Effet du tarif", grossGain: "Écart brut simulé",
    count: "Nombre exact de biens", perProperty: "Par logement", total: "Total du portefeuille",
    inputNote: "Décrivez un logement représentatif. Les tarifs, disponibilités et charges sont à renseigner pour un seul logement.",
    assumption: "Projection étendue au nombre de biens indiqué, à profil, quartier, calendrier et charges identiques. Les différences entre logements seront vérifiées pendant le rendez-vous.",
    missingCount: "Indiquez le nombre exact de biens.", properties: "biens", gross: "Revenus bruts annuels", net: "Net annuel estimé, avant fiscalité",
  },
  en: {
    nights: "booked nights per year", current: "Current gross revenue", projected: "Projected gross revenue",
    rateBasis: "Declared rate +20%, without additional coefficients. Without a current rate, an initial property-based estimate is used. A scenario to validate, not a guarantee.",
    optimizationRule: "Simulated rate = declared rate ×1.20, rounded to cents. AUREVIA operating target: 70% occupancy. Nights rounded to the nearest integer. Without a current rate, the indicative property reference is used without adding 20%. Rate and occupancy still require joint validation.",
    occupancyLever: "Booked-night effect", pricingLever: "Nightly-rate effect", grossGain: "Projected gross change",
    count: "Exact number of properties", perProperty: "Per property", total: "Portfolio total",
    inputNote: "Describe a representative property. Enter rates, availability and costs for one property only.",
    assumption: "Projection scaled to the stated property count, assuming the same profile, neighbourhood, calendar and costs. Differences between properties will be reviewed during the appointment.",
    missingCount: "Enter the exact number of properties.", properties: "properties", gross: "Annual gross revenue", net: "Estimated annual net, before tax",
  },
};
