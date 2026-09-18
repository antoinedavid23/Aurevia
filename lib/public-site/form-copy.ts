import type { Locale } from "@/lib/public-site/i18n";

export const formContactCopy: Record<Locale, {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  optional: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  duration: string;
  step: string;
  of: string;
  contactLegend: string;
  delegationLegend: string;
  steps: [string, string, string];
}> = {
  it: {
    firstName: "Nome",
    lastName: "Cognome",
    email: "E-mail",
    phone: "Telefono",
    optional: "facoltativo",
    firstNamePlaceholder: "Il Suo nome",
    lastNamePlaceholder: "Il Suo cognome",
    emailPlaceholder: "nome@esempio.it",
    phonePlaceholder: "+39 320 000 0000",
    duration: "Circa 3 minuti",
    step: "Fase",
    of: "di",
    contactLegend: "Come possiamo contattarLa?",
    delegationLegend: "Cosa desidera affidarci?",
    steps: ["Lei", "L’immobile", "La Sua esigenza"],
  },
  en: {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    optional: "optional",
    firstNamePlaceholder: "Your first name",
    lastNamePlaceholder: "Your last name",
    emailPlaceholder: "name@example.com",
    phonePlaceholder: "+39 320 000 0000",
    duration: "About 3 minutes",
    step: "Step",
    of: "of",
    contactLegend: "How can we contact you?",
    delegationLegend: "What would you like us to manage?",
    steps: ["You", "The property", "Your needs"],
  },
  fr: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    optional: "facultatif",
    firstNamePlaceholder: "Votre prénom",
    lastNamePlaceholder: "Votre nom",
    emailPlaceholder: "nom@exemple.fr",
    phonePlaceholder: "+39 320 000 0000",
    duration: "Environ 3 minutes",
    step: "Étape",
    of: "sur",
    contactLegend: "Comment vous joindre ?",
    delegationLegend: "Que souhaitez-vous nous confier ?",
    steps: ["Vous", "Le bien", "Votre besoin"],
  },
};
