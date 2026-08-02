export type Service={slug:string;title:string;cardTitle?:string;short:string;number:string;image?:string};
export type Property={slug:string;name:string;location:string;bedrooms:number;guests:number;baths:number;tone:number;image:string};

export const services:Service[]=[
 {slug:"gestione-proprieta",title:"Gestion de propriété",cardTitle:"Gestion intégrale du bien",short:"Un pilotage unique pour préserver le bien et simplifier chaque décision.",number:"01"},
 {slug:"concierge",title:"Assistance sur mesure",cardTitle:"Conciergerie personnalisée",short:"Chaque demande privée est organisée avec précision, discrétion et réactivité.",number:"02"},
 {slug:"accoglienza-voyageurs",title:"Accueil des voyageurs",cardTitle:"Accueil des voyageurs",short:"Un parcours d’arrivée fluide, soigné et conforme à vos standards.",number:"03"},
 {slug:"pulizie-biancheria",title:"Ménage et linge",cardTitle:"Entretien & linge",short:"Une préparation contrôlée avant chaque séjour, jusque dans les moindres détails.",number:"04"},
 {slug:"manutenzione",title:"Maintenance",cardTitle:"Maintenance coordonnée",short:"Prévention, interventions et suivi assurés par un réseau local sélectionné.",number:"05"},
 {slug:"revenue-management",title:"Optimisation des revenus",cardTitle:"Performance locative",short:"Tarifs et calendrier pilotés pour valoriser durablement vos revenus.",number:"06"},
 {slug:"sicurezza",title:"Sécurité du bien",cardTitle:"Sécurité du bien",short:"Contrôle des accès, vérification des fermetures et procédures claires pour protéger votre propriété.",number:"07"},
 {slug:"amministrazione",title:"Administration",cardTitle:"Suivi administratif",short:"Des comptes rendus structurés pour suivre clairement chaque opération.",number:"08"},
].map((service,i)=>({...service,image:["/images/services/property-management.webp","/images/services/concierge-service.webp","/images/services/guest-welcome.webp","/images/services/housekeeping.webp","/images/services/maintenance.webp","/images/services/revenue-management.webp","/images/services/security.webp","/images/services/administration.webp"][i]}));

export const properties:Property[]=[
 {slug:"villa-del-mare",name:"Villa del Mare",location:"Portofino",bedrooms:4,guests:8,baths:4,tone:1,image:"/images/home/hero-concierge.webp"},
 {slug:"attico-aurelia",name:"Attique Aurelia",location:"Gênes",bedrooms:3,guests:6,baths:2,tone:2,image:"/images/home/luxury-bedroom.webp"},
 {slug:"villa-azzurra",name:"Villa Azzurra",location:"Santa Margherita Ligure",bedrooms:5,guests:10,baths:5,tone:3,image:"/images/owners/property-care.webp"},
 {slug:"casa-camogli",name:"Casa Camogli",location:"Camogli",bedrooms:2,guests:4,baths:2,tone:4,image:"/images/home/liguria-coast.webp"},
 {slug:"villa-paradiso",name:"Villa Paradiso",location:"Rapallo",bedrooms:4,guests:8,baths:3,tone:5,image:"/images/about/genova-architecture.webp"},
 {slug:"residenza-nervi",name:"Résidence Nervi",location:"Nervi",bedrooms:3,guests:6,baths:2,tone:6,image:"/images/about/interior-detail.webp"},
];

export const experiences=[
 ["yacht-e-boat","Yacht privé","La côte ligure vue depuis la mer, avec des itinéraires conçus sur demande."],
 ["jet-prive","Jet privé","Vols privés, coordination des créneaux, transferts aéroport et assistance bagages selon votre itinéraire."],
 ["chef-privato","Chef privé","Une table intime inspirée par les saveurs de la Ligurie."],
 ["transfer-privato","Transfert privé","Des déplacements coordonnés avec confort et discrétion."],
 ["esperienze-locali","Expériences locales","Des lieux, maisons et rencontres soigneusement sélectionnés."],
 ["wellness","Bien-être","Des soins et moments de détente directement dans la propriété."],
 ["eventi-privati","Événements privés","Des occasions orchestrées avec attention jusque dans les détails."],
 ["securite-privee","Protection rapprochée","Une présence discrète et coordonnée pour protéger vos déplacements, vos événements et votre tranquillité."],
].map(([slug,title,short],i)=>({slug,title,short,tone:i+1,image:["/images/experiences/yacht.webp","/images/experiences/private-jet.webp","/images/experiences/private-chef.webp","/images/experiences/private-transfer.webp","/images/experiences/liguria-tour.webp","/images/experiences/wellness.webp","/images/experiences/private-event.webp","/images/experiences/private-security.webp"][i],details:{
 "yacht-e-boat":["Itinéraire personnalisé","Skipper et équipage","Restauration sur demande"],
 "jet-prive":["Recherche d’appareil","Coordination aéroport","Transfert porte-à-porte"],
 "chef-privato":["Menu personnalisé","Approvisionnement local","Service à domicile"],
 "transfer-privato":["Chauffeur dédié","Suivi des horaires","Accueil personnalisé"],
 "esperienze-locali":["Sélection locale","Programme privé","Réservations coordonnées"],
 "wellness":["Praticien sélectionné","Installation à domicile","Planning sur mesure"],
 "eventi-privati":["Conception de l’événement","Prestataires coordonnés","Suivi opérationnel"],
 "securite-privee":["Agents sélectionnés","Protection discrète","Coordination sur mesure"],
 }[slug]||[]}));

export const testimonials=[
 {quote:"Un service précis, discret et toujours présent.",place:"Portofino"},
 {quote:"Notre propriété est entretenue avec une attention que nous ne pouvions plus assurer seuls.",place:"Gênes"},
 {quote:"Nous avons enfin un interlocuteur unique pour tout coordonner.",place:"Riviera ligure"},
];

export const faqs=[
 ["Dans quelles zones intervenez-vous ?","Nous intervenons à Gênes et dans les principales localités de la Riviera ligure, après étude de chaque propriété."],
 ["Le simulateur garantit-il les revenus indiqués ?","Non. Il fournit une estimation indicative fondée sur des coefficients internes. Une évaluation personnalisée reste nécessaire."],
 ["Puis-je continuer à utiliser personnellement mon bien ?","Oui. Vos périodes d’occupation sont intégrées à la stratégie de gestion."],
 ["Comment les tarifs sont-ils définis ?","Nous tenons compte de la localisation, du niveau de finition, des équipements, de la saisonnalité et des périodes disponibles."],
 ["Comment gérez-vous la maintenance ?","Nous coordonnons les contrôles et interventions avec des professionnels locaux selon les procédures convenues avec le propriétaire."],
 ["Quels types de propriétés gérez-vous ?","Des appartements, attiques, villas et maisons indépendantes correspondant aux standards AUREVIA."],
 ["Comment protégez-vous la confidentialité ?","Chaque demande est traitée de manière confidentielle et seules les informations nécessaires sont recueillies."],
 ["Combien de temps faut-il pour démarrer ?","Le délai dépend de la préparation du bien et des services retenus. Il est précisé après la visite initiale."],
];
