import type { Locale } from "@/lib/i18n";
import { emptyAuditLocation, type AuditLocationSelection } from "@/lib/audit-location";
import { emptyChannelMix, type ChannelMix, type ChannelFeeMode } from "@/lib/audit-distribution";
import type { AuditObjective } from "@/lib/audit-objectives";

export type AuditAnswers = AuditLocationSelection & {
  portfolio: string; status: string; objective: AuditObjective[] | string; distribution: string;
  area: string; address: string; compliance: string; constraint: string; timing: string;
};
export type AuditFinance = {
  hasRentalHistory?: boolean;
  propertyCount: number;
  propertyType:string; bedrooms:number; guests:number; area:number; finish:string; days:number;
  currentNightly:number; occupancy:number; annualCosts:number; currentManagementRate:number;
  platformRate:number; sea:boolean; pool:boolean; terrace:boolean; parking:boolean;
  channelMix: ChannelMix;
  channelFeeMode?: ChannelFeeMode;
  averageChannelFee?: number | null;
  poolKind: "none" | "private" | "shared" | "jacuzzi";
};
export type AuditQuestion = {
  key: keyof AuditAnswers; kicker: string; title: string; hint: string;
  kind?: "text" | "textarea"; optional?: boolean; placeholder?: string; fieldLabel?: string;
  options?: { value: string; label: string; detail?: string }[];
};
type AuditCopy = {
  top:string; back:string; confidential:string; step:string; of:string; continue:string;
  skip:string; optional:string; chapters:string[]; chooseHint:string; chooseMultipleHint:string; unit:string[];
  contactKicker:string; contactTitle:string; contactText:string; first:string; last:string;
  email:string; phone:string; previewGross:string; previewGain:string; consent:string;
  privacy:string; submit:string; sending:string; error:string; introTime:string; questions:AuditQuestion[];
};
export const auditCopy: Record<Locale, AuditCopy> = {
  "it": {
    "top": "Audit gratuito",
    "back": "Indietro",
    "confidential": "Dati riservati",
    "step": "Passaggio",
    "of": "di",
    "continue": "Continua",
    "skip": "Salta",
    "optional": "Facoltativo",
    "chapters": [
      "Il progetto",
      "Il bene e i numeri",
      "La Sua diagnosi"
    ],
    "chooseHint": "Scelga una risposta, poi continui.",
    "chooseMultipleHint": "Può selezionare più risposte.",
    "unit": [
      "immobile",
      "immobili"
    ],
    "contactKicker": "La Sua diagnosi",
    "contactTitle": "Scopra il risultato completo",
    "contactText": "La diagnosi si apre nella pagina successiva, non via email. AUREVIA riceve il dossier completo per preparare il Suo appuntamento.",
    "first": "Nome",
    "last": "Cognome",
    "email": "Email",
    "phone": "Telefono",
    "previewGross": "Ricavi lordi annui stimati",
    "previewGain": "Netto proprietario",
    "consent": "Acconsento all’uso dei miei dati per ricevere la diagnosi ed essere ricontattato sul progetto.",
    "privacy": "Informativa privacy",
    "submit": "Visualizza il mio audit",
    "sending": "Invio in corso…",
    "error": "Invio non riuscito. Riprovi.",
    "introTime": "3–4 minuti",
    "questions": [
      {
        "key": "portfolio",
        "kicker": "Portafoglio",
        "title": "Quanti immobili?",
        "hint": "Indichi quanti desidera affidare ad AUREVIA.",
        "options": [
          {
            "value": "1",
            "label": "1 immobile"
          },
          {
            "value": "2-4",
            "label": "2–4 immobili"
          },
          {
            "value": "5-15",
            "label": "5–15 immobili"
          },
          {
            "value": "16+",
            "label": "16 o più"
          }
        ]
      },
      {
        "key": "status",
        "kicker": "Situazione",
        "title": "Come viene usato oggi?",
        "hint": "Per più immobili, scelga la situazione prevalente.",
        "options": [
          {
            "value": "active",
            "label": "Affitti brevi",
            "detail": "Lo gestisco personalmente"
          },
          {
            "value": "managed",
            "label": "Già con un gestore",
            "detail": "Voglio confrontare i risultati"
          },
          {
            "value": "launch",
            "label": "Da avviare",
            "detail": "Non è ancora in affitto"
          },
          {
            "value": "secondary",
            "label": "Seconda casa",
            "detail": "Lo uso anche personalmente"
          }
        ]
      },
      {
        "key": "objective",
        "kicker": "Priorità",
        "title": "Le Sue priorità?",
        "hint": "Selezioni ciò che conta per Lei. Sono possibili più risposte.",
        "options": [
          {
            "value": "revenue",
            "label": "Più ricavi"
          },
          {
            "value": "time",
            "label": "Più tempo libero"
          },
          {
            "value": "care",
            "label": "Cura dell’immobile"
          },
          {
            "value": "scale",
            "label": "Gestire più immobili"
          }
        ]
      },
      {
        "key": "distribution",
        "kicker": "Prenotazioni",
        "title": "Da dove arrivano gli ospiti?",
        "hint": "Indichi tutti i canali utilizzati, poi precisi ricavi e costi.",
        "options": [
          {
            "value": "airbnb",
            "label": "Solo Airbnb"
          },
          {
            "value": "booking",
            "label": "Solo Booking.com"
          },
          {
            "value": "multi",
            "label": "Più piattaforme"
          },
          {
            "value": "direct",
            "label": "Diretto e piattaforme"
          },
          {
            "value": "direct-only",
            "label": "Solo prenotazioni dirette"
          },
          {
            "value": "none",
            "label": "Non ancora pubblicato"
          }
        ]
      },
      {
        "key": "area",
        "kicker": "Località",
        "title": "Dove si trova?",
        "hint": "Per un portafoglio, indichi la zona principale.",
        "options": [
          {
            "value": "genova",
            "label": "Genova"
          },
          {
            "value": "levante",
            "label": "Riviera di Levante"
          },
          {
            "value": "ponente",
            "label": "Riviera di Ponente"
          },
          {
            "value": "other",
            "label": "Altra località"
          }
        ]
      },
      {
        "key": "address",
        "kind": "text",
        "kicker": "Indirizzo",
        "title": "Quale quartiere?",
        "hint": "Il quartiere è sufficiente. L’indirizzo è facoltativo.",
        "placeholder": "Es. Albaro, Boccadasse…",
        "fieldLabel": "Quartiere o indirizzo"
      },
      {
        "key": "compliance",
        "kicker": "Documenti",
        "title": "Gli adempimenti sono pronti?",
        "hint": "Registrazioni e documenti per l’affitto breve.",
        "options": [
          {
            "value": "ready",
            "label": "Sì, tutto pronto"
          },
          {
            "value": "partial",
            "label": "In corso"
          },
          {
            "value": "unknown",
            "label": "Da verificare"
          },
          {
            "value": "na",
            "label": "Progetto da avviare"
          }
        ]
      },
      {
        "key": "constraint",
        "kind": "textarea",
        "optional": true,
        "kicker": "Le Sue esigenze",
        "title": "Una richiesta particolare?",
        "hint": "Uso personale, manutenzione, disponibilità: cosa dobbiamo sapere?",
        "placeholder": "Scriva qui ciò che conta per Lei…",
        "fieldLabel": "La Sua richiesta"
      },
      {
        "key": "timing",
        "kicker": "Tempistiche",
        "title": "Quando desidera iniziare?",
        "hint": "Anche una prima indicazione va bene.",
        "options": [
          {
            "value": "now",
            "label": "Entro un mese"
          },
          {
            "value": "quarter",
            "label": "Entro 3 mesi"
          },
          {
            "value": "semester",
            "label": "Tra 3 e 6 mesi"
          },
          {
            "value": "explore",
            "label": "Sto valutando"
          }
        ]
      }
    ]
  },
  "fr": {
    "top": "Audit gratuit",
    "back": "Retour",
    "confidential": "Données confidentielles",
    "step": "Étape",
    "of": "sur",
    "continue": "Continuer",
    "skip": "Passer",
    "optional": "Facultatif",
    "chapters": [
      "Le projet",
      "Le bien et les chiffres",
      "Votre diagnostic"
    ],
    "chooseHint": "Sélectionnez une réponse, puis continuez.",
    "chooseMultipleHint": "Plusieurs réponses possibles.",
    "unit": [
      "bien",
      "biens"
    ],
    "contactKicker": "Votre diagnostic",
    "contactTitle": "Découvrez le résultat complet",
    "contactText": "Votre audit s’ouvre sur la page suivante, sans envoi par e-mail. AUREVIA reçoit le dossier complet pour préparer votre rendez-vous.",
    "first": "Prénom",
    "last": "Nom",
    "email": "Email",
    "phone": "Téléphone",
    "previewGross": "Revenus bruts annuels estimés",
    "previewGain": "Net propriétaire",
    "consent": "J’accepte l’utilisation de mes données pour recevoir le diagnostic et être recontacté au sujet du projet.",
    "privacy": "Politique de confidentialité",
    "submit": "Afficher mon audit",
    "sending": "Envoi en cours…",
    "error": "L’envoi a échoué. Réessayez.",
    "introTime": "3–4 minutes",
    "questions": [
      {
        "key": "portfolio",
        "kicker": "Portefeuille",
        "title": "Combien de biens ?",
        "hint": "Indiquez combien vous souhaitez confier à AUREVIA.",
        "options": [
          {
            "value": "1",
            "label": "1 bien"
          },
          {
            "value": "2-4",
            "label": "2–4 biens"
          },
          {
            "value": "5-15",
            "label": "5–15 biens"
          },
          {
            "value": "16+",
            "label": "16 ou plus"
          }
        ]
      },
      {
        "key": "status",
        "kicker": "Situation",
        "title": "Quel usage aujourd’hui ?",
        "hint": "Pour plusieurs biens, choisissez la situation principale.",
        "options": [
          {
            "value": "active",
            "label": "Location courte durée",
            "detail": "Je gère moi-même"
          },
          {
            "value": "managed",
            "label": "Déjà avec un gestionnaire",
            "detail": "Je souhaite comparer"
          },
          {
            "value": "launch",
            "label": "À mettre en location",
            "detail": "Le bien n’est pas encore loué"
          },
          {
            "value": "secondary",
            "label": "Résidence secondaire",
            "detail": "Je l’utilise aussi personnellement"
          }
        ]
      },
      {
        "key": "objective",
        "kicker": "Priorités",
        "title": "Vos priorités ?",
        "hint": "Choisissez ce qui compte pour vous. Plusieurs réponses possibles.",
        "options": [
          {
            "value": "revenue",
            "label": "Plus de revenus"
          },
          {
            "value": "time",
            "label": "Plus de temps libre"
          },
          {
            "value": "care",
            "label": "Prendre soin du bien"
          },
          {
            "value": "scale",
            "label": "Gérer plusieurs biens"
          }
        ]
      },
      {
        "key": "distribution",
        "kicker": "Réservations",
        "title": "D’où viennent vos voyageurs ?",
        "hint": "Indiquez tous vos canaux, puis précisez les revenus et les frais.",
        "options": [
          {
            "value": "airbnb",
            "label": "Airbnb uniquement"
          },
          {
            "value": "booking",
            "label": "Booking.com uniquement"
          },
          {
            "value": "multi",
            "label": "Plusieurs plateformes"
          },
          {
            "value": "direct",
            "label": "Direct et plateformes"
          },
          {
            "value": "direct-only",
            "label": "Direct uniquement"
          },
          {
            "value": "none",
            "label": "Pas encore d’annonce"
          }
        ]
      },
      {
        "key": "area",
        "kicker": "Localisation",
        "title": "Où se situe le bien ?",
        "hint": "Pour un portefeuille, indiquez la zone principale.",
        "options": [
          {
            "value": "genova",
            "label": "Gênes"
          },
          {
            "value": "levante",
            "label": "Riviera du Levant"
          },
          {
            "value": "ponente",
            "label": "Riviera du Ponant"
          },
          {
            "value": "other",
            "label": "Autre localité"
          }
        ]
      },
      {
        "key": "address",
        "kind": "text",
        "kicker": "Adresse",
        "title": "Dans quel quartier ?",
        "hint": "Le quartier suffit. L’adresse précise est facultative.",
        "placeholder": "Ex. Albaro, Boccadasse…",
        "fieldLabel": "Quartier ou adresse"
      },
      {
        "key": "compliance",
        "kicker": "Documents",
        "title": "Les formalités sont-elles prêtes ?",
        "hint": "Enregistrements et documents pour la location courte durée.",
        "options": [
          {
            "value": "ready",
            "label": "Oui, tout est prêt"
          },
          {
            "value": "partial",
            "label": "En cours"
          },
          {
            "value": "unknown",
            "label": "À vérifier"
          },
          {
            "value": "na",
            "label": "Le projet n’a pas démarré"
          }
        ]
      },
      {
        "key": "constraint",
        "kind": "textarea",
        "optional": true,
        "kicker": "Vos attentes",
        "title": "Une demande particulière ?",
        "hint": "Usage personnel, entretien, disponibilités : que devons-nous savoir ?",
        "placeholder": "Précisez ce qui compte pour vous…",
        "fieldLabel": "Votre demande"
      },
      {
        "key": "timing",
        "kicker": "Calendrier",
        "title": "Quand démarrer ?",
        "hint": "Une première indication suffit.",
        "options": [
          {
            "value": "now",
            "label": "Sous un mois"
          },
          {
            "value": "quarter",
            "label": "D’ici 3 mois"
          },
          {
            "value": "semester",
            "label": "Dans 3 à 6 mois"
          },
          {
            "value": "explore",
            "label": "Je me renseigne"
          }
        ]
      }
    ]
  },
  "en": {
    "top": "Free property audit",
    "back": "Back",
    "confidential": "Confidential data",
    "step": "Step",
    "of": "of",
    "continue": "Continue",
    "skip": "Skip",
    "optional": "Optional",
    "chapters": [
      "The project",
      "Property and figures",
      "Your assessment"
    ],
    "chooseHint": "Select an answer, then continue.",
    "chooseMultipleHint": "You can select multiple answers.",
    "unit": [
      "property",
      "properties"
    ],
    "contactKicker": "Your assessment",
    "contactTitle": "Discover the full result",
    "contactText": "Your assessment opens on the next page, not by email. AUREVIA receives the complete dossier to prepare your appointment.",
    "first": "First name",
    "last": "Last name",
    "email": "Email",
    "phone": "Phone",
    "previewGross": "Estimated annual gross revenue",
    "previewGain": "Owner net income",
    "consent": "I agree to the use of my data to receive the assessment and be contacted about this project.",
    "privacy": "Privacy policy",
    "submit": "View my audit",
    "sending": "Sending…",
    "error": "Sending failed. Please try again.",
    "introTime": "3–4 minutes",
    "questions": [
      {
        "key": "portfolio",
        "kicker": "Portfolio",
        "title": "How many properties?",
        "hint": "How many would you like AUREVIA to manage?",
        "options": [
          {
            "value": "1",
            "label": "1 property"
          },
          {
            "value": "2-4",
            "label": "2–4 properties"
          },
          {
            "value": "5-15",
            "label": "5–15 properties"
          },
          {
            "value": "16+",
            "label": "16 or more"
          }
        ]
      },
      {
        "key": "status",
        "kicker": "Current use",
        "title": "How is it used today?",
        "hint": "For several properties, choose the main situation.",
        "options": [
          {
            "value": "active",
            "label": "Short-term rental",
            "detail": "I manage it myself"
          },
          {
            "value": "managed",
            "label": "With a property manager",
            "detail": "I would like to compare"
          },
          {
            "value": "launch",
            "label": "Ready to rent out",
            "detail": "Not yet rented"
          },
          {
            "value": "secondary",
            "label": "Second home",
            "detail": "I also use it myself"
          }
        ]
      },
      {
        "key": "objective",
        "kicker": "Priorities",
        "title": "Your priorities?",
        "hint": "Choose what matters to you. You can select multiple answers.",
        "options": [
          {
            "value": "revenue",
            "label": "More income"
          },
          {
            "value": "time",
            "label": "More free time"
          },
          {
            "value": "care",
            "label": "Property care"
          },
          {
            "value": "scale",
            "label": "Managing several properties"
          }
        ]
      },
      {
        "key": "distribution",
        "kicker": "Bookings",
        "title": "Where do guests find you?",
        "hint": "Select all channels you use, then specify revenue and costs.",
        "options": [
          {
            "value": "airbnb",
            "label": "Airbnb only"
          },
          {
            "value": "booking",
            "label": "Booking.com only"
          },
          {
            "value": "multi",
            "label": "Several platforms"
          },
          {
            "value": "direct",
            "label": "Direct and platforms"
          },
          {
            "value": "direct-only",
            "label": "Direct bookings only"
          },
          {
            "value": "none",
            "label": "Not listed yet"
          }
        ]
      },
      {
        "key": "area",
        "kicker": "Location",
        "title": "Where is the property?",
        "hint": "For a portfolio, choose the main area.",
        "options": [
          {
            "value": "genova",
            "label": "Genoa"
          },
          {
            "value": "levante",
            "label": "Eastern Riviera"
          },
          {
            "value": "ponente",
            "label": "Western Riviera"
          },
          {
            "value": "other",
            "label": "Another location"
          }
        ]
      },
      {
        "key": "address",
        "kind": "text",
        "kicker": "Address",
        "title": "Which neighbourhood?",
        "hint": "The neighbourhood is enough. The exact address is optional.",
        "placeholder": "E.g. Albaro, Boccadasse…",
        "fieldLabel": "Neighbourhood or address"
      },
      {
        "key": "compliance",
        "kicker": "Documents",
        "title": "Is the paperwork ready?",
        "hint": "Registrations and documents for short-term rental.",
        "options": [
          {
            "value": "ready",
            "label": "Yes, all ready"
          },
          {
            "value": "partial",
            "label": "In progress"
          },
          {
            "value": "unknown",
            "label": "Needs checking"
          },
          {
            "value": "na",
            "label": "Not launched yet"
          }
        ]
      },
      {
        "key": "constraint",
        "kind": "textarea",
        "optional": true,
        "kicker": "Your preferences",
        "title": "Any particular requirements?",
        "hint": "Personal use, maintenance, availability: what should we know?",
        "placeholder": "Tell us what matters to you…",
        "fieldLabel": "Your requirements"
      },
      {
        "key": "timing",
        "kicker": "Timing",
        "title": "When would you like to start?",
        "hint": "An approximate date is fine.",
        "options": [
          {
            "value": "now",
            "label": "Within a month"
          },
          {
            "value": "quarter",
            "label": "Within 3 months"
          },
          {
            "value": "semester",
            "label": "In 3–6 months"
          },
          {
            "value": "explore",
            "label": "Just exploring"
          }
        ]
      }
    ]
  }
};
export const financeCopy = {
  "it": {
    "propertyKicker": "Il bene",
    "propertyTitle": "La Sua proprietà",
    "propertyText": "Per più immobili, descriva un bene rappresentativo.",
    "type": "Tipologia",
    "bedrooms": "Camere",
    "guests": "Ospiti",
    "area": "Superficie",
    "finish": "Finiture",
    "days": "Notti disponibili all’anno",
    "amenities": "Dotazioni",
    "sea": "Vista mare",
    "pool": "Piscina / jacuzzi",
    "terrace": "Terrazza",
    "parking": "Parcheggio",
    "financialKicker": "I numeri",
    "financialTitle": "Tariffe e costi",
    "financialText": "Indichi i dati effettivi di un immobile.",
    "historyTitle": "Storico degli affitti",
    "hasHistory": "Ho già dei dati",
    "noHistory": "Non ancora affittato",
    "launchFinancialTitle": "Costi dell’immobile",
    "noHistoryHint": "Indichi i costi annui. L’audit stimerà il potenziale senza inventare ricavi passati.",
    "missingHistoryFees": "Costi di prenotazione non indicati: il netto attuale resterà da precisare.",
    "nightly": "Tariffa media per notte",
    "occupancy": "Occupazione",
    "costs": "Costi operativi annui",
    "management": "Gestione attuale",
    "managementHint": "0% se non sostiene costi di gestione. Escluda le commissioni dei portali.",
    "platform": "Portali",
    "grossPreview": "Ricavi lordi attuali stimati",
    "calculate": "Continua",
    "loadingTitle": "La Sua diagnosi prende forma",
    "loading": [
      "Riepilogo dei dati…",
      "Proiezione dei ricavi…",
      "Calcolo di costi e netto…",
      "Preparazione della diagnosi…"
    ],
    "types": [
      "Appartamento",
      "Attico",
      "Villa",
      "Casa indipendente"
    ],
    "finishes": [
      "Essenziali",
      "Curate",
      "Premium",
      "Lusso"
    ]
  },
  "fr": {
    "propertyKicker": "Le bien",
    "propertyTitle": "Votre propriété",
    "propertyText": "Pour plusieurs biens, décrivez un logement représentatif.",
    "type": "Type de bien",
    "bedrooms": "Chambres",
    "guests": "Voyageurs",
    "area": "Surface",
    "finish": "Finitions",
    "days": "Nuits disponibles par an",
    "amenities": "Équipements",
    "sea": "Vue mer",
    "pool": "Piscine / jacuzzi",
    "terrace": "Terrasse",
    "parking": "Parking",
    "financialKicker": "Les chiffres",
    "financialTitle": "Tarifs et charges",
    "financialText": "Renseignez les chiffres réellement constatés pour un logement.",
    "historyTitle": "Historique de location",
    "hasHistory": "J’ai déjà des chiffres",
    "noHistory": "Pas encore de location",
    "launchFinancialTitle": "Charges du bien",
    "noHistoryHint": "Renseignez les charges annuelles. L’audit estimera le potentiel sans inventer de revenus passés.",
    "missingHistoryFees": "Frais de réservation non renseignés : le net actuel restera à préciser.",
    "nightly": "Tarif moyen par nuit",
    "occupancy": "Occupation",
    "costs": "Charges annuelles",
    "management": "Gestion actuelle",
    "managementHint": "0 % si vous n’avez aucun frais de gestion. Hors commissions des plateformes.",
    "platform": "Plateformes",
    "grossPreview": "Revenus bruts actuels estimés",
    "calculate": "Continuer",
    "loadingTitle": "Votre diagnostic prend forme",
    "loading": [
      "Récapitulatif du bien…",
      "Projection des revenus…",
      "Calcul des charges et du net…",
      "Préparation du diagnostic…"
    ],
    "types": [
      "Appartement",
      "Attique",
      "Villa",
      "Maison indépendante"
    ],
    "finishes": [
      "Essentielles",
      "Soignées",
      "Premium",
      "Luxe"
    ]
  },
  "en": {
    "propertyKicker": "The property",
    "propertyTitle": "Your property",
    "propertyText": "For several properties, describe a representative home.",
    "type": "Property type",
    "bedrooms": "Bedrooms",
    "guests": "Guests",
    "area": "Floor area",
    "finish": "Finish",
    "days": "Available nights per year",
    "amenities": "Amenities",
    "sea": "Sea view",
    "pool": "Pool / jacuzzi",
    "terrace": "Terrace",
    "parking": "Parking",
    "financialKicker": "The figures",
    "financialTitle": "Rates and costs",
    "financialText": "Enter actual figures for one property.",
    "historyTitle": "Rental history",
    "hasHistory": "I have rental figures",
    "noHistory": "Not rented yet",
    "launchFinancialTitle": "Property costs",
    "noHistoryHint": "Enter annual costs. The audit will estimate potential without inventing past revenue.",
    "missingHistoryFees": "Booking costs not provided: current net income remains to be confirmed.",
    "nightly": "Average nightly rate",
    "occupancy": "Occupancy",
    "costs": "Annual operating costs",
    "management": "Current management fee",
    "managementHint": "Enter 0% if you pay no management fee. Exclude platform commissions.",
    "platform": "Platforms",
    "grossPreview": "Estimated current gross revenue",
    "calculate": "Continue",
    "loadingTitle": "Preparing your assessment",
    "loading": [
      "Reviewing your inputs…",
      "Projecting revenue…",
      "Calculating costs and net income…",
      "Preparing your assessment…"
    ],
    "types": [
      "Apartment",
      "Penthouse",
      "Villa",
      "Detached house"
    ],
    "finishes": [
      "Essential",
      "Well appointed",
      "Premium",
      "Luxury"
    ]
  }
};
export const initialAnswers: AuditAnswers = {
  ...emptyAuditLocation, portfolio:"", status:"", objective:[], distribution:"", address:"", compliance:"", constraint:"", timing:""
};
export const initialFinance: AuditFinance = {
  propertyCount: 1,
  propertyType:"Appartement",bedrooms:2,guests:4,area:85,finish:"Premium",days:365,
  currentNightly:NaN,occupancy:NaN,annualCosts:NaN,currentManagementRate:0,platformRate:8,
  sea:false,pool:false,terrace:true,parking:false,poolKind:"none",channelMix:emptyChannelMix()
};
