import { auditCopy } from "../components/audit-content";

// Presentation only: the original submission, figures and visitor language stay intact.
export const auditEmailLabels: Record<string, string> = {
  reportVersion: "Version du dossier", generatedAt: "Date de création", language: "Langue du client",
  qualification: "Qualification du prospect", portfolioProjection: "Projection du portefeuille",
  perProperty: "Résultats par logement", locationModel: "Localisation et hypothèses tarifaires",
  evidenceAndLimits: "Hypothèses et limites de l’analyse", distributionModel: "Canaux de réservation et commissions",
  declaredProperty: "Bien déclaré", declaredPerformance: "Performance déclarée",
  aureviaCentralModel: "Modèle financier AUREVIA", internalScores: "Scores internes",
  confidentialMonthlyPlan: "Plan mensuel confidentiel", callPreparation: "Préparation de l’appel",
  code: "Identifiant", answer: "Réponse", label: "Libellé", exactPropertyCount: "Nombre exact de biens",
  portfolio: "Taille du portefeuille", currentSituation: "Situation actuelle", status: "Situation actuelle",
  objectives: "Priorités du propriétaire", objective: "Priorités du propriétaire", ownerPriorities: "Priorités du propriétaire",
  distribution: "Canaux de réservation", location: "Localisation", territory: "Territoire",
  compliance: "Conformité", timing: "Délai souhaité", timeline: "Délai souhaité", constraint: "Contrainte — réponse originale",
  ownerConstraint: "Contrainte du propriétaire — réponse originale", address: "Adresse — réponse originale",
  modelVersion: "Version du modèle", calculationVersion: "Version du calcul", territoryCode: "Identifiant du territoire",
  zoneCode: "Identifiant de la zone", neighborhoodCode: "Identifiant du quartier", cityName: "Ville",
  zoneName: "Zone / commune", neighborhoodName: "Quartier", localityName: "Localité précisée",
  simulatorLocation: "Localité de référence du simulateur", nightlyBaseOverride: "Base tarifaire propre au quartier (€ / nuit)",
  calibration: "Type de référence tarifaire", marketValidated: "Référence validée sur le marché",
  complete: "Informations complètes", uncertainty: "Amplitude relative de la fourchette",
  localityBaseNightly: "Base tarifaire de la localité (€ / nuit)", appliedBaseNightly: "Base tarifaire retenue (€ / nuit)",
  geographicCoefficient: "Coefficient géographique de référence", propertyNightly: "Repère tarifaire du bien (€ / nuit)",
  declaredNightly: "Tarif déclaré (€ / nuit)", projectedNightly: "Tarif simulé (€ / nuit)", pricingBasis: "Hypothèse tarifaire",
  nightlyEffectVsLocality: "Écart au repère de la localité (€ / nuit)", appliedToCentralRate: "Repère appliqué au tarif central",
  indicativeAnnualGrossPerProperty: "Brut annuel indicatif par logement (€)", indicativeAnnualGrossPortfolio: "Brut annuel indicatif du portefeuille (€)",
  assumptions: "Hypothèses", channelRevenueUpliftCalibrated: "Hausse des revenus par canal étayée par des données",
  jointPriceOccupancyValidated: "Tarif et occupation validés ensemble", occupancyBasis: "Hypothèse d’occupation",
  channelCostBasis: "Base des frais de réservation", targetPlatformBasis: "Hypothèse des frais de distribution AUREVIA",
  rangeBasis: "Construction de la fourchette", needsReview: "Éléments à vérifier",
  rows: "Détail par canal", channels: "Canaux", channel: "Canal", share: "Part des revenus (%)", shareValid: "Part valide",
  fee: "Frais du canal (%)", feeRate: "Taux de frais (%)", shareTotal: "Total des parts (%)", effectiveRate: "Taux effectif (%)",
  basis: "Base de calcul", inputMode: "Mode de saisie des frais", canContinue: "Données suffisantes pour poursuivre",
  currentGrossRevenue: "Revenus bruts actuels (€)", currentOwnerNet: "Net propriétaire actuel estimé (€)",
  projectedGrossRevenue: "Revenus bruts simulés (€)", projectedOwnerNet: "Net propriétaire simulé avant impôts (€)",
  projectedNetGain: "Écart net simulé (€)", annualOperatingCosts: "Charges annuelles (€)", availablePropertyNights: "Nuits disponibles pour le portefeuille",
  currentGross: "Revenus bruts actuels (€)", currentNet: "Net actuel estimé (€)", projectedGross: "Revenus bruts simulés (€)",
  projectedNet: "Net simulé avant impôts (€)", annualGain: "Écart net annuel (€)", grossGain: "Écart brut annuel (€)",
  occupancyContribution: "Effet des nuits vendues (€)", pricingContribution: "Effet de la tarification (€)",
  currentBookedNights: "Nuits actuellement vendues", targetBookedNights: "Nuits vendues simulées", monthlyGross: "Moyenne brute mensuelle (€)",
  low: "Scénario brut prudent (€)", high: "Scénario brut haut (€)", annualCosts: "Charges annuelles (€)",
  scope: "Périmètre décrit", propertyType: "Type de bien", floorAreaM2: "Surface (m²)", bedrooms: "Chambres",
  guestCapacity: "Capacité d’accueil", finishLevel: "Niveau de finition", availableDaysPerYear: "Nuits disponibles par an",
  amenities: "Équipements", seaView: "Vue mer", poolType: "Type de piscine", terrace: "Terrasse", parking: "Stationnement",
  hasRentalHistory: "Historique locatif disponible", averageNightlyRate: "Tarif moyen déclaré (€ / nuit)", occupancyRate: "Occupation (%)",
  currentManagementFeeRate: "Gestion actuelle (%)", platformFeeRate: "Frais de réservation (%)", channelFeeMode: "Mode de saisie des frais",
  averageChannelFee: "Frais moyens de réservation (%)", channelMix: "Répartition des canaux", period: "Période et définition des revenus",
  annualOperatingCostsPerProperty: "Charges annuelles par logement (€)", annualOperatingCostsPortfolio: "Charges annuelles du portefeuille (€)",
  calculatedBookedNights: "Nuits vendues calculées", calculatedGrossRevenue: "Revenus bruts calculés (€)", calculatedOwnerNet: "Net propriétaire calculé (€)",
  rateBasis: "Hypothèse tarifaire", nightRounding: "Règle d’arrondi des nuits", optimizationPerProperty: "Simulation par logement",
  grossRevenueDriversPortfolio: "Origine de l’écart brut du portefeuille", occupancy: "Occupation / effet des nuits vendues",
  pricing: "Effet de la tarification (€)", totalGrossGain: "Écart brut total (€)", targetOccupancyRate: "Objectif d’occupation (%)",
  aureviaManagementFeeRate: "Gestion AUREVIA (%)", targetAverageNightlyRate: "Tarif moyen simulé (€ / nuit)",
  projectedOwnerNetGain: "Écart net propriétaire simulé (€)", prudentGrossScenario: "Scénario brut prudent (€)",
  centralGrossScenario: "Scénario brut central (€)", highGrossScenario: "Scénario brut haut (€)",
  evidence: "Niveau de validation", currentAnnual: "Revenus bruts annuels actuels (€)", nightly: "Tarif moyen simulé (€ / nuit)",
  bookedNights: "Nuits vendues simulées", additionalNights: "Écart de nuits vendues", annual: "Revenus bruts annuels simulés (€)",
  gain: "Écart brut annuel (€)", gainRate: "Écart brut (%)", multiplier: "Rapport entre revenus simulés et actuels",
  nightlyUpliftPercent: "Variation du tarif moyen (%)", occupancyUpliftPoints: "Variation d’occupation (points)",
  estimatedNightly: "Tarif moyen estimé (€ / nuit)", propertyReferenceNightly: "Repère tarifaire du bien (€ / nuit)",
  overallFit: "Adéquation globale (/100)", revenuePotential: "Potentiel de revenus (/100)", operationalEfficiency: "Efficacité de gestion (/100)",
  propertyProtection: "Protection du bien (/100)", projectUrgency: "Urgence du projet (/100)",
  months: "Répartition mensuelle", month: "Mois", monthIndex: "Numéro du mois (de 0 à 11)",
  availableNightsPerProperty: "Nuits disponibles par logement", bookedNightsPerProperty: "Nuits vendues par logement",
  nightlyRate: "Tarif moyen (€ / nuit)", recommendedNightlyRate: "Tarif conseillé (€ / nuit)",
  projectedGrossPerProperty: "Revenus bruts simulés par logement (€)", projectedGrossPortfolio: "Revenus bruts simulés du portefeuille (€)",
  recommendedOffer: "Offre recommandée", firstPriorities: "Premières priorités", pointsToVerifyDuringCall: "Points à vérifier pendant l’appel",
  managementFee: "Frais de gestion", checks: "Vérifications", note: "Note", notes: "Notes",
  airbnb: "Airbnb", booking: "Booking.com", direct: "Réservations directes", other: "Autres plateformes",
};

const frenchText: Record<string, string> = {
  "district-scenario": "Scénario indicatif propre au quartier", "locality-fallback": "Repère indicatif de la localité, faute de référence de quartier",
  "declared-rate-plus-20": "Tarification dynamique : hypothèse de hausse moyenne de 20 % du tarif déclaré",
  "launch-property-scenario": "Estimation de lancement selon le bien et la localité", "unvalidated-scenario": "Scénario non validé sur le marché",
  "representative-property-extrapolation": "Extrapolation à partir d’un logement représentatif", "single-property": "Un seul logement",
  "declared-revenue-weighted-fees": "Frais déclarés, pondérés selon la part des revenus de chaque canal",
  "historical-channel-costs-not-provided": "Frais historiques des canaux non renseignés", "owner-declared-average-fee": "Taux moyen déclaré par le propriétaire",
  "One representative property; not the sum of all properties": "Un logement représentatif, et non la somme de tous les logements",
  "Last 12 months, accommodation revenue after discounts and before commissions; excluding cleaning and taxes": "Douze derniers mois : revenus des nuitées après remises et avant commissions, hors ménage et taxes",
  "Whole sold nights, rounded to nearest integer": "Nuits vendues arrondies à l’entier le plus proche",
  "AUREVIA stated 70% operating target; higher historical occupancy retained only at an unchanged rate": "Objectif opérationnel AUREVIA de 70 % ; une occupation historique supérieure n’est conservée qu’à tarif inchangé",
  "Declared nightly rate +20%, rounded to cents, without additional property or locality coefficients; AUREVIA scenario assumption, not verified comparables": "Tarification dynamique : tarif déclaré majoré de 20 % en moyenne, arrondi au centime, sans coefficient supplémentaire de bien ou de localité. Hypothèse AUREVIA, non fondée sur des comparables vérifiés",
  "No declared current rate: existing unvalidated property/locality launch scenario, without an additional 20% uplift": "Sans tarif actuel déclaré : estimation de lancement selon le bien et la localité, non validée sur le marché et sans majoration supplémentaire de 20 %",
  "AUREVIA user-provided blended 8% assumption; not a universal platform rate": "Hypothèse moyenne de 8 % indiquée par AUREVIA, et non commission universelle des plateformes",
  "Sensitivity band, not a confidence interval: ±25% for the existing district scenario, ±35% for locality fallback": "Fourchette de sensibilité, et non intervalle de confiance : ±25 % pour le scénario de quartier, ±35 % pour le repère de localité",
  "booked comparable rates by micro-location": "Tarifs réellement réservés de biens comparables dans le même micro-quartier",
  "joint annual rate and occupancy": "Cohérence du tarif moyen annuel et du taux d’occupation",
  "listing quality and channel conversion": "Qualité de l’annonce et conversion de chaque canal",
  "actual future distribution fees": "Frais futurs réels de distribution",
  "private/shared pool availability and seasonality": "Accès à la piscine privée ou partagée et saisonnalité",
  "Existing simulator reference bases are not market-validated. For a declared nightly rate, only +20% is applied: locality and property reference prices remain internal context, not additional multipliers. Without a declared rate, the existing property/locality launch scenario is used without a further uplift. AUREVIA's stated 70% operating target and joint rate/occupancy require validation. Not a guarantee of returns.": "Les bases du simulateur ne sont pas validées sur le marché. Avec un tarif déclaré, seule l’hypothèse de +20 % est appliquée : les repères du bien et de la localité restent un contexte interne, sans multiplicateur supplémentaire. Sans tarif déclaré, l’estimation de lancement existante est utilisée sans majoration. L’objectif AUREVIA de 70 % et la cohérence tarif / occupation doivent être validés. Aucun rendement n’est garanti.",
  "Indicative seasonal allocation, not observed bookings. Constant optimized average nightly rate from the shared simulator model. Availability distributed over a 365-day year; exact owner-use dates and minimum stays must be validated.": "Répartition saisonnière indicative, et non réservations observées. Tarif moyen simulé constant, issu du modèle commun. Disponibilité répartie sur une année de 365 jours ; dates d’usage personnel et durées minimales de séjour à valider.",
};

const questionKeys: Record<string, string> = {
  currentSituation: "status", objectives: "objective", ownerPriorities: "objective",
  timeline: "timing", territory: "area",
};
function frenchChoice(key: string, value: string) {
  const questionKey = questionKeys[key] || key;
  const options = auditCopy.fr.questions.find(question => question.key === questionKey)?.options;
  if (!options) return value;
  const selected = options.find(option => option.value === value || Object.values(auditCopy).some(copy =>
    copy.questions.find(question => question.key === questionKey)?.options?.some(candidate => candidate.value === option.value && candidate.label === value)));
  return selected?.label || value;
}

const verbatim = new Set(["name", "surname", "email", "phone", "address", "constraint", "ownerConstraint", "message", "city", "cityName", "zone", "zoneName", "neighborhood", "neighborhoodName", "localityName"]);
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function frenchAuditValue(value: unknown, key = ""): unknown {
  if (Array.isArray(value)) return value.map(item => frenchAuditValue(item, key));
  if (record(value)) {
    const translated = Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, frenchAuditValue(child, childKey)]));
    if (typeof value.code === "string") {
      const answer = frenchChoice(key, value.code);
      if (answer !== value.code) {
        translated.code = answer;
        if ("answer" in value) translated.answer = answer;
        if ("label" in value) translated.label = answer;
      }
    }
    return translated;
  }
  if (typeof value !== "string" || verbatim.has(key)) return value;
  if (key === "language") return ({ fr: "Français", it: "Italien", en: "Anglais" } as Record<string, string>)[value] || value;
  if (key === "poolType") return ({ none: "Aucune piscine", private: "Piscine privée", shared: "Piscine partagée", jacuzzi: "Jacuzzi uniquement" } as Record<string, string>)[value] || value;
  if (key === "inputMode" || key === "channelFeeMode") return ({ unknown: "Non renseigné", average: "Taux moyen", detailed: "Détail par canal" } as Record<string, string>)[value] || value;
  if (key === "channel") return auditEmailLabels[value] || value;
  return frenchText[value] || frenchChoice(key, value);
}

export function frenchAuditEmailPayload<T extends Record<string, unknown>>(payload: T): T {
  const translated = frenchAuditValue(payload) as Record<string, unknown>;
  const report = record(translated.auditReport) ? translated.auditReport : {};
  const qualification = record(report.qualification) ? report.qualification : {};
  if (Array.isArray(qualification.objectives)) {
    translated.objective = qualification.objectives.filter(record).map(item => item.label).join(" · ");
  }
  // The generated summary repeats the structured dossier. Rebuild it in French
  // for visitors using an older, already-open IT/EN page; never alter free text.
  if (typeof payload.message === "string" && payload.message.startsWith("Audit publicitaire —")) {
    const projection = record(report.portfolioProjection) ? report.portfolioProjection : {};
    const amount = (value: unknown) => typeof value === "number" && Number.isFinite(value)
      ? `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value)} €` : "à confirmer";
    translated.message = `Audit publicitaire — ${payload.propertyCount} bien(s). Priorités : ${translated.objective || "à préciser"}. Revenus bruts actuels : ${amount(projection.currentGrossRevenue)}. Revenus bruts simulés : ${amount(projection.projectedGrossRevenue)}. Net propriétaire simulé, avant impôts : ${amount(projection.projectedOwnerNet)}. Réponses détaillées, hypothèses et plan mensuel dans le dossier ci-dessous.`;
  }
  return translated as T;
}
