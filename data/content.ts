export type Service = { slug: string; title: string; cardTitle?: string; short: string; number: string; image?: string };
export type Property = { slug: string; name: string; location: string; bedrooms: number; guests: number; baths: number; tone: number; image: string; shortDescription?: string; description?: string; propertyType?: string; surface?: number; amenities?: string[]; gallery?: string[] };

export const services: Service[] = [
  { slug: "gestione-proprieta", title: "Gestion locative", cardTitle: "Gestion complète du quotidien", short: "Calendrier, réservations, coordination et suivi réunis auprès d’un interlocuteur local.", number: "01" },
  { slug: "concierge", title: "Assistance locale", cardTitle: "Une réponse pratique sur place", short: "Demandes voyageurs, réservations locales et solutions utiles pendant le séjour.", number: "02" },
  { slug: "accoglienza-voyageurs", title: "Accueil des voyageurs", cardTitle: "Des arrivées simples et préparées", short: "Informations, accès, installation et assistance au bon moment.", number: "03" },
  { slug: "pulizie-biancheria", title: "Ménage et linge", cardTitle: "Un bien prêt entre chaque séjour", short: "Rotations, linge, contrôles et réassort coordonnés selon une checklist claire.", number: "04" },
  { slug: "manutenzione", title: "Maintenance", cardTitle: "Les problèmes traités à temps", short: "Diagnostic, devis, artisans locaux et suivi d’intervention sans multiplier les interlocuteurs.", number: "05" },
  { slug: "revenue-management", title: "Optimisation", cardTitle: "Un calendrier mieux piloté", short: "Positionnement, tarifs, durées de séjour et lecture simple des performances.", number: "06" },
  { slug: "sicurezza", title: "Suivi du bien", cardTitle: "Des accès et équipements contrôlés", short: "Inventaire, clés, signalement des écarts et procédures connues en cas d’incident.", number: "07" },
  { slug: "amministrazione", title: "Suivi propriétaire", cardTitle: "L’essentiel, sans le bruit", short: "Réservations, justificatifs, interventions et décisions regroupés dans un suivi lisible.", number: "08" },
].map((service, index) => ({
  ...service,
  image: [
    "/images/services/property-management.webp",
    "/images/services/concierge-service.webp",
    "/images/services/guest-welcome.webp",
    "/images/services/housekeeping.webp",
    "/images/services/maintenance.webp",
    "/images/services/revenue-management.webp",
    "/images/services/security.webp",
    "/images/services/administration.webp",
  ][index],
}));

export const properties: Property[] = [
  { slug: "terrazza-castelletto", name: "Terrazza Castelletto", location: "Castelletto · Genova", bedrooms: 2, guests: 4, baths: 1, tone: 1, image: "/images/home/hero-concierge.webp", shortDescription: "Appartement lumineux avec vue sur la ville.", description: "Fiche de démonstration destinée à valider la structure du catalogue Velyo.", propertyType: "Appartement", surface: 82, amenities: ["Terrasse", "Cuisine équipée", "Wi-Fi", "Vue ville"] },
  { slug: "loft-porto-antico", name: "Loft Porto Antico", location: "Porto Antico · Genova", bedrooms: 1, guests: 3, baths: 1, tone: 2, image: "/images/about/genova-architecture.webp", shortDescription: "Un pied-à-terre proche du port et du centre historique.", description: "Exemple éditorial, sans disponibilité commerciale réelle.", propertyType: "Loft", surface: 64, amenities: ["Proche du port", "Climatisation", "Arrivée autonome", "Espace ouvert"] },
  { slug: "casa-carignano", name: "Casa Carignano", location: "Carignano · Genova", bedrooms: 3, guests: 6, baths: 2, tone: 3, image: "/images/owners/property-care.webp", shortDescription: "Des volumes confortables dans un quartier résidentiel central.", description: "Présentation de démonstration à remplacer par des informations vérifiées.", propertyType: "Appartement", surface: 118, amenities: ["Trois chambres", "Balcon", "Ascenseur", "Double séjour"] },
  { slug: "appartamento-maddalena", name: "Appartamento Maddalena", location: "Maddalena · Genova", bedrooms: 2, guests: 4, baths: 1, tone: 4, image: "/images/home/genova-night.webp", shortDescription: "Une adresse au cœur des caruggi.", description: "Fiche exemple pour tester le parcours de consultation.", propertyType: "Appartement", surface: 76, amenities: ["Centre historique", "Cuisine équipée", "Bureau", "Charme ancien"] },
  { slug: "casa-nervi", name: "Casa Nervi", location: "Nervi · Genova", bedrooms: 2, guests: 5, baths: 2, tone: 5, image: "/images/home/liguria-coast.webp", shortDescription: "Une base calme près des parcs et de la promenade.", description: "Exemple de bien côtier géré à Genova.", propertyType: "Maison", surface: 94, amenities: ["Proche mer", "Balcon", "Deux salles d’eau", "Quartier calme"] },
  { slug: "casa-boccadasse", name: "Casa Boccadasse", location: "Boccadasse · Genova", bedrooms: 1, guests: 2, baths: 1, tone: 6, image: "/images/about/lighthouse.webp", shortDescription: "Une petite adresse pensée pour un séjour à deux.", description: "Fiche de démonstration, à remplacer par un bien autorisé.", propertyType: "Appartement", surface: 48, amenities: ["Pour deux voyageurs", "Proche mer", "Climatisation", "Cuisine compacte"] },
];

export const experiences = [
  ["porto-antico-famille", "Porto Antico en famille", "Un parcours simple autour du port, adapté aux familles et aux premières heures dans la ville.", "/images/home/hero-concierge.webp", ["Itinéraire à pied", "Repères pratiques", "Options selon la météo"]],
  ["centre-historique", "Centre historique & palazzi", "Ruelles, palais et places emblématiques dans un chemin facile à suivre.", "/images/about/genova-architecture.webp", ["Parcours personnalisé", "Palais et places", "Pauses gourmandes"]],
  ["saveurs-genovese", "Saveurs génoises", "Quelques tables et spécialités locales sélectionnées selon le quartier et le budget.", "/images/about/philosophy.webp", ["Adresses locales", "Réservation sur demande", "Options végétariennes"]],
  ["nervi-parcs", "Nervi & ses parcs", "Une respiration entre promenade côtière, parcs et petites adresses du quartier.", "/images/home/liguria-coast.webp", ["Accès expliqué", "Promenade côtière", "Suggestions de déjeuner"]],
  ["boccadasse-mer", "Boccadasse & la mer", "Un moment simple au bord de l’eau avec les bons horaires et les accès utiles.", "/images/about/lighthouse.webp", ["Créneau conseillé", "Accès et retour", "Options pour dîner"]],
  ["camogli-journee", "Camogli à la journée", "Une escapade réaliste depuis Genova, sans empiler trop d’étapes.", "/images/owners/property-care.webp", ["Transport conseillé", "Itinéraire à pied", "Plan B météo"]],
  ["aquarium-musees", "Aquarium & musées", "Une journée culturelle organisée selon l’âge des voyageurs et le temps disponible.", "/images/home/owner-trust.webp", ["Billets et horaires", "Parcours par durée", "Alternatives en cas de pluie"]],
  ["transferts-locaux", "Transferts locaux", "Gare, aéroport, port ou rendez-vous : des déplacements organisés sans complication.", "/images/home/genova-night.webp", ["Chauffeur ou taxi", "Suivi des horaires", "Accueil personnalisé"]],
].map(([slug, title, short, image, details]) => ({ slug, title, short, image, details } as { slug: string; title: string; short: string; image: string; details: string[] }));

export const testimonials = [
  { quote: "Un service clair, réactif et vraiment présent sur place.", place: "Genova" },
  { quote: "Nous avons enfin un interlocuteur unique pour le logement.", place: "Nervi" },
  { quote: "Les décisions importantes nous sont présentées sans bruit inutile.", place: "Castelletto" },
];

export const faqs = [
  ["Dans quelles zones intervenez-vous ?", "Velyo intervient à Genova et étudie les demandes dans les zones proches selon l’accès, le type de bien et le niveau de service attendu."],
  ["Puis-je continuer à utiliser personnellement mon bien ?", "Oui. Vos périodes d’occupation sont intégrées au calendrier et restent prioritaires selon le cadre convenu."],
  ["Le simulateur garantit-il les revenus indiqués ?", "Non. Il fournit une estimation indicative. Une visite et une analyse personnalisée restent indispensables."],
  ["Comment sont facturés le ménage et les interventions ?", "Les frais séparés et les éventuels seuils de validation sont présentés dans la proposition de gestion avant le démarrage."],
  ["Comment serai-je informé ?", "Le rythme du suivi est défini avec vous. L’objectif est de transmettre l’essentiel et de solliciter votre validation au bon moment."],
  ["Comment gérez-vous la maintenance ?", "Velyo qualifie la situation, recherche l’intervenant adapté, présente les éléments utiles et suit l’action sur place."],
  ["Les propriétés affichées sont-elles disponibles ?", "Les fiches présentes dans cette version sont des exemples de structure. Elles doivent être remplacées par des biens réels et autorisés avant publication."],
  ["Combien de temps faut-il pour démarrer ?", "Le délai dépend de l’état du bien, des accès, des supports à préparer et des services retenus. Il est précisé après la visite initiale."],
];
