import { experiences } from "@/data/public-site/content";
import { translateDeep } from "@/lib/public-site/i18n";

export type ExperiencePossibility = {
  title: string;
  text: string;
};

export type ExperienceCategory = {
  slug: string;
  number: string;
  title: string;
  short: string;
  image: string;
  format: string;
  moment: string;
  commercial: string;
  ownerValue: string;
  budget: string;
  watermark: string;
  headline: string;
  accent: string;
  possibilities: ExperiencePossibility[];
};

type CategorySource = Omit<ExperienceCategory, "possibilities"> & {
  existing: string[];
  additional: ExperiencePossibility[];
};

const categorySource: CategorySource[] = [
  {
    slug: "transfert-prive",
    number: "01",
    title: "Déplacements pratiques",
    short: "Chauffeur privé, taxis, VTC, navettes et locations sont proposés selon le trajet, les bagages et vos préférences.",
    image: "/images/public-site/concierge/genova-blue-hour-premium.webp",
    format: "Mobilité pratique",
    moment: "Avant ou pendant le séjour",
    commercial: "Le prix total, le délai d’attente et les éventuels suppléments sont comparés avant la réservation. AUREVIA propose d’abord la solution la plus simple, pas la plus chère.",
    ownerValue: "Des déplacements facilités, du trajet ponctuel au chauffeur privé, selon les attentes de vos voyageurs.",
    budget: "Taxi, navette ou chauffeur privé : la solution est choisie selon le programme et le budget. Pour un chauffeur privé, le véhicule, la durée de mise à disposition et le tarif sont confirmés sur devis.",
    watermark: "SE DÉPLACER",
    headline: "Le bon trajet,",
    accent: "selon votre programme.",
    existing: [],
    additional: [
      { title: "Chauffeur privé", text: "Transferts ou mise à disposition à l’heure ou à la journée, avec véhicule et tarif confirmés sur devis, selon disponibilité." },
      { title: "Taxi ou VTC réservé", text: "Une course ponctuelle est comparée et réservée pour la gare, l’aéroport ou un retour tardif." },
      { title: "Navette aéroport partagée", text: "Une navette collective est recherchée lorsque son horaire et son prix sont plus adaptés qu’une course privée." },
      { title: "Pass transports publics", text: "Les titres utiles et l’itinéraire sont préparés pour circuler simplement dans Genova." },
      { title: "Location de vélos", text: "Des vélos adaptés au parcours sont réservés pour quelques heures ou pour la journée." },
      { title: "Location de scooter à la journée", text: "Permis, casques, assurance, caution et tarif complet sont vérifiés avant réservation." },
      { title: "Voiture pour une journée", text: "Une voiture n’est proposée que pour une sortie où elle reste plus pratique et économique que plusieurs trajets." },
    ],
  },
  {
    slug: "massage-domicile",
    number: "02",
    title: "Bien-être accessible",
    short: "Massages courts, cours collectifs, yoga, Pilates ou accès spa sont proposés dans des formats compatibles avec un budget de vacances.",
    image: "/images/public-site/concierge/home-preparation-premium.webp",
    format: "Pause bien-être",
    moment: "Avant ou pendant le séjour",
    commercial: "La durée, le prix par personne, le lieu et les éventuels frais de déplacement sont annoncés avant confirmation.",
    ownerValue: "Une pause agréable et facile à comprendre, sans transformer le logement en établissement de luxe.",
    budget: "AUREVIA privilégie les formats de 30 à 60 minutes, les cours collectifs et les accès à la demi-journée. Le privé n’est proposé que si le voyageur le demande et accepte clairement son prix.",
    watermark: "BIEN-ÊTRE",
    headline: "Une vraie pause,",
    accent: "dans un format raisonnable.",
    existing: [],
    additional: [
      { title: "Massage de 30, 45 ou 60 minutes", text: "Le voyageur choisit une durée claire, à domicile ou dans un institut proche, avec un prix confirmé." },
      { title: "Cours collectif de yoga ou Pilates", text: "Un cours accessible à proximité est recherché selon le niveau, l’horaire et le prix par personne." },
      { title: "Accès spa à la demi-journée", text: "L’accès, les équipements inclus et le tarif sont vérifiés sans imposer un soin supplémentaire." },
      { title: "Séance sportive en petit groupe", text: "Une activité encadrée et partagée permet de réduire le coût tout en gardant un vrai accompagnement." },
      { title: "Soin ou coiffure sur rendez-vous", text: "Un professionnel proche est réservé pour une prestation ponctuelle au tarif annoncé." },
      { title: "Sauna ou hammam à proximité", text: "Une entrée simple est privilégiée lorsqu’elle répond mieux au budget qu’un forfait complet." },
    ],
  },
  {
    slug: "guide-touristique",
    number: "03",
    title: "Sorties & découvertes locales",
    short: "Petits groupes, parcours autonomes, musées, trains régionaux et bateaux publics rendent Genova plus simple à découvrir.",
    image: "/images/public-site/concierge/rolli-walk-premium.jpg",
    format: "Découverte locale",
    moment: "Avant le séjour",
    commercial: "Billets, transport, durée et coût par personne sont réunis avant la réservation, avec une alternative autonome lorsque celle-ci suffit.",
    ownerValue: "De bonnes idées locales, accessibles sans journée privée ni programme surdimensionné.",
    budget: "La priorité va aux petits groupes, billets publics et trajets régionaux. Une visite privée n’est envisagée que si plusieurs voyageurs en partagent réellement le coût.",
    watermark: "DÉCOUVRIR",
    headline: "Découvrir davantage,",
    accent: "sans organiser une expédition.",
    existing: [],
    additional: [
      { title: "Visite guidée en petit groupe", text: "Une visite partagée est sélectionnée selon la langue, le quartier, la durée et le prix par personne." },
      { title: "Parcours autonome préparé", text: "Un itinéraire clair réunit les étapes, temps de marche, pauses et bonnes adresses sans coût de guide." },
      { title: "Musées et billets utiles", text: "Les billets et créneaux réellement nécessaires sont réservés sans ajouter de forfait superflu." },
      { title: "Escapade en train régional", text: "Horaires, billets et étapes sont préparés pour une journée simple vers la côte ligure." },
      { title: "Bateau public vers la côte", text: "Les liaisons régulières sont privilégiées à une sortie privée lorsque la saison le permet." },
      { title: "Randonnée ou balade accompagnée", text: "Un petit groupe ou une sortie locale est recherché selon le niveau et le budget." },
    ],
  },
  {
    slug: "reservations-locales",
    number: "04",
    title: "Repas & réservations",
    short: "Restaurants, chef privé au logement, aperitivi et courses sont organisés selon vos goûts, vos envies et votre budget.",
    image: "/images/public-site/concierge/mercato-orientale-premium.jpg",
    format: "Bien manger simplement",
    moment: "Avant ou pendant le séjour",
    commercial: "Le budget par personne, les éventuels achats et les frais de service sont séparés et annoncés avant validation.",
    ownerValue: "Des repas adaptés aux envies de vos voyageurs, de la bonne adresse locale au dîner préparé par un chef privé.",
    budget: "Le budget par personne guide la proposition. Pour un chef privé, le menu, le nombre de convives, les achats, le service et les besoins en cuisine sont précisés dans un devis avant confirmation.",
    watermark: "SAVEURS",
    headline: "Bien manger,",
    accent: "sans perdre du temps ni le budget.",
    existing: [],
    additional: [
      { title: "Chef privé", text: "Un chef au logement, avec menu sur mesure. Cuisine, contraintes alimentaires, disponibilité et tarif vérifiés avant réservation." },
      { title: "Restaurant réservé selon le budget", text: "Deux ou trois adresses cohérentes sont proposées avec une indication claire du prix moyen par personne." },
      { title: "Aperitivo local", text: "Une table ou une formule simple est réservée dans un quartier adapté au programme de la journée." },
      { title: "Courses avant l’arrivée", text: "Une liste courte d’essentiels est achetée dans la limite fixée puis rangée dans le bien." },
      { title: "Petit-déjeuner du premier matin", text: "Des produits frais et simples sont préparés pour éviter une course dès le réveil." },
      { title: "Repas local à emporter", text: "Une adresse fiable est sélectionnée pour manger au bien sans supporter le prix d’un service à domicile." },
      { title: "Panier pique-nique", text: "Une composition locale et transportable est préparée pour une sortie, avec budget validé." },
    ],
  },
  {
    slug: "preparation-anniversaire",
    number: "05",
    title: "Petites attentions & célébrations",
    short: "Un gâteau, des fleurs, un message ou un aperitivo suffisent souvent à créer une émotion sans transformer le séjour en événement de luxe.",
    image: "/images/public-site/concierge/boccadasse-aperitivo-premium.jpg",
    format: "Attention simple",
    moment: "Avant l’arrivée",
    commercial: "Un plafond d’achat est fixé avant la préparation. Produits, temps de mise en place et frais de service restent séparés.",
    ownerValue: "Une émotion supplémentaire grâce à quelques détails justes, sans décoration coûteuse ni mise en scène excessive.",
    budget: "La prestation part d’un budget maximum, puis AUREVIA compose avec des produits locaux et une installation légère. Rien n’est ajouté pour donner artificiellement une impression haut de gamme.",
    watermark: "ATTENTIONS",
    headline: "Une petite attention,",
    accent: "une vraie émotion à l’arrivée.",
    existing: [],
    additional: [
      { title: "Gâteau et bougies", text: "Un gâteau adapté au nombre de personnes est commandé avec allergies, message et budget confirmés." },
      { title: "Fleurs et message", text: "Un bouquet raisonnable et un mot personnel sont déposés avant l’arrivée." },
      { title: "Aperitivo en duo", text: "Une sélection locale simple est préparée pour deux personnes dans la limite convenue." },
      { title: "Petit cadeau local", text: "Une attention utile ou gourmande est choisie dans une enveloppe définie à l’avance." },
      { title: "Décoration légère", text: "Quelques éléments réutilisables ou faciles à retirer sont installés sans modifier le logement." },
      { title: "Photo souvenir de 30 minutes", text: "Un format court est recherché pour garder un souvenir sans réserver une séance complète." },
    ],
  },
  {
    slug: "kit-bebe",
    number: "06",
    title: "Famille & petits besoins",
    short: "Équipements temporaires, bagagerie et dépannages simples évitent des achats inutiles et libèrent du temps pendant le séjour.",
    image: "/images/public-site/concierge/family-apartment-premium.webp",
    format: "Confort utile",
    moment: "Avant l’arrivée",
    commercial: "Le coût de location, la caution éventuelle, la livraison et la reprise sont annoncés avant la réservation.",
    ownerValue: "Les voyageurs trouvent une solution à un besoin concret, sans achat permanent ni stockage pour le propriétaire.",
    budget: "AUREVIA privilégie la location pour les seuls jours utiles, la consigne existante ou le commerce de proximité. L’objectif est d’éviter un achat complet pour un besoin de quelques heures.",
    watermark: "CONFORT",
    headline: "Le petit besoin réglé,",
    accent: "sans achat inutile.",
    existing: [],
    additional: [
      { title: "Kit bébé pour le séjour", text: "Lit parapluie, chaise haute et accessoires essentiels sont loués uniquement pour la durée nécessaire." },
      { title: "Poussette ou siège auto", text: "Le modèle adapté à l’âge, la durée et la livraison est vérifié avec un tarif complet." },
      { title: "Consigne bagages", text: "Une solution proche est réservée avant l’arrivée ou après le départ, sans bloquer le logement." },
      { title: "Laverie ou linge d’appoint", text: "Une laverie, un repassage ponctuel ou du linge complémentaire est organisé selon le besoin." },
      { title: "Kit d’accueil pour animal", text: "Gamelles, couchage simple et protection sont préparés lorsque le logement accepte les animaux." },
      { title: "Dépannage voyage", text: "Adaptateur, chargeur, parapluie ou autre essentiel est recherché localement avec un budget maximum." },
    ],
  },
];

const existingBySlug = new Map(experiences.map((item) => [item.slug, item]));

export const experienceCategories: ExperienceCategory[] = categorySource.map(({ existing, additional, ...category }) => ({
  ...category,
  title: translateDeep(category.title, "it"),
  short: translateDeep(category.short, "it"),
  format: translateDeep(category.format, "it"),
  moment: translateDeep(category.moment, "it"),
  commercial: translateDeep(category.commercial, "it"),
  ownerValue: translateDeep(category.ownerValue, "it"),
  budget: translateDeep(category.budget, "it"),
  watermark: translateDeep(category.watermark, "it"),
  headline: translateDeep(category.headline, "it"),
  accent: translateDeep(category.accent, "it"),
  possibilities: [
    ...existing.map((slug) => {
      const item = existingBySlug.get(slug);
      if (!item) throw new Error(`Unknown experience slug: ${slug}`);
      return { title: item.title, text: item.short };
    }),
    ...translateDeep(additional, "it"),
  ],
}));

export const experienceCategoryAliases: Record<string, string> = {
  "location-velo": "transfert-prive",
  bagagerie: "kit-bebe",
  "excursion-sur-mesure": "guide-touristique",
  "courses-avant-arrivee": "reservations-locales",
  "petit-dejeuner-arrivee": "reservations-locales",
  "accueil-romantique": "preparation-anniversaire",
};
