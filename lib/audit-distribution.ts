export const channels = ["airbnb", "booking", "direct", "other"] as const;
export type AuditChannel = typeof channels[number];
export type ChannelMix = Record<AuditChannel, { share: number | null; fee: number | null }>;
export type ChannelFeeMode = "unknown" | "average" | "detailed";
type ChannelFeeInputs = { channelMix?: ChannelMix; channelFeeMode?: ChannelFeeMode; averageChannelFee?: number | null };
export const emptyChannelMix = (): ChannelMix => ({
  airbnb: { share: null, fee: null }, booking: { share: null, fee: null },
  direct: { share: null, fee: null }, other: { share: null, fee: null },
});

export function activeChannels(distribution: string): readonly AuditChannel[] {
  if (distribution === "airbnb" || distribution === "booking") return [distribution];
  if (distribution === "direct-only") return ["direct"];
  if (distribution === "multi") return ["airbnb", "booking", "other"];
  if (distribution === "direct") return channels;
  return [];
}

const percent = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;

export function calculateDistribution(distribution: string, mix?: ChannelMix) {
  const active = activeChannels(distribution);
  const rows = active.map(channel => {
    const share = active.length === 1 ? 100 : mix?.[channel]?.share;
    const fee = mix?.[channel]?.fee;
    return { channel, share: percent(share) ? share : 0, shareValid: share == null || percent(share), fee: percent(fee) ? fee : null };
  });
  const shareTotal = rows.reduce((sum, row) => sum + row.share, 0);
  const complete = distribution === "none" || (active.length > 0 && Math.abs(shareTotal - 100) < .001
    && rows.every(row => row.shareValid && (row.share === 0 || row.fee !== null)));
  // Never invent an Airbnb, Booking.com or direct-payment fee. Unknown fees
  // leave current net unavailable until the visitor supplies their statements.
  const effectiveRate = !complete ? null : Math.round(rows.reduce((sum, row) => sum + row.share * (row.fee ?? 0) / 100, 0) * 10000) / 10000;
  return { distribution, rows, shareTotal, complete, effectiveRate, basis: "declared-revenue-weighted-fees" as const };
}

export function calculateAuditDistribution(distribution: string, finance: ChannelFeeInputs) {
  const detailed = calculateDistribution(distribution, finance.channelMix);
  const active = activeChannels(distribution);
  const selected = distribution === "none" || active.length > 0;
  // Preserve existing detailed answers, but never demand them in a fresh audit.
  const hasDetails = active.some(channel => (finance.channelMix?.[channel]?.share ?? 0) > 0 || finance.channelMix?.[channel]?.fee != null);
  const inputMode = finance.channelFeeMode ?? (hasDetails ? "detailed" : "unknown");
  if (distribution === "none") return { ...detailed, inputMode: "unknown" as const, canContinue: true };
  if (inputMode === "detailed") return { ...detailed, inputMode, canContinue: selected && detailed.complete };
  const average = inputMode === "average" ? finance.averageChannelFee : null;
  const effectiveRate = percent(average) ? average : null;
  return {
    distribution, rows: [], shareTotal: 0, inputMode,
    complete: selected && effectiveRate !== null,
    effectiveRate: selected ? effectiveRate : null,
    canContinue: selected && (average == null || percent(average)),
    basis: effectiveRate === null ? "historical-channel-costs-not-provided" as const : "owner-declared-average-fee" as const,
  };
}

export const distributionCopy = {
  it: {
    optional: "Facoltativo", refine: "Precisare i costi", defer: "Li preciserò più tardi",
    optionalHint: "Può continuare senza questi dati. Verificheremo i costi attuali insieme.",
    average: "Commissioni medie di prenotazione (%)", averageHint: "Totale commissioni e costi di pagamento ÷ ricavi delle notti × 100. Esclusa la gestione.",
    detailed: "Dettaglio per canale", useAverage: "Usare un solo tasso medio", invalidAverage: "Indichi un tasso tra 0 e 100%, oppure lasci vuoto.",
    title: "La ripartizione reale", share: "Quota dei ricavi lordi (%)", fee: "Costi effettivi del canale (%)",
    hint: "Ultimi 12 mesi. Indichi le quote di ricavo, non il numero di prenotazioni. Commissioni e costi di pagamento come da rendiconto, sul solo ricavo di pernottamento.",
    required: "Le quote devono totalizzare 100%. Indichi i costi di ogni canale utilizzato; 0 solo se realmente gratuito.",
    direct: "Prenotazioni dirette", other: "Altri portali", current: "Costi attuali di prenotazione", target: "Ipotesi distribuzione AUREVIA", unknown: "Da precisare",
    note: "L’8% è l’ipotesi media AUREVIA, non la commissione universale dei portali. Nessun aumento automatico dei ricavi per il solo cambio di canale.",
    evidence: "Scenario da validare", evidenceNote: "Tariffa e occupazione sono ipotesi, non comparabili verificati. Quartiere, stagionalità, annunci e rendimento per canale richiedono dati reali.",
    history: "Media effettiva degli ultimi 12 mesi, dopo sconti e prima delle commissioni; esclusi pulizie e imposte. Occupazione = notti vendute / notti aperte alla vendita. Escluda l’uso personale.",
    pool: "Tipo di dotazione", poolOptions: ["Nessuna piscina", "Piscina privata", "Piscina condivisa", "Solo jacuzzi"],
    poolNote: "Precisi il tipo per l’analisi con AUREVIA. Le dotazioni non aggiungono coefficienti al +20% sulla tariffa dichiarata.",
  },
  fr: {
    optional: "Facultatif", refine: "Préciser mes frais", defer: "Je préciserai plus tard",
    optionalHint: "Vous pouvez continuer sans ces chiffres. Nous vérifierons les frais actuels ensemble.",
    average: "Frais moyens de réservation (%)", averageHint: "Total commissions et frais de paiement ÷ revenus des nuitées × 100. Hors frais de gestion.",
    detailed: "Détailler par plateforme", useAverage: "Saisir un seul taux moyen", invalidAverage: "Indiquez un taux entre 0 et 100 %, ou laissez vide.",
    title: "Votre répartition réelle", share: "Part du revenu brut (%)", fee: "Frais effectifs du canal (%)",
    hint: "Sur les 12 derniers mois. Répartissez les revenus, pas le nombre de réservations. Commissions et frais de paiement de vos relevés, rapportés aux seuls revenus des nuitées.",
    required: "Les parts doivent totaliser 100 %. Indiquez les frais de chaque canal utilisé ; 0 uniquement s’il est réellement gratuit.",
    direct: "Réservations directes", other: "Autres plateformes", current: "Frais actuels de réservation", target: "Hypothèse distribution AUREVIA", unknown: "À confirmer",
    note: "Les 8 % sont l’hypothèse moyenne AUREVIA, pas la commission universelle des plateformes. Changer de canal ne déclenche pas une hausse automatique des revenus.",
    evidence: "Scénario à valider", evidenceNote: "Tarif et occupation sont des hypothèses, pas des comparables vérifiés. Quartier, saisonnalité, annonces et performance par canal nécessitent des données réelles.",
    history: "Moyenne réalisée sur les 12 derniers mois, après remises et avant commissions ; hors ménage et taxes. Occupation = nuits vendues / nuits ouvertes à la vente. Excluez l’usage personnel.",
    pool: "Type d’équipement", poolOptions: ["Pas de piscine", "Piscine privée", "Piscine partagée", "Jacuzzi uniquement"],
    poolNote: "Précisez le type pour l’analyse avec AUREVIA. Les équipements n’ajoutent aucun coefficient aux +20 % sur le tarif déclaré.",
  },
  en: {
    optional: "Optional", refine: "Add my booking fees", defer: "I’ll confirm these later",
    optionalHint: "You can continue without these figures. We’ll review current fees together.",
    average: "Average booking fees (%)", averageHint: "Total commissions and payment fees ÷ accommodation revenue × 100. Excludes management fees.",
    detailed: "Break down by channel", useAverage: "Use one average rate", invalidAverage: "Enter a rate from 0 to 100%, or leave blank.",
    title: "Your actual channel mix", share: "Share of gross revenue (%)", fee: "Effective channel costs (%)",
    hint: "Last 12 months. Split revenue, not reservation counts. Use statement commissions and payment costs as a percentage of accommodation revenue only.",
    required: "Shares must total 100%. Enter costs for every active channel; use 0 only if it is genuinely free.",
    direct: "Direct bookings", other: "Other platforms", current: "Current booking fees", target: "AUREVIA distribution assumption", unknown: "To confirm",
    note: "8% is AUREVIA’s blended assumption, not a universal platform commission. Changing channels does not automatically increase revenue.",
    evidence: "Scenario to validate", evidenceNote: "Rate and occupancy are assumptions, not verified comparables. Neighbourhood, seasonality, listing quality and channel performance need actual data.",
    history: "Realised average over the last 12 months, after discounts and before commissions; excluding cleaning and taxes. Occupancy = nights sold / nights offered. Exclude personal use.",
    pool: "Amenity type", poolOptions: ["No pool", "Private pool", "Shared pool", "Jacuzzi only"],
    poolNote: "Specify the type for your AUREVIA review. Amenities add no coefficients to the +20% on your declared rate.",
  },
};
