import { translateDeep } from "@/lib/public-site/i18n";

export type Service = { slug: string; title: string; cardTitle?: string; short: string; number: string; image?: string; category: string; scope: string[]; ownerValue: string };
export type Property = { slug: string; name: string; location: string; bedrooms: number; guests: number; baths: number; tone: number; image: string; shortDescription?: string; description?: string; propertyType?: string; surface?: number; amenities?: string[]; gallery?: string[] };
export type Experience = { slug: string; title: string; cardTitle?: string; short: string; image: string; details: string[]; number: string; format: string; moment: string; commercial: string; ownerValue: string };

const serviceSource: Service[] = [
  { slug: "gestione-proprieta", title: "Gestion intégrale du bien", cardTitle: "Gestion intégrale du bien", short: "AUREVIA suit le calendrier, les réservations, les voyageurs et les intervenants depuis Genova.", number: "01", category: "Gestion", scope: ["Calendrier et réservations", "Messages voyageurs", "Coordination locale"], ownerValue: "Vous ne portez plus chaque demande ni chaque relance." },
  { slug: "concierge", title: "Conciergerie personnalisée", cardTitle: "Conciergerie personnalisée", short: "Questions, demandes et imprévus sont pris en charge pendant toute la durée du séjour.", number: "02", category: "Voyageurs", scope: ["Réponse pendant le séjour", "Conseils de quartier", "Imprévus suivis"], ownerValue: "Les voyageurs ont un contact local identifiable." },
  { slug: "accoglienza-voyageurs", title: "Accueil des voyageurs", cardTitle: "Accueil des voyageurs", short: "Accès, clés et informations pratiques sont préparés avant l’installation des voyageurs.", number: "03", category: "Arrivées", scope: ["Message avant arrivée", "Accès et clés", "Installation accompagnée"], ownerValue: "Des arrivées plus fluides et beaucoup moins d’appels." },
  { slug: "pulizie-biancheria", title: "Entretien & linge", cardTitle: "Entretien & linge", short: "Ménage, rotation du linge, réassort et contrôle final sont coordonnés entre deux séjours.", number: "04", category: "Préparation", scope: ["Rotation planifiée", "Linge et consommables", "Contrôle après passage"], ownerValue: "Le bien est réellement prêt, pas seulement déclaré propre." },
  { slug: "manutenzione", title: "Maintenance coordonnée", cardTitle: "Maintenance coordonnée", short: "Le besoin est qualifié, le devis validé et l’intervention suivie jusqu’à sa résolution.", number: "05", category: "Entretien", scope: ["Besoin qualifié", "Devis et validation", "Intervention suivie"], ownerValue: "Vous décidez sans rechercher ni relancer les prestataires." },
  { slug: "revenue-management", title: "Performance locative", cardTitle: "Performance locative", short: "Le prix des nuits et la durée des séjours évoluent selon la saison et les réservations réelles.", number: "06", category: "Revenus", scope: ["Tarifs ajustés", "Durées adaptées", "Calendrier suivi"], ownerValue: "Vous voyez pourquoi les prix changent et ce qu’ils apportent." },
  { slug: "sicurezza", title: "Sécurité du bien", cardTitle: "Sécurité du bien", short: "Accès, équipements et éventuels écarts sont contrôlés entre deux séjours.", number: "07", category: "Contrôle", scope: ["Contrôle entre séjours", "Accès suivis", "Écarts signalés"], ownerValue: "Vous savez ce qui a changé et quelle action est prévue." },
  { slug: "amministrazione", title: "Suivi administratif", cardTitle: "Suivi administratif", short: "Réservations, dépenses, interventions et décisions sont regroupées dans un suivi lisible.", number: "08", category: "Suivi", scope: ["Point propriétaire", "Dépenses et justificatifs", "Historique du bien"], ownerValue: "Vous gardez la visibilité sans reprendre l’exploitation." },
].map((service, index) => ({
  ...service,
  image: [
    "/images/public-site/aurevia-services/gestion-hero.webp",
    "/images/public-site/aurevia-services/conciergerie-hero.webp",
    "/images/public-site/aurevia-services/accueil-hero.webp",
    "/images/public-site/aurevia-services/entretien-hero.webp",
    "/images/public-site/aurevia-services/maintenance-hero.webp",
    "/images/public-site/aurevia-services/performance-hero.webp",
    "/images/public-site/aurevia-services/securite-hero.webp",
    "/images/public-site/aurevia-services/administration-hero.webp",
  ][index],
}));

export const services: Service[] = serviceSource.map((service) => ({
  ...service,
  title: translateDeep(service.title, "it"),
  cardTitle: service.cardTitle ? translateDeep(service.cardTitle, "it") : undefined,
  short: translateDeep(service.short, "it"),
  category: translateDeep(service.category, "it"),
  scope: translateDeep(service.scope, "it"),
  ownerValue: translateDeep(service.ownerValue, "it"),
}));

const propertySource: Property[] = [
  { slug: "terrazza-castelletto", name: "Terrazza Castelletto", location: "Castelletto · Genova", bedrooms: 2, guests: 4, baths: 1, tone: 1, image: "/images/public-site/concierge/family-apartment.webp", shortDescription: "Un appartement lumineux pensé pour un séjour en famille.", description: "Fiche de démonstration destinée à valider la structure du catalogue AUREVIA.", propertyType: "Appartement", surface: 82, amenities: ["Terrasse", "Cuisine équipée", "Wi-Fi", "Vue ville"] },
  { slug: "loft-porto-antico", name: "Loft Porto Antico", location: "Porto Antico · Genova", bedrooms: 1, guests: 3, baths: 1, tone: 2, image: "/images/public-site/concierge/home-preparation.webp", shortDescription: "Un pied-à-terre simple proche du port et du centre historique.", description: "Exemple éditorial, sans disponibilité commerciale réelle.", propertyType: "Loft", surface: 64, amenities: ["Proche du port", "Climatisation", "Arrivée autonome", "Espace ouvert"] },
  { slug: "casa-carignano", name: "Casa Carignano", location: "Carignano · Genova", bedrooms: 3, guests: 6, baths: 2, tone: 3, image: "/images/public-site/concierge/family-apartment.webp", shortDescription: "Un bien confortable dans un quartier résidentiel central.", description: "Présentation de démonstration à remplacer par des informations vérifiées.", propertyType: "Appartement", surface: 118, amenities: ["Trois chambres", "Balcon", "Ascenseur", "Double séjour"] },
  { slug: "appartamento-maddalena", name: "Appartamento Maddalena", location: "Maddalena · Genova", bedrooms: 2, guests: 4, baths: 1, tone: 4, image: "/images/public-site/concierge/family-apartment.webp", shortDescription: "Une adresse vivante au cœur des caruggi.", description: "Fiche exemple pour tester le parcours de consultation.", propertyType: "Appartement", surface: 76, amenities: ["Centre historique", "Cuisine équipée", "Bureau", "Charme ancien"] },
  { slug: "casa-nervi", name: "Casa Nervi", location: "Nervi · Genova", bedrooms: 2, guests: 5, baths: 2, tone: 5, image: "/images/public-site/concierge/nervi-family.webp", shortDescription: "Une base calme près des parcs et de la promenade.", description: "Exemple de bien côtier géré à Genova.", propertyType: "Logement indépendant", surface: 94, amenities: ["Proche mer", "Balcon", "Deux salles d’eau", "Quartier calme"] },
  { slug: "casa-boccadasse", name: "Casa Boccadasse", location: "Boccadasse · Genova", bedrooms: 1, guests: 2, baths: 1, tone: 6, image: "/images/public-site/concierge/home-preparation.webp", shortDescription: "Une petite adresse pratique pour découvrir le bord de mer.", description: "Fiche de démonstration, à remplacer par un bien autorisé.", propertyType: "Appartement", surface: 48, amenities: ["Pour deux voyageurs", "Proche mer", "Climatisation", "Cuisine compacte"] },
];

export const properties: Property[] = propertySource.map((property) => ({
  ...property,
  shortDescription: property.shortDescription ? translateDeep(property.shortDescription, "it") : undefined,
  description: property.description ? translateDeep(property.description, "it") : undefined,
  propertyType: property.propertyType ? translateDeep(property.propertyType, "it") : undefined,
  amenities: property.amenities ? translateDeep(property.amenities, "it") : undefined,
}));

const experienceSource: Experience[] = [
  { slug: "transfert-prive", number: "01", title: "Transfert privé", cardTitle: "Transfert privé", short: "Un chauffeur attend le voyageur à la gare ou à l’aéroport et le conduit directement au bien.", image: "/images/public-site/concierge/genova-blue-hour-premium.webp", details: ["Lieu, horaire et numéro de trajet recueillis", "Nombre de voyageurs et bagages confirmés", "Chauffeur et véhicule adaptés sélectionnés", "Prise en charge nominative organisée", "Retard du train ou du vol suivi", "Adresse du bien et contact transmis au chauffeur"], format: "Service à réserver", moment: "Avant l’arrivée", commercial: "Le trajet et son prix sont confirmés avant la réservation. Le voyageur règle la prestation séparément.", ownerValue: "Une arrivée plus fluide et un service additionnel clairement valorisé." },
  { slug: "massage-domicile", number: "02", title: "Massage à domicile", cardTitle: "Massage à domicile", short: "Un praticien sélectionné intervient directement dans le bien, sur un créneau confirmé avec le voyageur.", image: "/images/public-site/concierge/home-preparation-premium.webp", details: ["Type de massage et durée précisés", "Nombre de personnes confirmé", "Praticien vérifié et adapté recherché", "Créneau et tarif validés à l’avance", "Accès au bien organisé discrètement", "Consignes de préparation transmises au voyageur"], format: "Service à réserver", moment: "Avant ou pendant le séjour", commercial: "La formule, la durée et le tarif sont validés par le voyageur avant confirmation.", ownerValue: "Une prestation de bien-être simple à proposer, sans organisation supplémentaire pour vous." },
  { slug: "guide-touristique", number: "03", title: "Guide touristique", cardTitle: "Guide touristique", short: "Une visite privée ou en petit groupe, construite selon le quartier, la durée et les centres d’intérêt.", image: "/images/public-site/concierge/rolli-walk-premium.jpg", details: ["Centres d’intérêt et rythme recueillis", "Langue et durée de visite choisies", "Guide local disponible sélectionné", "Parcours adapté au point de départ", "Lieu de rendez-vous confirmé", "Coordonnées et programme réunis avant la visite"], format: "Service à réserver", moment: "Avant le séjour", commercial: "Le parcours, la disponibilité du guide et le prix sont confirmés avant engagement.", ownerValue: "Une découverte locale mieux préparée et une expérience réellement différenciante." },
  { slug: "courses-avant-arrivee", number: "04", title: "Courses avant l’arrivée", cardTitle: "Courses avant l’arrivée", short: "Les produits demandés sont achetés puis rangés dans le bien avant l’installation des voyageurs.", image: "/images/public-site/concierge/mercato-orientale-premium.jpg", details: ["Liste de courses validée à l’avance", "Allergies et préférences recueillies", "Budget et substitutions autorisées précisés", "Achats réalisés dans les commerces adaptés", "Produits livrés puis rangés dans le bien", "Justificatifs et éventuels écarts transmis"], format: "Service à réserver", moment: "Avant l’arrivée", commercial: "Le budget des achats et les frais de service sont présentés séparément avant validation.", ownerValue: "Un accueil plus confortable, commercialisé sans être intégré au prix de la nuit." },
  { slug: "reservations-locales", number: "05", title: "Réservations locales", cardTitle: "Réservations locales", short: "Restaurants, activités et bonnes adresses sont proposés puis réservés selon les envies du voyageur.", image: "/images/public-site/concierge/bakery-family-premium.webp", details: ["Envie, quartier et budget précisés", "Sélection d’adresses cohérentes proposée", "Disponibilités réellement vérifiées", "Conditions d’annulation annoncées", "Réservation effectuée après accord", "Confirmation et informations pratiques centralisées"], format: "Assistance à la demande", moment: "Avant ou pendant le séjour", commercial: "Le voyageur choisit librement. Toute dépense ou condition d’annulation est annoncée avant réservation.", ownerValue: "Un service utile qui renforce l’accueil sans transformer votre bien en offre tout compris." },
  { slug: "excursion-sur-mesure", number: "06", title: "Excursion sur mesure", cardTitle: "Excursion sur mesure", short: "Transport, parcours et réservations sont réunis dans une journée organisée depuis Genova.", image: "/images/public-site/concierge/camogli-day-premium.jpg", details: ["Composition du groupe et rythme étudiés", "Destination et programme construits sur mesure", "Transport aller-retour recherché", "Activités et tables disponibles vérifiées", "Budget détaillé poste par poste", "Horaires, contacts et confirmations regroupés"], format: "Organisation à la carte", moment: "Avant le séjour", commercial: "Le programme et chaque coût sont détaillés puis confirmés par le voyageur avant organisation.", ownerValue: "Une offre additionnelle plus complète, gérée par AUREVIA de la demande au suivi." },
  { slug: "preparation-anniversaire", number: "07", title: "Préparation anniversaire", cardTitle: "Préparation anniversaire", short: "Décoration légère, gâteau, boissons ou petit cadeau sont installés avant l’arrivée, selon la demande.", image: "/images/public-site/concierge/boccadasse-aperitivo-premium.jpg", details: ["Ambiance et message personnalisés définis", "Nombre de personnes et allergies vérifiés", "Gâteau, boissons et attentions sélectionnés", "Budget d’achats validé avant commande", "Décoration légère installée dans le bien", "Mise en place terminée avant l’arrivée"], format: "Préparation à la carte", moment: "Avant l’arrivée", commercial: "La liste des achats, le budget et le coût de préparation sont confirmés avant intervention.", ownerValue: "Une attention mémorable, simple à commercialiser sans modifier durablement le bien." },
  { slug: "accueil-romantique", number: "08", title: "Accueil romantique", cardTitle: "Accueil romantique", short: "Fleurs, lumière douce, message et attention gourmande préparent une arrivée particulière.", image: "/images/public-site/concierge/owner-conversation-premium.webp", details: ["Intention et niveau de discrétion précisés", "Composition adaptée au budget", "Fleurs et produits choisis localement", "Message personnel préparé avec le voyageur", "Accès et horaire d’installation organisés", "Mise en scène retirée ou adaptée si nécessaire"], format: "Préparation à la carte", moment: "Avant l’arrivée", commercial: "Le contenu reste modulable et chaque achat est validé avant la mise en place.", ownerValue: "Une option émotionnelle accessible qui valorise l’accueil sans surcharger l’offre." },
  { slug: "kit-bebe", number: "09", title: "Kit bébé", cardTitle: "Kit bébé", short: "Lit parapluie, chaise haute et essentiels d’accueil sont réunis avant l’arrivée d’une famille.", image: "/images/public-site/concierge/family-apartment-premium.webp", details: ["Âge de l’enfant et besoins recueillis", "Lit, chaise et accessoires adaptés vérifiés", "Disponibilité et tarif du matériel confirmés", "Livraison organisée avant l’arrivée", "Équipements installés dans le bien", "Reprise et contrôle prévus après le séjour"], format: "Équipement à réserver", moment: "Avant l’arrivée", commercial: "Le matériel disponible, les conditions et le tarif sont confirmés avec les parents.", ownerValue: "Le bien devient plus facile à réserver pour les familles sans achat permanent du propriétaire." },
  { slug: "petit-dejeuner-arrivee", number: "10", title: "Petit-déjeuner d’arrivée", cardTitle: "Petit-déjeuner d’arrivée", short: "Une sélection simple de produits frais attend les voyageurs pour leur premier matin à Genova.", image: "/images/public-site/concierge/bakery-family-premium.webp", details: ["Nombre de personnes et formule choisis", "Allergies et habitudes alimentaires recueillies", "Produits frais sélectionnés dans le quartier", "Composition et budget validés à l’avance", "Livraison réalisée avant l’arrivée", "Produits rangés et présentés dans le bien"], format: "Service à réserver", moment: "Avant l’arrivée", commercial: "La composition, les éventuelles allergies et le budget sont validés à l’avance.", ownerValue: "Une première matinée plus agréable et une option facile à proposer lors de la réservation." },
  { slug: "bagagerie", number: "11", title: "Bagagerie", cardTitle: "Bagagerie", short: "Les voyageurs déposent leurs bagages avant l’arrivée ou après le départ, sur un créneau convenu.", image: "/images/public-site/concierge/welcome-family-premium.webp", details: ["Nombre et format des bagages confirmés", "Heure de dépôt ou de reprise convenue", "Point de remise clairement identifié", "Personne de contact communiquée", "Dépôt et restitution suivis", "Tarif éventuel et conditions annoncés"], format: "Assistance à la demande", moment: "Avant ou après le séjour", commercial: "Le lieu, les horaires et le tarif éventuel sont précisés avant confirmation.", ownerValue: "Les horaires du bien restent maîtrisés tout en apportant une solution pratique aux voyageurs." },
  { slug: "location-velo", number: "12", title: "Location de vélos", cardTitle: "Location de vélos", short: "Des vélos adaptés au parcours sont réservés auprès d’un partenaire et remis au créneau convenu.", image: "/images/public-site/concierge/nervi-family-premium.webp", details: ["Nombre, taille et type de vélos précisés", "Casques et accessoires nécessaires vérifiés", "Disponibilité et durée de location confirmées", "Retrait ou livraison organisé", "Prix, caution et responsabilité expliqués", "Horaire de retour ou de reprise coordonné"], format: "Service à réserver", moment: "Avant ou pendant le séjour", commercial: "Le nombre de vélos, la durée, les cautions et le prix sont confirmés avant réservation.", ownerValue: "Une activité autonome et accessible, proposée sans équipement à stocker dans le bien." },
];

export const experiences: Experience[] = experienceSource.map((experience) => ({
  ...experience,
  title: translateDeep(experience.title, "it"),
  cardTitle: experience.cardTitle ? translateDeep(experience.cardTitle, "it") : undefined,
  short: translateDeep(experience.short, "it"),
  details: translateDeep(experience.details, "it"),
  format: translateDeep(experience.format, "it"),
  moment: translateDeep(experience.moment, "it"),
  commercial: translateDeep(experience.commercial, "it"),
  ownerValue: translateDeep(experience.ownerValue, "it"),
}));

const testimonialSource = [
  { quote: "Un service clair, réactif et vraiment présent sur place.", place: "Genova" },
  { quote: "Nous avons enfin un interlocuteur unique pour le logement.", place: "Nervi" },
  { quote: "Les décisions importantes nous sont présentées sans bruit inutile.", place: "Castelletto" },
];

export const testimonials = testimonialSource.map((testimonial) => ({
  ...testimonial,
  quote: translateDeep(testimonial.quote, "it"),
}));

const faqSource = [
  ["Dans quelles zones intervenez-vous ?", "AUREVIA intervient à Genova et étudie les demandes dans les zones proches selon l’accès, le type de bien et le niveau de service attendu."],
  ["Puis-je continuer à utiliser personnellement mon bien ?", "Oui. Vos périodes d’occupation sont intégrées au calendrier et restent prioritaires selon le cadre convenu."],
  ["Le simulateur garantit-il les revenus indiqués ?", "Non. Il fournit une estimation indicative. Une visite et une analyse personnalisée restent indispensables."],
  ["Comment sont facturés le ménage et les interventions ?", "Les frais séparés et les éventuels seuils de validation sont présentés dans la proposition de gestion avant le démarrage."],
  ["Comment serai-je informé ?", "Le rythme du suivi est défini avec vous. L’objectif est de transmettre l’essentiel et de solliciter votre validation au bon moment."],
  ["Comment gérez-vous la maintenance ?", "AUREVIA qualifie la situation, recherche l’intervenant adapté, présente les éléments utiles et suit l’action sur place."],
  ["Les propriétés affichées sont-elles disponibles ?", "Les fiches présentes dans cette version sont des exemples de structure. Elles doivent être remplacées par des biens réels et autorisés avant publication."],
  ["Combien de temps faut-il pour démarrer ?", "Le délai dépend de l’état du bien, des accès, des supports à préparer et des services retenus. Il est précisé après la visite initiale."],
];

export const faqs = translateDeep(faqSource, "it");
