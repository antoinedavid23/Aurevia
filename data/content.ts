export type Service={slug:string;title:string;short:string;number:string;image?:string};
export type Property={slug:string;name:string;location:string;bedrooms:number;guests:number;baths:number;tone:number;image:string};
export const services:Service[]=[
 {slug:"gestione-proprieta",title:"Gestione proprietà",short:"Un interlocuteur unique per coordinare ogni fase operativa.",number:"01"},
 {slug:"concierge",title:"Concierge",short:"Demandes sÃ©lectionnÃ©es et assistance sur mesure.",number:"02"},
 {slug:"accoglienza-voyageurs",title:"Accueil des voyageurs",short:"Une arrivÃ©e impeccable, personnalisÃ©e et discrÃ¨te.",number:"03"},
 {slug:"pulizie-biancheria",title:"MÃ©nage et linge",short:"Standards Ã©levÃ©s e controllo dopo ogni soggiorno.",number:"04"},
 {slug:"manutenzione",title:"Maintenance",short:"PrÃ©vention, interventions et rÃ©seau local fiable.",number:"05"},
 {slug:"revenue-management",title:"Revenue management",short:"StratÃ©gie tarifaire indicative et prÃ©sentation soignÃ©e.",number:"06"},
 {slug:"sicurezza",title:"SÃ©curitÃ©",short:"ContrÃ´les, inventaires et procÃ©dures claires.",number:"07"},
 {slug:"amministrazione",title:"Administration",short:"Rapports transparents et documentation structurÃ©e.",number:"08"}].map((service,i)=>({...service,image:["/images/services/property-management.webp","/images/services/concierge-service.webp","/images/services/guest-welcome.webp","/images/services/housekeeping.webp","/images/services/maintenance.webp","/images/services/revenue-management.webp","/images/services/security.webp","/images/services/administration.webp"][i]}));
export const properties:Property[]=[
 {slug:"villa-del-mare",name:"Villa del Mare",location:"Portofino",bedrooms:4,guests:8,baths:4,tone:1,image:"/images/home/hero-concierge.webp"},
 {slug:"attico-aurelia",name:"Penthouse Aurelia",location:"Genova",bedrooms:3,guests:6,baths:2,tone:2,image:"/images/home/luxury-bedroom.webp"},
 {slug:"villa-azzurra",name:"Villa Azzurra",location:"Santa Margherita Ligure",bedrooms:5,guests:10,baths:5,tone:3,image:"/images/owners/property-care.webp"},
 {slug:"casa-camogli",name:"Casa Camogli",location:"Camogli",bedrooms:2,guests:4,baths:2,tone:4,image:"/images/home/liguria-coast.webp"},
 {slug:"villa-paradiso",name:"Villa Paradiso",location:"Rapallo",bedrooms:4,guests:8,baths:3,tone:5,image:"/images/about/genova-architecture.webp"},
 {slug:"residenza-nervi",name:"Residenza Nervi",location:"Nervi",bedrooms:3,guests:6,baths:2,tone:6,image:"/images/about/interior-detail.webp"}];
export const experiences=[
 ["yacht-e-boat","Yacht e boat","La costa ligure vista dal mare, con itinerari su richiesta."],
 ["chef-privato","Chef privato","Una tavola intima, costruita sui sapori della Liguria."],
 ["transfer-privato","Transfer privato","Spostamenti coordinati con comfort e discrezione."],
 ["esperienze-locali","ExpÃ©riences locali","Luoghi, botteghe e incontri selezionati."],
 ["wellness","Wellness","Trattamenti e momenti di benessere nella proprietà."],
 ["eventi-privati","Eventi privati","Occasioni curate in ogni dettaglio."]].map(([slug,title,short],i)=>({slug,title,short,tone:i+1,image:["/images/experiences/yacht.webp","/images/experiences/private-chef.webp","/images/experiences/private-transfer.webp","/images/experiences/liguria-tour.webp","/images/experiences/wellness.webp","/images/experiences/private-event.webp"][i]}));
export const testimonials=[{quote:"Un servizio preciso, discreto e sempre presente.",place:"Portofino"},{quote:"La proprietà è gestita con una cura che non riuscivamo più a garantire personalmente.",place:"Genova"},{quote:"Abbiamo finalmente un unico interlocutore per tutto.",place:"Riviera Ligure"}];
export const faqs=[
 ["In quali zone operate?","Operiamo a Genova e nelle principali località della Riviera ligure, valutando ogni proprietà individualmente."],
 ["Il simulatore garantisce i ricavi indicati?","Non. Restituisce una stima puramente indicativa basata su coefficienti interni e richiede una valutazione personalizzata."],
 ["Posso utilizzare personalmente la mia proprietà?","Sì. La disponibilità viene concordata e integrata nella strategia di gestione."],
 ["Come vengono definite le tariffe?","Consideriamo località, caratteristiche, qualità, stagionalità e disponibilità, senza promettere rendimenti garantiti."],
 ["Come gestite la manutenzione?","Coordiniamo controlli e interventi con professionisti locali, previa definizione delle procedure con il proprietario."],
 ["Quali tipologie di proprietà gestite?","Appartamenti, attici, ville e case indipendenti coerenti con gli standard AUREVIA."],
 ["Come proteggete la privacy?","Trattiamo ogni richiesta in modo riservato e raccogliamo solo le informazioni necessarie."],
 ["Quanto dura l’attivazione?","Dipende dalla preparazione dell’immobile e dai servizi richiesti. La tempistica viene definita dopo il sopralluogo."]];
