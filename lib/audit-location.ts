/**
 * Geography: Comune di Genova, municipal district list (checked 2026-09-08).
 * https://trovailtuoseggio.comune.genova.it/municipi.asp
 * https://www.comune.genova.it/amministrazione/municipi
 * Boccadasse is a micro-area of Albaro, not a separate municipality.
 *
 * PRICING IS NOT MARKET DATA. Only reuse the existing site's scenario bases.
 * Null means no specific calibration: retain the city's base and flag it.
 * Add a district-specific base only after AUREVIA validates comparables.
 */
export const AUDIT_LOCATION_MODEL_VERSION = "location-scenario-2026-09-v1";

export type AuditLocationSelection = {
  area: string;
  zone: string;
  neighborhood: string;
  localityName: string;
  neighborhoodName: string;
};

export type AuditNeighborhood = { id: string; name: string; scenarioBase: number | null };
export type AuditZone = {
  id: string; territory: string; name: string; simulatorLocation: string;
  neighborhoods: AuditNeighborhood[];
};
const districts = (names: [string, string, number?][]): AuditNeighborhood[] =>
  names.map(([id, name, scenarioBase]) => ({ id, name, scenarioBase: scenarioBase ?? null }));

export const auditZones: AuditZone[] = [
  { id: "centro-est", territory: "genova", name: "Centro Est", simulatorLocation: "Gênes", neighborhoods: districts([
    ["pre", "Prè"], ["molo", "Molo"], ["maddalena", "Maddalena"], ["castelletto", "Castelletto"],
    ["portoria", "Portoria"], ["oregina", "Oregina"], ["lagaccio", "Lagaccio"],
  ]) },
  { id: "centro-ovest", territory: "genova", name: "Centro Ovest", simulatorLocation: "Gênes", neighborhoods: districts([
    ["sampierdarena", "Sampierdarena"], ["san-teodoro", "San Teodoro"],
  ]) },
  { id: "bassa-val-bisagno", territory: "genova", name: "Bassa Val Bisagno", simulatorLocation: "Gênes", neighborhoods: districts([
    ["san-fruttuoso", "San Fruttuoso"], ["marassi", "Marassi"], ["quezzi", "Quezzi"],
  ]) },
  { id: "media-val-bisagno", territory: "genova", name: "Media Val Bisagno", simulatorLocation: "Gênes", neighborhoods: districts([
    ["staglieno", "Staglieno"], ["molassana", "Molassana"], ["struppa", "Struppa"],
  ]) },
  { id: "val-polcevera", territory: "genova", name: "Val Polcevera", simulatorLocation: "Gênes", neighborhoods: districts([
    ["rivarolo", "Rivarolo"], ["bolzaneto", "Bolzaneto"], ["pontedecimo", "Pontedecimo"],
  ]) },
  { id: "medio-ponente", territory: "genova", name: "Medio Ponente", simulatorLocation: "Gênes", neighborhoods: districts([
    ["sestri-ponente", "Sestri Ponente"], ["cornigliano", "Cornigliano"],
  ]) },
  { id: "ponente", territory: "genova", name: "Ponente", simulatorLocation: "Gênes", neighborhoods: districts([
    ["pegli", "Pegli"], ["pra", "Prà"], ["voltri", "Voltri"],
  ]) },
  { id: "medio-levante", territory: "genova", name: "Medio Levante", simulatorLocation: "Gênes", neighborhoods: districts([
    ["albaro", "Albaro"], ["boccadasse", "Boccadasse"], ["foce", "Foce"], ["san-martino", "San Martino"],
  ]) },
  { id: "levante", territory: "genova", name: "Levante", simulatorLocation: "Gênes", neighborhoods: districts([
    ["valle-sturla", "Valle Sturla"], ["sturla", "Sturla"], ["quarto", "Quarto"], ["quinto", "Quinto"],
    ["nervi", "Nervi", 190], ["sant-ilario", "Sant’Ilario"],
  ]) },
  ...[
    ["camogli", "Camogli"], ["rapallo", "Rapallo"],
    ["santa-margherita", "Santa Margherita Ligure"], ["portofino", "Portofino"],
  ].map(([id, name]) => ({ id, territory: "levante", name, simulatorLocation: name, neighborhoods: [] })),
];

export const emptyAuditLocation: AuditLocationSelection = {
  area: "", zone: "", neighborhood: "", localityName: "", neighborhoodName: "",
};

export function changeAuditLocation<T extends AuditLocationSelection & { address?: string }>(
  current: T, field: keyof AuditLocationSelection, value: string,
): T {
  if (current[field] === value) return current;
  if (field === "area") return { ...current, ...emptyAuditLocation, area: value, zone: value === "ponente" || value === "other" ? "custom" : "", address: "" };
  if (field === "zone") return { ...current, zone: value, neighborhood: "", localityName: "", neighborhoodName: "", address: "" };
  if (field === "neighborhood") return { ...current, neighborhood: value, neighborhoodName: "", address: "" };
  return { ...current, [field]: value };
}

export function selectedAuditZone(selection: AuditLocationSelection) {
  return auditZones.find(zone => zone.territory === selection.area && zone.id === selection.zone);
}

export function isAuditLocationComplete(selection: AuditLocationSelection): boolean {
  if (!["genova", "levante", "ponente", "other"].includes(selection.area)) return false;
  if (selection.zone === "custom") return selection.localityName.trim().length >= 2 && selection.neighborhoodName.trim().length >= 2;
  const zone = selectedAuditZone(selection);
  if (!zone) return false;
  if (!zone.neighborhoods.length || selection.neighborhood === "custom") return selection.neighborhoodName.trim().length >= 2;
  return zone.neighborhoods.some(neighborhood => neighborhood.id === selection.neighborhood);
}

export function resolveAuditLocation(selection: AuditLocationSelection) {
  const zone = selectedAuditZone(selection);
  const neighborhood = zone?.neighborhoods.find(item => item.id === selection.neighborhood);
  const hasDistrictBase = neighborhood?.scenarioBase != null;
  const location = zone?.simulatorLocation || (selection.area === "genova" ? "Gênes" : "Autre localité en Ligurie");
  const zoneName = zone?.name || selection.localityName?.trim() || "";
  const neighborhoodName = neighborhood?.name || selection.neighborhoodName?.trim() || "";
  const cityName = selection.area === "genova" ? "Genova" : zoneName;
  return {
    modelVersion: AUDIT_LOCATION_MODEL_VERSION,
    territoryCode: selection.area, zoneCode: selection.zone, neighborhoodCode: selection.neighborhood,
    cityName, zoneName, neighborhoodName,
    label: [cityName, selection.area === "genova" ? zoneName : "", neighborhoodName].filter(Boolean).join(" · "),
    simulatorLocation: location,
    nightlyBaseOverride: hasDistrictBase ? neighborhood.scenarioBase! : undefined,
    calibration: hasDistrictBase ? "district-scenario" as const : "locality-fallback" as const,
    // No district in this initial catalogue has a market-validated benchmark.
    marketValidated: false,
    complete: isAuditLocationComplete(selection),
    uncertainty: hasDistrictBase ? .25 : .35,
  };
}

export const locationCopy = {
  it: {
    territory: "Territorio", zone: "Zona di Genova", locality: "Comune / località", neighborhood: "Quartiere",
    choose: "Selezioni…", customZone: "Altra zona / località", customDistrict: "Altro quartiere",
    specifyLocality: "Precisi la zona o il comune", specifyDistrict: "Nome del quartiere",
    example: "Es. centro, lungomare…", addressTitle: "Un indirizzo da precisare?",
    addressHint: "Facoltativo. Può indicare una via per affinare l’analisi durante il colloquio.", addressLabel: "Via o indirizzo",
    locationHint: "Scelga la zona e il quartiere del bene. Per un portafoglio, descriva un immobile rappresentativo.",
    reportTitle: "Localizzazione nel calcolo", baseLabel: "Base tariffaria del modello", nightlyLabel: "Tariffa stimata per il bene",
    districtNote: "Scenario specifico del quartiere, ripreso dal simulatore esistente. Non è un prezzo di mercato verificato: comparabili da validare con AUREVIA.",
    fallbackNote: "Quartiere registrato, ma senza un benchmark dedicato. Il calcolo usa la base della località, con un intervallo più ampio. Da calibrare con AUREVIA.",
    note: "Stima indicativa, prima delle imposte. Occupazione obiettivo 70%, non garantita. Il prezzo effettivo dipende dalla verifica del bene e dei comparabili.",
    unit: "/ notte", modelImpact: "La zona e il quartiere sono inclusi nel modello e nel dossier AUREVIA.",
  },
  fr: {
    territory: "Territoire", zone: "Zone de Gênes", locality: "Commune / localité", neighborhood: "Quartier",
    choose: "Sélectionnez…", customZone: "Autre zone / localité", customDistrict: "Autre quartier",
    specifyLocality: "Précisez la zone ou la commune", specifyDistrict: "Nom du quartier",
    example: "Ex. centre, front de mer…", addressTitle: "Une adresse à préciser ?",
    addressHint: "Facultatif. Une rue permet d’affiner l’analyse pendant l’échange.", addressLabel: "Rue ou adresse",
    locationHint: "Choisissez la zone et le quartier du bien. Pour un portefeuille, décrivez un logement représentatif.",
    reportTitle: "Localisation prise en compte", baseLabel: "Base tarifaire du modèle", nightlyLabel: "Tarif estimé pour le bien",
    districtNote: "Scénario propre au quartier, repris du simulateur existant. Ce n’est pas un prix de marché vérifié : les comparables restent à valider avec AUREVIA.",
    fallbackNote: "Quartier enregistré, sans barème dédié à ce stade. Le calcul utilise la base de la localité, avec une fourchette élargie. À calibrer avec AUREVIA.",
    note: "Estimation indicative, avant impôts. Objectif d’occupation de 70%, non garanti. Le tarif réel dépend de la vérification du bien et des comparables.",
    unit: "/ nuit", modelImpact: "La zone et le quartier sont inclus dans le modèle et le dossier AUREVIA.",
  },
  en: {
    territory: "Area", zone: "Genoa district", locality: "Town / locality", neighborhood: "Neighbourhood",
    choose: "Select…", customZone: "Other district / locality", customDistrict: "Other neighbourhood",
    specifyLocality: "District or town name", specifyDistrict: "Neighbourhood name",
    example: "E.g. town centre, waterfront…", addressTitle: "Would you like to add an address?",
    addressHint: "Optional. A street helps refine the assessment during your consultation.", addressLabel: "Street or address",
    locationHint: "Select the property’s district and neighbourhood. For a portfolio, describe a representative home.",
    reportTitle: "Location used in the model", baseLabel: "Model base nightly rate", nightlyLabel: "Estimated property nightly rate",
    districtNote: "Neighbourhood-specific scenario carried over from the existing simulator. This is not a verified market rate: AUREVIA must validate comparable properties.",
    fallbackNote: "Neighbourhood recorded, but no dedicated benchmark yet. The calculation uses the locality base with a wider range. AUREVIA calibration is still required.",
    note: "Indicative estimate, before tax. Target occupancy of 70%, not guaranteed. Actual pricing depends on verification of the property and comparables.",
    unit: "/ night", modelImpact: "Your district and neighbourhood are included in the model and the AUREVIA dossier.",
  },
};
