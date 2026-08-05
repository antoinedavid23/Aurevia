import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StrategyEconomics } from "@/components/StrategyEconomics";
import { getAdminUser } from "@/lib/admin";
import styles from "./strategia.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Strategia premium Genova",
  description: "Strumento decisionale privato per la crescita di AUREVIA a Genova.",
  robots: { index: false, follow: false, nocache: true },
  openGraph: {
    title: "AUREVIA · Strategia privata Genova",
    description: "Custodia patrimoniale. Controllo. Performance.",
    type: "website",
    locale: "it_IT",
    images: [{ url: "/strategia-og.png", width: 1745, height: 909, alt: "AUREVIA — Strategia privata Genova" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUREVIA · Strategia privata Genova",
    description: "Custodia patrimoniale. Controllo. Performance.",
    images: ["/strategia-og.png"],
  },
};

type Ad = {
  title: string;
  hook: string;
  angle: string;
  promise: string;
  body: string;
  cta: string;
  creative: string;
  audience: string;
  format: string;
};

const competitors = [
  {name:"Wonderful Italy",url:"https://wonderfulitaly.eu/it/gestione-affitti",promise:"Gestione integrale sostenuta da scala, distribuzione e hub locali.",client:"Proprietari che privilegiano struttura e copertura.",level:"Premium accessibile / generalista evoluto",proof:"2.000+ alloggi e 11 hub dichiarati",genova:"Forte: Liguria e Genova",price:"Su preventivo",lesson:"Benchmark di infrastruttura; non sfidare sulla scala."},
  {name:"Italianway",url:"https://info.italianway.house/sei-un-proprietario/",promise:"Tecnologia, rete distributiva e formule di gestione differenziate.",client:"Investitori, proprietari e operatori professionali.",level:"Upper-mid / piattaforma",proof:"Numeri di rete, team e spazio proprietario",genova:"Non distintivo",price:"Su preventivo",lesson:"Rendere la scelta dell’offerta più concreta di Aurevia."},
  {name:"Owner Value",url:"https://www.owner-value.com/",promise:"Più trasparenza economica e controllo locale a Genova.",client:"Proprietari orientati a dati, fiscalità e rendimento netto.",level:"Locale professionale",proof:"Simulazione lordo/netto, dashboard, inventario e WhatsApp",genova:"Molto forte",price:"Non pubblicato",lesson:"Concorrente locale più pericoloso su trasparenza e prova."},
  {name:"Luxury Affitti Brevi Genova",url:"https://luxury.agenziagestioneaffittibrevi.it/agenzia-affitti-brevi-di-lusso-genova/",promise:"Gestione completa per immobili di lusso con forte rassicurazione sui danni.",client:"Proprietari di fascia alta sensibili a sicurezza e rendimento.",level:"Luxury specialistico",proof:"Assicurazione fino a 1 M€ e gestione completa dichiarate",genova:"Forte",price:"Non pubblicato",lesson:"Massimali e verifiche attirano; condizioni ed esclusioni devono essere leggibili."},
  {name:"AlterEgo Luxury",url:"https://www.alteregoluxury.com/",promise:"Una gestione selettiva, dichiaratamente non per tutti.",client:"Proprietari sensibili a esclusività e immagine.",level:"Luxury dichiarato",proof:"Audit in quattro fasi; alcune prove quantitative deboli",genova:"Copertura nazionale",price:"Su audit",lesson:"L’esclusività funziona solo con criteri e prove verificabili."},
  {name:"ElleBnB",url:"https://www.ellebnb.com/",promise:"Avvio rapido, rischio ridotto e gestione completa.",client:"Proprietari che vogliono semplicità operativa.",level:"Premium operativo",proof:"7 giorni, 0 € avvio, assistenza e reporting dichiarati",genova:"Non centrale",price:"Non pubblicato",lesson:"Le garanzie concrete riducono più frizione del linguaggio luxury."},
  {name:"Eramo",url:"https://www.eramoofficial.com/it/",promise:"Livelli di servizio leggibili e relazione umana.",client:"Proprietari che vogliono scegliere il grado di delega.",level:"Boutique premium",proof:"Storia dei fondatori e offerte pubbliche",genova:"Non centrale",price:"12% / 18% / 25% / su misura",lesson:"Trasparenza tariffaria rara e credibile."},
  {name:"Zen Apartments",url:"https://www.zenapartments.it/",promise:"Gestione senza costi fissi e risposta alle obiezioni.",client:"Proprietari pragmatici, sensibili a rischio e semplicità.",level:"Generalista locale",proof:"FAQ dettagliata e valutazione gratuita",genova:"Forte",price:"Nessun costo fisso dichiarato",lesson:"La FAQ può vincere la conversione anche senza branding premium."},
  {name:"CleanBnB",url:"https://www.cleanbnb.net/affitti-brevi-genova.html",promise:"Delega completa, prezzi dinamici e rete nazionale.",client:"Mercato ampio, dall’investitore al proprietario singolo.",level:"Generalista strutturato",proof:"Presenza multi-città e processo completo",genova:"Presente",price:"Su preventivo",lesson:"Codici di categoria forti, ma relazione meno personale."},
  {name:"Hostplace",url:"https://www.hostplace.it/it/case-vacanza/genova/",promise:"Gestione digitale e operativa con livelli di delega differenti.",client:"Proprietari orientati a performance e servizio completo.",level:"Medio-alto / premium",proof:"15 anni e quattro pacchetti dichiarati",genova:"Presente",price:"Base 12% · Completa 25% · Premium 30% + IVA",lesson:"Benchmark diretto per prezzo e modularità; Aurevia deve rendere visibile la cura superiore."},
  {name:"Portofino Homes",url:"https://www.portofinohomes.it/chi-siamo/",promise:"Competenza immobiliare e conoscenza della Riviera.",client:"Clientela internazionale e proprietari di pregio.",level:"Luxury territoriale",proof:"Marca e radicamento nella Riviera",genova:"Adiacente",price:"Su preventivo",lesson:"Il prestigio territoriale è una barriera più forte del design."},
  {name:"Tilo",url:"https://tilobusiness.eu/",promise:"Servizi integrati per ospitalità e performance.",client:"Operatori e proprietari professionali.",level:"B2B specialistico",proof:"Ampiezza di servizi",genova:"Non distintivo",price:"Su preventivo",lesson:"Evitare un catalogo dispersivo: vendere un risultato orchestrato."},
];

const offers = [
  ["Quasi universale","Gestione completa","Annunci, canali, pricing, ospiti, check-in, pulizie e coordinamento. È il requisito minimo, non un differenziatore."],
  ["Quasi universale","Revenue management","Prezzi dinamici e distribuzione multicanale. Promessa forte, ma rischiosa senza benchmark e metodologia visibile."],
  ["Frequente","Shooting e home staging","Aumentano percezione e conversione dell’annuncio. Vanno presentati come investimento con standard e approvazione."],
  ["Frequente","Manutenzione coordinata","Riduce il carico mentale. Per il premium servono SLA, doppio fornitore e registro degli interventi."],
  ["Frequente","Assistenza e assicurazione","Rassicurano sui danni; una fonte NotebookLM dichiara fino a 1 M€, mentre le recensioni segnalano frizioni nei rimborsi. Condizioni, massimali ed esclusioni devono essere espliciti."],
  ["Frequente","Dashboard e reporting","Molto rilevante per multiproprietari. Oggi è un’aspettativa; Aurevia deve renderla più decisionale."],
  ["Selettiva","Fiscalità e adempimenti","È una leva di fiducia e SEO. Deve restare informativa o passare da professionisti abilitati."],
  ["Rara","Ristrutturazione e interior","Aumenta il valore potenziale ma allunga il ciclo commerciale e assorbe capitale operativo."],
  ["Rara","Selezione formalizzata degli ospiti","Grande spazio bianco: i competitor la citano, pochi mostrano criteri, escalation e tracciabilità."],
  ["Rara","Controllo consolidato multi-bene","Opportunità più coerente con il target: unico report, eccezioni, autorizzazioni e performance per portafoglio."],
  ["Rara","Passaporto patrimoniale","Cronologia di stato, inventario fotografico, manutenzioni e decisioni: trasforma la cura in prova accumulata."],
];

const angles = [
  ["Rendimento","Dominante","Trasforma l’immobile in performance economica. È potente ma saturo e richiede prove comparabili."],
  ["Zero stress / tempo","Dominante","Promette sollievo dalla complessità. Rilevante, ma quasi indistinguibile tra operatori."],
  ["Gestione completa","Dominante","Riduce il rischio di dover coordinare più fornitori. Va tradotto in responsabilità unica."],
  ["Controllo e reporting","Frequente","Risponde alla paura di delegare alla cieca. È il ponte ideale verso i multiproprietari."],
  ["Protezione del bene","Frequente","Attiva avversione alla perdita. Aurevia può possedere questo territorio con protocolli verificabili."],
  ["Sicurezza normativa","Frequente","Trasferisce complessità e rischio percepito. Non va trasformata in consulenza legale implicita."],
  ["Prestigio / esclusività","Selettivo","Aumenta desiderabilità, ma diventa cosmetico senza selezione reale e prova operativa."],
  ["Esperienza ospite","Frequente","Sostiene recensioni e prezzo. Va collegata alla protezione del bene e non solo al servizio concierge."],
  ["Valore patrimoniale","Raro","Orizzonte lungo, adatto ai proprietari premium; più difendibile del solo aumento ricavi."],
  ["Fiscalità","Tattico","Riduce incertezza e genera ricerca organica. Richiede partner qualificati e disclaimer chiaro."],
];

const ads: Ad[] = [
  {title:"Delegare senza perdere il controllo",hook:"Affidare la gestione non significa rinunciare al controllo.",angle:"Controllo proprietario",promise:"Un referente, decisioni tracciate, report leggibile.",body:"A Genova, Aurevia coordina immobile, ospiti e fornitori. Tu ricevi ciò che conta: performance, eccezioni e decisioni da approvare. Il rumore operativo resta a noi.",cta:"Richiedi la valutazione riservata",creative:"Split screen: 18 chat disordinate vs un report mensile essenziale.",audience:"Multiproprietari, investitori, professionisti 35–65",format:"Video 20 s · feed e Stories"},
  {title:"Il portafoglio in una pagina",hook:"Tre immobili. Un solo quadro decisionale.",angle:"Multi-proprietà",promise:"Reporting consolidato e interlocutore unico.",body:"Non servono tre gruppi WhatsApp e tre modi diversi di capire i numeri. Aurevia unifica gestione, alert e reporting del tuo portafoglio a Genova.",cta:"Vedi il report proprietario",creative:"Mockup pulito di dashboard con tre immobili e tre sole priorità.",audience:"Proprietari con 2+ immobili",format:"Carousel 4 card"},
  {title:"La casa non è un inventario",hook:"Un immobile di pregio non si gestisce come una stanza in più.",angle:"Protezione patrimoniale",promise:"Standard di cura documentati.",body:"Inventario fotografico, controlli tra i soggiorni, manutenzioni tracciate e responsabilità chiare. Prima del rendimento viene la tutela del bene che lo genera.",cta:"Scopri il protocollo di custodia",creative:"Dettagli materici della casa, sovraimpressi con check discreti.",audience:"Proprietari di seconde case e immobili di pregio",format:"Video editoriale 25 s"},
  {title:"Stima Genova",hook:"Quanto può rendere davvero il tuo immobile a Genova?",angle:"Reciprocità / diagnosi",promise:"Stima gratuita con ipotesi visibili.",body:"Ricevi una prima forchetta basata su posizione, caratteristiche e disponibilità. Niente numeri miracolosi: ti mostriamo le ipotesi e i prossimi passi.",cta:"Ottieni la stima gratuita",creative:"Mappa di Genova + scheda di valutazione, senza cifra sensazionalistica.",audience:"Proprietari e investitori locali",format:"Immagine 4:5 + lead form"},
  {title:"Traveler Select",hook:"Più prenotazioni non significa qualsiasi prenotazione.",angle:"Qualità degli ospiti",promise:"Selezione, regole e gestione delle eccezioni.",body:"Aurevia applica un protocollo di valutazione coerente con il tuo immobile, comunica le regole prima dell’arrivo e interviene quando un segnale merita attenzione.",cta:"Conosci il metodo Traveler Select",creative:"Sequenza “richiesta → verifica → conferma → controllo”.",audience:"Proprietari sensibili a danni e vicinato",format:"Motion graphic 15 s"},
  {title:"Passaporto patrimoniale",hook:"Ogni intervento dovrebbe aumentare la conoscenza del tuo immobile.",angle:"Tracciabilità",promise:"Una memoria operativa che cresce nel tempo.",body:"Stato, inventario, manutenzioni, autorizzazioni e decisioni: il Passaporto Aurevia rende visibile ciò che normalmente resta disperso tra messaggi e fatture.",cta:"Guarda un esempio",creative:"Timeline elegante di un immobile su dodici mesi.",audience:"Investitori e proprietari all’estero",format:"Carousel educativo"},
  {title:"Uscita flessibile",hook:"La fiducia non ha bisogno di trattenerti.",angle:"Riduzione del rischio",promise:"Recesso flessibile e passaggio ordinato.",body:"La relazione deve continuare perché crea valore, non perché è difficile uscirne. Proponiamo condizioni chiare, restituzione dei dati e handover documentato.",cta:"Parliamo delle condizioni",creative:"Chiave consegnata su fondo chiaro, copy minimalista.",audience:"Proprietari delusi da gestori precedenti",format:"Immagine premium"},
  {title:"Un direttore, non un centralino",hook:"Sai sempre chi risponde del risultato.",angle:"Accountability",promise:"Un interlocutore unico con responsabilità end-to-end.",body:"Ospiti, pulizie, manutenzione e pricing possono coinvolgere più specialisti. Per te la responsabilità resta una: il tuo referente Aurevia.",cta:"Incontra il tuo referente",creative:"Ritratto reale del team con schema di responsabilità.",audience:"CSP+, imprenditori, executive",format:"Video founder 30 s"},
  {title:"Ore restituite",hook:"Quanto ti costa essere il centralino del tuo immobile?",angle:"Tempo",promise:"Delega operativa senza perdita di visibilità.",body:"Messaggi serali, imprevisti e coordinamento fornitori consumano attenzione. Aurevia gestisce il quotidiano e ti coinvolge solo quando una decisione conta davvero.",cta:"Calcola cosa puoi delegare",creative:"Agenda congestionata che diventa un report di tre righe.",audience:"Professionisti e proprietari non residenti",format:"Reel 18 s"},
  {title:"Proteggi ciò che produce",hook:"Il rendimento di domani dipende da come curi la casa oggi.",angle:"Valore di lungo periodo",promise:"Performance compatibile con la conservazione del bene.",body:"Ottimizzare il prezzo non basta. Controlli, manutenzione preventiva e standard ospite proteggono il valore che rende possibile ogni prenotazione futura.",cta:"Richiedi l’audit patrimoniale",creative:"Prima/dopo non estetico: dettaglio preservato e registro intervento.",audience:"Proprietari patrimoniali",format:"Carousel 5 card"},
  {title:"Proprietario all’estero",hook:"La tua casa è a Genova. Il tuo referente anche.",angle:"Presenza locale",promise:"Gestione trilingue e presenza operativa.",body:"Per chi vive fuori città o all’estero, Aurevia coordina ospiti e casa in italiano, francese e inglese, con aggiornamenti chiari e un solo punto di contatto.",cta:"Prenota un confronto da remoto",creative:"Genova + video call + report, tono sobrio.",audience:"Espatriati e italiani residenti all’estero",format:"Video 20 s"},
  {title:"Portafoglio, non somma di case",hook:"Un portafoglio richiede priorità, non solo report.",angle:"Investor operations",promise:"Confronto tra immobili e azioni prioritarie.",body:"Aurevia consolida occupazione, ADR, ricavi, incidenti e interventi per mostrare dove agire. Meno fogli separati, più decisioni.",cta:"Richiedi il modello Portfolio",creative:"Ranking di tre immobili con prossima azione.",audience:"Investitori con 3+ unità",format:"Documento ads / carousel"},
  {title:"Periodi vuoti, decisioni migliori",hook:"Il calendario vuoto non si riempie con uno sconto automatico.",angle:"Revenue management",promise:"Prezzo, restrizioni e posizionamento letti insieme.",body:"Aurevia combina domanda, caratteristiche del bene e qualità dell’annuncio. L’obiettivo non è occupare a ogni costo, ma migliorare il valore netto e la coerenza degli ospiti.",cta:"Fai analizzare il calendario",creative:"Calendario con tre leve annotate.",audience:"Host con annunci già attivi",format:"Video whiteboard 25 s"},
  {title:"Pricing con un limite",hook:"Il prezzo giusto non deve sacrificare la casa.",angle:"Performance responsabile",promise:"Ottimizzazione con guardrail qualitativi.",body:"Una strategia premium considera ADR, occupazione, durata, rischio operativo e usura. Aurevia non insegue il volume quando distrugge il valore.",cta:"Scopri i guardrail",creative:"Bilancia visiva: ricavo netto / qualità / usura.",audience:"Proprietari premium scettici sul mass market",format:"Immagine editoriale"},
  {title:"Il report che decide",hook:"Un buon report non racconta il mese. Indica la prossima decisione.",angle:"Reporting",promise:"Tre numeri, tre eccezioni, tre azioni.",body:"Ogni mese ricevi performance, confronto, incidenti, manutenzioni e raccomandazioni. La trasparenza serve ad agire, non ad aggiungere un altro PDF.",cta:"Ricevi il fac-simile",creative:"Pagina report reale con dati demo chiaramente etichettati.",audience:"Multiproprietari e CFO familiari",format:"Lead magnet carousel"},
  {title:"Prima e dopo la delega",hook:"Prima: tutto passa da te. Dopo: solo le decisioni importanti.",angle:"Contrasto",promise:"Riduzione del carico operativo.",body:"Aurevia assorbe richieste ospiti, coordinamento e controlli. Tu mantieni regole, budget e visibilità. È questa la differenza tra delegare e sparire.",cta:"Mappa il tuo carico operativo",creative:"Split screen giornata del proprietario.",audience:"Host self-managed",format:"Reel 15 s"},
  {title:"Audit operativo 72 ore",hook:"In 72 ore capisci cosa manca prima di crescere.",angle:"Velocità / chiarezza",promise:"Diagnosi di annuncio, casa, processi e conformità.",body:"Un audit iniziale identifica priorità, rischi e piano di attivazione. La tempistica riguarda la diagnosi, non promette risultati economici.",cta:"Candidati all’audit",creative:"Checklist cronologica 0–24–48–72 ore.",audience:"Proprietari già attivi",format:"Carousel"},
  {title:"Checklist conformità",hook:"CIN, ospiti, statistiche, sicurezza: cosa è già coperto?",angle:"Riduzione dell’incertezza",promise:"Checklist informativa e percorso con specialisti.",body:"Scarica una mappa operativa degli adempimenti per le locazioni brevi. Aurevia coordina il processo e coinvolge professionisti abilitati quando serve.",cta:"Scarica la checklist",creative:"Checklist istituzionale, nessun allarmismo.",audience:"Nuovi proprietari e investitori",format:"Lead ad documento"},
  {title:"Esperienza ospite, valore proprietario",hook:"L’ospitalità migliore protegge anche il proprietario.",angle:"Guest experience",promise:"Regole chiare, assistenza e qualità coerente.",body:"Comunicazione prima dell’arrivo, casa preparata e assistenza riducono attriti, incidenti e recensioni negative. Il servizio all’ospite è una leva patrimoniale.",cta:"Vedi il journey ospite",creative:"Timeline dal booking al controllo post-checkout.",audience:"Proprietari premium",format:"Video 25 s"},
  {title:"Manutenzione senza rimbalzi",hook:"Un problema, un responsabile, un aggiornamento chiaro.",angle:"Service recovery",promise:"Coordinamento, autorizzazioni e tracciabilità.",body:"Quando emerge un guasto, Aurevia attiva il fornitore, raccoglie evidenze e applica le soglie di autorizzazione concordate. Tu non insegui nessuno.",cta:"Scopri il protocollo incidenti",creative:"Caso simulato, marcato “esempio”, in quattro step.",audience:"Proprietari con esperienze negative",format:"Carousel 4 card"},
  {title:"Niente promesse miracolose",hook:"Diffida di chi promette rendimento senza mostrare le ipotesi.",angle:"Trasparenza",promise:"Stime in forchetta, dati e limiti visibili.",body:"Aurevia separa fatti, ipotesi e obiettivi. Una valutazione seria considera immobile, disponibilità, costi e rischio operativo prima di parlare di risultato.",cta:"Richiedi una stima leggibile",creative:"Tre colonne: fatto / ipotesi / decisione.",audience:"Investitori analitici",format:"Immagine statica"},
  {title:"Solo Genova",hook:"La scala più utile non è nazionale. È essere dove serve.",angle:"Densità locale",promise:"Rete e controllo concentrati a Genova.",body:"Aurevia sceglie Genova per costruire tempi di intervento, conoscenza dei quartieri e partner affidabili. La concentrazione è parte del servizio premium.",cta:"Verifica se il tuo immobile è nel perimetro",creative:"Mappa di Genova con aree operative, senza Riviera.",audience:"Proprietari genovesi",format:"Video mappa 15 s"},
  {title:"Capacità selettiva",hook:"Accettiamo immobili solo quando possiamo mantenerne lo standard.",angle:"Rarità autentica",promise:"Ingresso basato su fit operativo, non urgenza artificiale.",body:"Valutiamo posizione, stato, potenziale e compatibilità con il nostro modello. Se non possiamo garantire responsabilità e cura, preferiamo dirlo subito.",cta:"Richiedi la valutazione di fit",creative:"Scheda di candidatura elegante.",audience:"Proprietari di pregio",format:"Immagine + landing"},
  {title:"Seconda casa, presenza continua",hook:"Quando non ci sei, la casa continua a cambiare.",angle:"Assenza del proprietario",promise:"Controlli e interventi documentati.",body:"Aurevia osserva, coordina e registra. Al tuo ritorno non trovi una serie di sorprese, ma una proprietà seguita con metodo.",cta:"Parla con il referente locale",creative:"Casa vuota, dettaglio controllato, report inviato.",audience:"Second-home owners",format:"Video emozionale 25 s"},
  {title:"Il team dietro il servizio",hook:"La fiducia inizia da chi risponde.",angle:"Human proof",promise:"Volti, ruoli e responsabilità reali.",body:"Siamo quattro persone e costruiamo una rete locale verificata. Mostriamo chi segue il proprietario, chi coordina l’operatività e come gestiamo le escalation.",cta:"Conosci Aurevia",creative:"Ritratto autentico del team, nomi e ruoli.",audience:"Pubblico caldo e referral",format:"Video founder 35 s"},
  {title:"Diagnosi, non caso inventato",hook:"Non abbiamo ancora una storia da abbellire. Abbiamo un metodo da mostrarti.",angle:"Onestà da start-up",promise:"Prova di processo prima della prova di risultato.",body:"Finché i primi casi verificati non saranno maturi, Aurevia mostra audit, report, checklist e standard operativi. La credibilità viene prima della pubblicità.",cta:"Esamina il metodo",creative:"Founder + materiali reali, nessun numero di performance.",audience:"Early adopters e rete personale",format:"Video 30 s"},
  {title:"Autogestione o direzione",hook:"Il costo non è solo la commissione. È tutto ciò che resta senza proprietario.",angle:"Costo totale",promise:"Confronto trasparente del modello operativo.",body:"Tempo, software, fornitori, errori, notti non ottimizzate e manutenzione: la valutazione confronta il costo totale, non una percentuale isolata.",cta:"Confronta i due scenari",creative:"Tabella autogestione / Aurevia con voci modificabili.",audience:"Host esperti ma saturi",format:"Interactive landing / carousel"},
  {title:"Dossier proprietario Genova",hook:"La decisione giusta parte da cinque numeri, non da una promessa.",angle:"Lead magnet",promise:"Dossier con scenario, costi e piano 90 giorni.",body:"Ricevi un documento riservato con forchetta di ricavo, ipotesi, priorità operative e proposta di gestione. Gratuito e senza impegno.",cta:"Richiedi il dossier",creative:"Copertina dossier con mappa e indice.",audience:"Lead freddi ad alta intenzione",format:"Meta lead ad"},
  {title:"Google — gestione completa",hook:"Gestione affitti brevi a Genova per proprietari esigenti",angle:"Intento di ricerca",promise:"Casa, ospiti e performance con un referente unico.",body:"Stima gratuita · reporting proprietario · recesso flessibile · gestione completa a Genova. Valutiamo immobili e portafogli da 150 € ADR atteso.",cta:"Richiedi la valutazione",creative:"Responsive Search Ad; landing dedicata.",audience:"Keyword esatta e frase: gestione affitti brevi Genova",format:"Google Search"},
  {title:"Retargeting — torna al controllo",hook:"Hai visto la stima. Ora guarda come proteggeremmo il bene.",angle:"Retargeting di processo",promise:"Protocollo proprietario visibile prima della call.",body:"Scopri reporting, selezione ospiti e gestione delle eccezioni. Nessuna chiamata obbligatoria: decidi tu quando approfondire.",cta:"Apri il protocollo",creative:"Tre estratti del playbook Aurevia.",audience:"Visitatori del simulatore negli ultimi 30 giorni",format:"Carousel retargeting"},
];

const opportunities = [
  {name:"Traveler Select verificabile",ratings:[5,5,4,4,4,4],copy:"Protocollo ospiti, regole, segnali, escalation e tracciabilità.",timing:"Subito"},
  {name:"Command Center multi-bene",ratings:[5,5,5,3,3,3],copy:"Report consolidato, eccezioni, autorizzazioni e azioni per portafoglio.",timing:"0–90 giorni"},
  {name:"Passaporto patrimoniale",ratings:[5,5,5,3,3,3],copy:"Inventario, stato, interventi e decisioni accumulati per immobile.",timing:"0–90 giorni"},
  {name:"Recesso flessibile + handover",ratings:[4,5,2,5,5,5],copy:"Riduce il rischio percepito e rende la fiducia misurabile.",timing:"Subito"},
  {name:"Benchmark di micro-zona",ratings:[5,4,4,3,3,3],copy:"Stima con ipotesi e comparabili, senza claim di rendimento assoluto.",timing:"30–90 giorni"},
  {name:"Rete partner ridondante",ratings:[5,4,4,2,2,2],copy:"Due opzioni per mestiere critico, SLA e controllo qualità.",timing:"30–180 giorni"},
  {name:"Controllo consumi e domotica",ratings:[3,4,3,3,3,3],copy:"Alert su climatizzazione e anomalie per limitare costi, usura e contestazioni.",timing:"90–180 giorni"},
  {name:"Concierge ospiti trilingue",ratings:[3,4,2,4,3,4],copy:"Italiano, francese e inglese con standard unico.",timing:"30–90 giorni"},
  {name:"Ristrutturazione / interior",ratings:[3,5,3,2,1,1],copy:"Upsell ad alto valore, ma capitale e complessità elevati.",timing:"Dopo 180 giorni"},
];

const opportunityWeights = [30,20,20,15,10,5];
const opportunityScore = (ratings:number[]) => Math.round(ratings.reduce((total,rating,index)=>total + rating * opportunityWeights[index] / 5,0));

const sources = [
  ["A","Comune di Genova — Piano turistico 2026","https://smart.comune.genova.it/comunicati-stampa-articoli/turismo-presentato-il-piano-strategico-di-promozione-della-destinazione","3,5 milioni di presenze 2025 previste; 50% internazionale; crescita estera dichiarata."],
  ["A","Ministero del Turismo — BDSR e CIN","https://www.ministeroturismo.gov.it/banca-dati-strutture-ricettive/","Obbligo e funzione del CIN, esposizione e presenza negli annunci."],
  ["A","Ministero del Turismo — FAQ BDSR","https://www.ministeroturismo.gov.it/faq-banca-dati-strutture-ricettive-bdsr/","FAQ aggiornate a maggio 2026 su CIN, sicurezza ed esposizione."],
  ["B","Wonderful Italy — proprietari","https://wonderfulitaly.eu/it/gestione-affitti","Offerta, processo, distribuzione e CTA."],
  ["B","Wonderful Italy — impresa","https://wonderfulitaly.eu/it/chi-siamo/scopri-wonderful-italy","Scala e rete dichiarate dall’azienda."],
  ["B","Wonderful Italy — FAQ","https://www.wonderfulitaly.eu/it/gestione-affitti/faq-affitti-brevi","Adempimenti e obiezioni proprietario."],
  ["B","Italianway — proprietari","https://info.italianway.house/sei-un-proprietario/","Formule, spazio proprietario e processo."],
  ["B","Italianway — chi siamo","https://info.italianway.house/chi-siamo/","Prova di scala, team e rete."],
  ["B","Owner Value","https://www.owner-value.com/","Benchmark locale su dashboard, fiscalità e trasparenza."],
  ["B","Luxury Affitti Brevi Genova","https://luxury.agenziagestioneaffittibrevi.it/agenzia-affitti-brevi-di-lusso-genova/","Gestione completa, sicurezza e assicurazione dichiarata fino a 1 M€."],
  ["B","Eramo","https://www.eramoofficial.com/it/","Livelli tariffari pubblici 12%, 18%, 25% e su misura."],
  ["B","AlterEgo Luxury","https://www.alteregoluxury.com/","Posizionamento selettivo e audit."],
  ["B","ElleBnB","https://www.ellebnb.com/","Garanzie operative e riduzione della frizione."],
  ["B","Zen Apartments","https://www.zenapartments.it/","FAQ, stima e promessa senza costi fissi."],
  ["B","CleanBnB Genova","https://www.cleanbnb.net/affitti-brevi-genova.html","Gestione completa e codici di categoria."],
  ["B","Hostplace Genova","https://www.hostplace.it/it/case-vacanza/genova/","Presenza e offerta locale."],
  ["B","Portofino Homes","https://www.portofinohomes.it/chi-siamo/","Brand territoriale premium."],
  ["B","Tilo Business","https://tilobusiness.eu/","Ampiezza di servizi B2B."],
  ["B","Riviera Divina","https://rivieradivina.it/","Identità ligure e ospitalità."],
  ["B","Google Ads Transparency — Wonderful Italy","https://adstransparency.google.com/advertiser/AR07710365215795183617/creative/CR00347922054969819137?region=IT","Creatività verificabile di property management locale."],
  ["C","Trustpilot — CleanBnB","https://it.trustpilot.com/review/cleanbnb.net","Segnali qualitativi; campione auto-selezionato, non rappresentativo."],
  ["C","Trustpilot — Halldis","https://it.trustpilot.com/review/halldis.com?page=2","Segnali di esperienza; usare come ipotesi, non benchmark statistico."],
  ["D","last30days — corpus 90 giorni","https://www.reddit.com/r/airbnb_hosts/","Sei thread Reddit parziali; nessun risultato YouTube pertinente. Prova debole."],
];

function SectionHeader({index,title,children}:{index:string;title:string;children:React.ReactNode}) {
  return <div className={styles.sectionHeader}><span className={styles.sectionIndex}>{index}</span><h2>{title}</h2><p>{children}</p></div>;
}

export default async function StrategyPage() {
  const user = await getAdminUser();
  if (!user) redirect("/connexion");

  return <div className={styles.page} data-no-translate>
    <header className={styles.hero}>
      <div className={styles.heroTop}><span className={styles.brand}>AUREVIA · STRATEGIA RISERVATA</span><Link className={styles.back} href="/administration">Torna all’amministrazione</Link></div>
      <div className={styles.heroGrid}>
        <div><p className={styles.kicker}>Sistema decisionale · Genova · 2026–2028</p><h1>Custodia patrimoniale. Controllo. Performance.</h1><p className={styles.lead}>La strategia per diventare il property manager premium di riferimento a Genova, partendo da zero dati interni e costruendo prova, densità operativa e fiducia proprietario.</p></div>
        <aside className={styles.heroDecision}><span>Decisione prioritaria</span><strong>Non acquistare traffico finché sito, prova e misurazione non sono credibili in italiano.</strong><small>Prima l’infrastruttura di fiducia; poi 1.000 €/mese su due intenti misurabili.</small></aside>
      </div>
      <div className={styles.meta}><span>Aggiornato 5 agosto 2026</span><span>10 fonti NotebookLM pronte</span><span>Solo fonti gratuite</span><span>Segnale social 90 giorni: debole</span><span>Accesso amministratore</span></div>
    </header>

    <nav className={styles.nav} aria-label="Indice strategico">
      <a href="#decisione">Decisione</a><a href="#economia">Economia</a><a href="#swot">SWOT</a><a href="#concorrenti">Concorrenti</a><a href="#offerta">Offerta</a><a href="#marketing">Marketing</a><a href="#copy">Copy</a><a href="#ads">30 Ads</a><a href="#funnel">Funnel</a><a href="#landing">Landing</a><a href="#opportunita">Opportunità</a><a href="#oceano">Blue Ocean</a><a href="#genova">Genova</a><a href="#roadmap">Roadmap</a><a href="#fonti">Fonti</a>
    </nav>

    <main className={styles.main}>
      <section id="decisione" className={styles.section}>
        <SectionHeader index="00" title="La tesi in una frase">Il mercato vende rendimento e assenza di stress. Aurevia deve vendere una forma superiore di delega: il bene è protetto, il proprietario conserva il controllo e una persona risponde del risultato.</SectionHeader>
        <div className={styles.decisionGrid}>
          <article><span>Posizionamento</span><strong>Direzione patrimoniale locale</strong><p>Non “concierge di lusso”, ma custodia e performance di immobili e portafogli a Genova.</p></article>
          <article><span>Cliente prioritario</span><strong>Multiproprietario</strong><p>2+ unità, ADR atteso da 150 €, delega completa, bisogno di report consolidato.</p></article>
          <article><span>Modello di crescita</span><strong>Densità, non volume</strong><p>6–10 relazioni portafoglio valgono più di 50 contratti isolati e operativamente dispersi.</p></article>
        </div>
        <div className={styles.grid3}>
          <article className={styles.card}><h3>Fermare</h3><p>Claim +71% senza benchmark locale, testimonianze provvisorie, perimetro “Liguria” e acquisizione senza analytics.</p><span className={styles.verdict}>Rischio: distruzione della fiducia prima della call.</span></article>
          <article className={styles.card}><h3>Costruire</h3><p>Versione italiana nativa, prova di processo, report proprietario, Traveler Select, rete partner e pagina multiproprietario.</p><span className={styles.verdict}>Vantaggio: prova operativa prima dei casi cliente.</span></article>
          <article className={`${styles.card} ${styles.darkCard}`}><h3>Accelerare</h3><p>Partnership, referral e outbound mirato; paid search locale e Meta diagnosi solo dopo la misurazione.</p><span className={styles.verdict}>Vincolo: 1.000 €/mese non può sostenere da solo 50 unità.</span></article>
        </div>
      </section>

      <section id="economia" className={styles.section}>
        <SectionHeader index="01" title="Reality check economico">Il target “200 k€/mese” deve essere definito come GMV delle prenotazioni o ricavi Aurevia. Con 50 immobili e ADR 150 €, le due letture producono economie radicalmente diverse.</SectionHeader>
        <StrategyEconomics/>
        <div className={styles.callout} style={{marginTop:18}}><strong>Raccomandazione di pianificazione</strong><p>Trattare 200 k€ come GMV mensile del portafoglio. A 70% di occupazione, 50 immobili richiedono circa 190 € di ADR; a 150 € di ADR servirebbe circa 89% di occupazione. Il piano base prudente è 150–180 k€ GMV e 37,5–45 k€ di ricavi Aurevia al 25%, prima di servizi accessori.</p></div>
        <div className={styles.callout} style={{marginTop:12}}><strong>Il paid non può comprare 50 mandati</strong><p>Sei mesi a 1.000 € equivalgono a 6.000 €, cioè 120 € di CAC massimo per ciascuna delle 50 unità prima di qualsiasi costo vendita. Con una chiusura del 15–30% servirebbero circa 167–333 opportunità qualificate. Il target può diventare plausibile solo acquisendo portafogli: 6–10 proprietari con 5–8 unità medie, tramite vendita diretta e partner.</p></div>
      </section>

      <section id="swot" className={styles.section}>
        <SectionHeader index="02" title="SWOT completo di Aurevia">L’analisi combina convergenze dei concorrenti, audit del sito e vincoli dichiarati. Le conseguenze business sono esplicite per evitare un SWOT decorativo.</SectionHeader>
        <div className={styles.swot}>
          <article><h3>Forze <span>interne</span></h3><ul><li><b>Identità patrimoniale già distintiva.</b> Il tono è più calmo della media di mercato e può sostenere la protezione del bene senza un nuovo rebranding.</li><li><b>Solo Genova.</b> La concentrazione può diventare rapidità d’intervento, conoscenza micro-locale e densità di partner.</li><li><b>Promessa coerente.</b> Referente unico, reporting, valutazione gratuita e recesso flessibile rispondono ai principali rischi percepiti.</li><li><b>Team di quattro persone e FR/IT/EN.</b> Buona base per espatriati e viaggiatori internazionali, se ruoli e responsabilità diventano visibili.</li><li><b>Simulatore esistente.</b> Asset di acquisizione utile se mostra le ipotesi e rimuove i numeri non dimostrati.</li></ul><span className={styles.verdict}>Conseguenza: il brand può salire di gamma attraverso la prova, non aggiungendo decorazione.</span></article>
          <article><h3>Debolezze <span>interne</span></h3><ul><li><b>Nessun immobile e nessun dato interno.</b> Risultati, costi reali, SLA e retention non sono ancora dimostrabili.</li><li><b>Sito visibile in francese.</b> Incoerenza diretta con un’acquisizione interamente italiana.</li><li><b>Promessa iniziale troppo astratta.</b> Il visitatore non comprende subito servizio, area e cliente ideale.</li><li><b>Assenza di prova autentica.</b> Nessun caso, proprietario, partner, report reale o immobile gestito.</li><li><b>Rete partner da costruire.</b> Il rischio operativo cresce più rapidamente del portafoglio.</li><li><b>Obiettivo 50 in sei mesi non sostenuto dal funnel.</b> Il budget paid non basta senza contratti multi-bene e canali partner.</li></ul><span className={styles.verdict}>Conseguenza: ogni euro pubblicitario speso prima delle correzioni amplifica le debolezze.</span></article>
          <article><h3>Opportunità <span>esterne</span></h3><ul><li><b>Controllo multi-bene.</b> Le dashboard esistono, ma raramente diventano strumenti decisionali consolidati.</li><li><b>Custodia patrimoniale.</b> Protezione, registro di stato e manutenzione preventiva sono meno saturi di “più ricavi”.</li><li><b>Qualità dei viaggiatori.</b> Formalizzare Traveler Select rende misurabile una promessa oggi vaga.</li><li><b>Mercato internazionale.</b> Il Comune indica il 50% di presenze internazionali, con Francia, Svizzera, Germania e USA rilevanti.</li><li><b>Crescita tramite partnership.</b> Agenti, avvocati, fiscalisti, architetti e family office possono apportare portafogli.</li><li><b>Prova di processo.</b> Una nuova impresa può mostrare protocolli e trasparenza prima dei casi di performance.</li></ul><span className={styles.verdict}>Conseguenza: la crescita può arrivare da poche relazioni ad alta densità, non da un mercato di massa.</span></article>
          <article><h3>Minacce <span>esterne</span></h3><ul><li><b>Wonderful Italy e Italianway.</b> La loro scala rende credibili tecnologia, distribuzione e continuità.</li><li><b>Owner Value a Genova.</b> Occupa già trasparenza, dashboard e fiscalità locale.</li><li><b>Promesse premium banalizzate.</b> Oro, serenità e “su misura” sono facili da copiare.</li><li><b>Regole e controlli più rigorosi.</b> CIN, sicurezza, reporting e procedure locali richiedono precisione e partner qualificati.</li><li><b>Qualità fragile a 50 immobili.</b> Un incidente può danneggiare un brand senza storico.</li><li><b>Dipendenza dalle piattaforme.</b> Distribuzione, recensioni e regole possono cambiare fuori dal controllo di Aurevia.</li></ul><span className={styles.verdict}>Conseguenza: la barriera difendibile è il sistema di esecuzione documentato unito alla densità locale.</span></article>
        </div>
      </section>

      <section id="concorrenti" className={styles.section}>
        <SectionHeader index="03" title="Posizionamento competitivo">Gli attori non sono tutti luxury. La tabella separa scala, livello di gamma e vantaggio realmente visibile; “su preventivo” significa che il prezzo non è verificabile pubblicamente.</SectionHeader>
        <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Attore</th><th>Promessa / valore</th><th>Cliente / gamma</th><th>Prova visibile</th><th>Genova</th><th>Prezzo pubblico</th><th>Lettura Aurevia</th></tr></thead><tbody>{competitors.map((item)=><tr key={item.name}><td><a href={item.url} target="_blank" rel="noreferrer"><b>{item.name}</b></a></td><td>{item.promise}</td><td>{item.client}<br/><span className={styles.confidence}>{item.level}</span></td><td>{item.proof}</td><td>{item.genova}</td><td>{item.price}</td><td>{item.lesson}</td></tr>)}</tbody></table></div>
        <div className={styles.callout} style={{marginTop:18}}><strong>Sintesi</strong><p>Wonderful Italy possiede la scala; Italianway la piattaforma; Owner Value la trasparenza locale; AlterEgo l’esclusività dichiarata. Aurevia deve possedere l’intersezione che nessuno dimostra completamente: Genova + custodia patrimoniale + controllo multi-bene + responsabilità personale.</p></div>
      </section>

      <section id="offerta" className={styles.section}>
        <SectionHeader index="04" title="Architettura dell’offerta">Il catalogo ampio rassicura, ma il premium si compra come risultato orchestrato. Una flagship chiara è più forte di dieci servizi venduti separatamente.</SectionHeader>
        <div>{offers.map(([rarity,name,copy])=><article className={styles.offer} key={name}><span>{rarity}</span><div><h3>{name}</h3><p>{copy}</p></div><strong>{rarity === "Rara" ? "Spazio di differenziazione" : "Codice di categoria"}</strong></article>)}</div>
        <div className={styles.grid3} style={{marginTop:18}}>
          <article className={styles.card}><h3>Aurevia Custodia · 25%</h3><p>Flagship: gestione completa, pricing, ospiti, Traveler Select, controlli, manutenzione coordinata, report mensile e referente unico.</p><span className={styles.verdict}>Base consigliata; percentuale sul solo ricavo alloggio, IVA e pass-through espliciti.</span></article>
          <article className={`${styles.card} ${styles.darkCard}`}><h3>Aurevia Portfolio · 22–24%</h3><p>Per 2+ unità: reporting consolidato, soglie di autorizzazione, review trimestrale e priorità per portafoglio.</p><span className={styles.verdict}>Sconto solo contro densità, standardizzazione e minimo mensile per unità.</span></article>
          <article className={styles.card}><h3>Aurevia Signature · 28–32%</h3><p>Villa o bene complesso: standard personalizzati, controllo inventario rafforzato, concierge e manutenzione pianificata.</p><span className={styles.verdict}>Su audit; servizi eccezionali e costi terzi approvati separatamente.</span></article>
        </div>
        <p className={styles.methodNote} style={{marginTop:14}}>Proposta da validare con consulente fiscale/legale e primi costi reali. Il benchmark pubblico Eramo mostra 12%, 18% e 25%, ma non rende i perimetri automaticamente comparabili.</p>
      </section>

      <section id="marketing" className={styles.section}>
        <SectionHeader index="05" title="Marketing e meccanismi psicologici">Le convergenze contano più delle formule isolate. I messaggi dominanti risolvono rischio, lavoro e incertezza; il lusso è raramente una prova sufficiente.</SectionHeader>
        <div className={styles.angleList}>{angles.map(([name,frequency,copy])=><article className={styles.angle} key={name}><h3>{name}</h3><p>{copy}</p><span>{frequency}</span></article>)}</div>
        <div className={styles.grid4} style={{marginTop:18}}>
          <article className={styles.card}><h3>Avversione alla perdita</h3><p>Danni, usura, errori normativi e tempo perso pesano più di un guadagno astratto equivalente.</p></article>
          <article className={styles.card}><h3>Riduzione dell’ambiguità</h3><p>Prezzi, processo, SLA e report visibili abbassano il rischio percepito prima della call.</p></article>
          <article className={styles.card}><h3>Trasferimento di autorità</h3><p>Numeri, partner, piattaforme e procedure rendono credibile la delega a un terzo.</p></article>
          <article className={styles.card}><h3>Reciprocità</h3><p>Stima, checklist e audit gratuiti dimostrano competenza prima di chiedere un contratto.</p></article>
        </div>
        <div className={styles.callout} style={{marginTop:18}}><strong>Divergenza da non ignorare</strong><p>Tilo dichiara fino al +50% e il sito Aurevia mostra +71%, mentre la fonte AirDNA del notebook è in errore e il corpus non contiene un benchmark comparabile per Genova. Sono claim di marca, non prove convergenti: Aurevia deve sostituire l’uplift assoluto con una forchetta, ipotesi visibili e casi verificati.</p></div>
      </section>

      <section id="copy" className={styles.section}>
        <SectionHeader index="06" title="Sistema di messaggi Aurevia">Il copy deve prima rendere chiari categoria, area e risultato; il linguaggio evocativo viene dopo. Tutto il percorso, incluse email e validazioni, deve essere italiano nativo.</SectionHeader>
        <div className={styles.message}><small>Messaggio principale raccomandato</small><blockquote>La gestione completa che protegge il tuo immobile e ti restituisce il controllo.</blockquote><p>A Genova, Aurevia coordina casa, ospiti, performance e partner con un referente unico, un protocollo di custodia e un reporting pensato per proprietari e portafogli.</p></div>
        <div className={styles.grid3} style={{marginTop:16}}>
          <article className={styles.card}><h3>Hero</h3><p><b>Gestione completa degli affitti brevi a Genova.</b><br/>Più controllo per te. Più cura per il tuo immobile. Un solo referente.</p></article>
          <article className={styles.card}><h3>Prova iniziale</h3><p>Non inventare testimonial. Mostra report demo etichettato, audit, ruoli del team, checklist e protocolli operativi.</p></article>
          <article className={styles.card}><h3>CTA</h3><p><b>Richiedi una valutazione riservata.</b><br/>Gratuita, con ipotesi visibili e senza impegno.</p></article>
        </div>
        <div className={styles.grid2} style={{marginTop:16}}>
          <article className={styles.card}><h3>Da evitare</h3><ul><li>“Massimizziamo sempre il rendimento.”</li><li>“Zero rischi” o “ospiti perfetti”.</li><li>Scarsità inventata.</li><li>Numeri di crescita senza base Genova.</li><li>Luxury come sostituto della prova.</li></ul></article>
          <article className={`${styles.card} ${styles.darkCard}`}><h3>Da possedere</h3><ul><li>Fatti, ipotesi e obiettivi separati.</li><li>Custodia documentata.</li><li>Decisioni proprietario esplicite.</li><li>Responsabilità unica.</li><li>Genova come scelta operativa.</li></ul></article>
        </div>
      </section>

      <section id="ads" className={styles.section}>
        <SectionHeader index="07" title="30 Ads pronte da testare">Queste sono proposte Aurevia, non annunci attribuiti ai concorrenti. L’ordine di test parte da controllo, custodia e diagnosi; i casi risultato restano vietati finché non esistono prove verificabili.</SectionHeader>
        <div className={styles.ads}>{ads.map((ad,index)=><details className={styles.ad} key={ad.title} open={index<2}><summary><b>{String(index+1).padStart(2,"0")}</b><strong>{ad.title}</strong><span>{ad.format}</span></summary><div className={styles.adBody}><dl><dt>Hook</dt><dd><em>{ad.hook}</em></dd><dt>Angolo</dt><dd>{ad.angle}</dd><dt>Promessa</dt><dd>{ad.promise}</dd><dt>Corpo</dt><dd>{ad.body}</dd><dt>CTA</dt><dd>{ad.cta}</dd><dt>Creatività</dt><dd>{ad.creative}</dd><dt>Audience</dt><dd>{ad.audience}</dd><dt>Formato</dt><dd>{ad.format}</dd></dl></div></details>)}</div>
        <div className={styles.callout} style={{marginTop:18}}><strong>Piano media iniziale · 1.000 €/mese</strong><p>Prima di avere traffico sufficiente per il retargeting: 70% Google Search locale ad alta intenzione, 20% Meta lead ad “diagnosi”, 10% produzione/test. Dopo almeno 500 visitatori qualificati: 60% Search, 25% Meta prospecting, 15% retargeting. Budget e soglie sono ipotesi da ricalibrare dopo quattro settimane di dati.</p></div>
      </section>

      <section id="funnel" className={styles.section}>
        <SectionHeader index="08" title="Funnel completo, dalla domanda al referral">Il funnel premium riduce l’incertezza progressivamente. La call non deve compensare una landing vaga: ogni fase consegna una prova e qualifica il fit.</SectionHeader>
        <div className={styles.funnel}>
          <article><h3>Traffico</h3><p>Search sull’intento locale; Meta su custodia, controllo e diagnosi; partnership e referral.</p><small>KPI: clic qualificati, non copertura.</small></article>
          <article><h3>Landing</h3><p>Categoria, Genova, cliente, promesse e CTA compresi nei primi 8 secondi.</p><small>KPI provvisorio: 6–12% lead.</small></article>
          <article><h3>Diagnosi breve</h3><p>Quartiere, tipologia, camere, situazione, disponibilità e numero di immobili.</p><small>KPI: completamento &gt;55%.</small></article>
          <article><h3>Dossier</h3><p>Forchetta, ipotesi, rischi, priorità 90 giorni e fac-simile reporting.</p><small>KPI: dossier → call &gt;35%.</small></article>
          <article><h3>Call 15 minuti</h3><p>Fit, obiettivi, vincoli, decision maker, timing e criteri di qualità.</p><small>KPI: show rate &gt;75%.</small></article>
          <article><h3>Audit e proposta</h3><p>Sopralluogo, economics, perimetro, SLA, costi terzi e piano di attivazione.</p><small>KPI: proposta → firma 25–35%.</small></article>
          <article><h3>Onboarding</h3><p>Inventario, CIN/processi, canali, pricing, regole, soglie e reporting.</p><small>KPI: live ≤21 giorni, senza eccezioni aperte.</small></article>
          <article><h3>Retention e referral</h3><p>Report mensile, review trimestrale, issue log, NPS e richiesta referral dopo valore provato.</p><small>KPI: retention, margine, referral.</small></article>
        </div>
        <div style={{marginTop:18}}>
          {[['Apertura','“Prima di parlare di rendimento, vorrei capire che cosa deve restare sotto il tuo controllo e che cosa vuoi delegare completamente.”'],['Diagnosi','Motivo del cambiamento, numero di beni, uso personale, ADR/occupazione attuali, problemi, decisore, partner esistenti e tempistiche.'],['Qualifica','Compatibilità geografica con Genova, ADR atteso ≥150 €, qualità del bene, delega completa, accesso ai dati e disponibilità al protocollo.'],['Proposta','Riformulare tre rischi, mostrare il sistema Aurevia, spiegare economics e limiti; nessuna promessa di risultato senza una base verificabile.'],['Obiezione commissione','Confrontare costo totale e valore netto: tempo, software, coordinamento, incidenti, ottimizzazione e conservazione.'],['Chiusura','Concordare sopralluogo, dati necessari, responsabili e data della decisione; inviare un riepilogo di una pagina entro 24 ore.']].map(([step,copy])=><div className={styles.script} key={step}><strong>{step}</strong><p>{copy}</p></div>)}
        </div>
      </section>

      <section id="landing" className={styles.section}>
        <SectionHeader index="09" title="Landing page: ordine esatto e logica CRO">Una sola pagina dedicata “gestione-affitti-brevi-genova”, separata dal sito editoriale. Il visitatore deve passare da chiarezza a prova, poi a riduzione del rischio.</SectionHeader>
        <div className={styles.sequence}>
          {[
            ["Hero concreto","Gestione completa a Genova, interlocutore unico, reporting, valutazione gratuita. CTA primaria; nessun claim di rendimento."],
            ["Barra di fiducia","Solo Genova · FR/IT/EN · recesso flessibile · ipotesi trasparenti. Prova di metodo, nessun logo inventato."],
            ["Per chi è / non è","Multiproprietari, espatriati, investitori, ADR atteso da 150 €. Escludere chi vuole solo check-in o prezzo minimo."],
            ["Problema riconosciuto","Caos di fornitori, rischio ospiti, numeri frammentati e distanza. Il prospect deve sentirsi compreso prima della soluzione."],
            ["Sistema Aurevia","Custodia, Traveler Select, Performance e Command Center. Quattro moduli, una responsabilità."],
            ["Come funziona","Valutazione → audit → piano → attivazione → report. Durate e deliverable espliciti."],
            ["Report proprietario","Fac-simile etichettato demo: GMV, ADR, occupazione, costi, incidenti, manutenzioni, decisioni."],
            ["Team e rete locale","Quattro volti, ruoli, lingue, escalation e metodo di selezione partner."],
            ["Economics trasparenti","Percentuale, base di calcolo, IVA, pulizie, costi terzi, minimo e scenari. Nessuna sorpresa dopo la call."],
            ["Riduzione del rischio","Recesso flessibile, handover, soglie di autorizzazione, tracciabilità e risposta incidenti."],
            ["FAQ decisive","Commissione, pagamenti, danni, assicurazione, CIN, sicurezza, ospiti, uso personale, reporting, tempi e cancellazione."],
            ["CTA finale","Richiedi il dossier riservato. Form 45–60 secondi, promessa di risposta e prossima tappa chiare."],
          ].map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section id="opportunita" className={styles.section}>
        <SectionHeader index="10" title="Opportunità non occupate: scoring ponderato">Scala 1–5 applicata a impatto commerciale 30%, fit premium 20%, difendibilità 20%, facilità 15%, costo 10% e velocità 5%. Il punteggio è giudizio consulenziale, non dato di mercato.</SectionHeader>
        <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Rank</th><th>Opportunità</th><th>Score /100</th><th>Valutazioni 1–5</th><th>Cosa crea</th><th>Timing</th></tr></thead><tbody>{opportunities.map((item,index)=>{const score=opportunityScore(item.ratings); return <tr key={item.name}><td>{index+1}</td><td><b>{item.name}</b></td><td><span className={styles.score}>{score}</span><div className={styles.bar}><i style={{width:`${score}%`}}/></div></td><td>I {item.ratings[0]} · P {item.ratings[1]} · D {item.ratings[2]} · F {item.ratings[3]} · C {item.ratings[4]} · V {item.ratings[5]}</td><td>{item.copy}</td><td>{item.timing}</td></tr>})}</tbody></table></div>
        <p className={styles.methodNote} style={{marginTop:10}}>I = impatto commerciale · P = compatibilità premium · D = difendibilità · F = facilità · C = costo favorevole · V = velocità.</p>
        <div className={styles.callout} style={{marginTop:18}}><strong>Ordine di esecuzione</strong><p>Traveler Select è il miglior quick win: elevata rilevanza, facile da spiegare e relativamente rapido. Command Center e Passaporto patrimoniale sono le barriere più profonde: richiedono disciplina dati, ma diventano più forti a ogni mese di gestione.</p></div>
      </section>

      <section id="oceano" className={styles.section}>
        <SectionHeader index="11" title="Blue Ocean: Aurevia Private Portfolio">L’offerta difficile da copiare non è una lista di servizi. È un sistema proprietario che accumula conoscenza dell’immobile, rende la qualità visibile e consolida le decisioni del proprietario.</SectionHeader>
        <div className={styles.errc}>
          <article><span>Eliminare</span><h3>Rumore</h3><ul><li>Claim miracolosi</li><li>Catalogo senza gerarchia</li><li>Espansione geografica prematura</li><li>Prova sociale fittizia</li></ul></article>
          <article><span>Ridurre</span><h3>Volume</h3><ul><li>Prenotazioni a ogni costo</li><li>Dipendenza OTA</li><li>Comunicazioni proprietario</li><li>Variabilità dei fornitori</li></ul></article>
          <article><span>Aumentare</span><h3>Controllo</h3><ul><li>Tracciabilità</li><li>Soglie decisionali</li><li>Qualità ospiti</li><li>Manutenzione preventiva</li></ul></article>
          <article><span>Creare</span><h3>Memoria</h3><ul><li>Passaporto patrimoniale</li><li>Command Center</li><li>Traveler Select</li><li>Review trimestrale</li></ul></article>
        </div>
        <div className={styles.message} style={{marginTop:18}}><small>Promessa Blue Ocean</small><blockquote>Ogni soggiorno produce reddito. Ogni mese di gestione produce anche conoscenza, controllo e valore protetto.</blockquote><p>La barriera nasce dalla combinazione di protocollo, dati storici, rete locale e relazione con il proprietario. Un concorrente può copiare una dashboard; non può copiare ventiquattro mesi di memoria operativa affidabile.</p></div>
      </section>

      <section id="genova" className={styles.section}>
        <SectionHeader index="12" title="Applicazione rigorosa a Genova">Il Comune punta su turismo di qualità, tutte le stagioni e maggiore internazionalizzazione. Aurevia deve trasformare questi segnali in un prodotto locale, senza allargarsi prematuramente a tutta la Liguria.</SectionHeader>
        <div className={styles.grid3}>
          <article className={styles.card}><h3>Domanda</h3><p>Il Comune indica 3,5 milioni di presenze nel 2025 e il 50% internazionali. Dare priorità a esperienza trilingue, coppie, famiglie e soggiorni di valore invece del volume indifferenziato.</p><span className={styles.verdict}><a href="https://smart.comune.genova.it/comunicati-stampa-articoli/turismo-presentato-il-piano-strategico-di-promozione-della-destinazione" target="_blank" rel="noreferrer">Fonte Comune di Genova</a></span></article>
          <article className={styles.card}><h3>Geografia</h3><p>Costruire micro-playbook per quartieri genovesi, partner vicini e tempi di intervento. Portofino e “Riviera” escono dal messaggio iniziale.</p></article>
          <article className={`${styles.card} ${styles.darkCard}`}><h3>Conformità</h3><p>CIN/BDSR, sicurezza, Alloggiati, flussi statistici, imposta di soggiorno e inquadramento dell’attività entrano nella checklist. Validazione con professionisti abilitati.</p><span className={styles.verdict}><a href="https://www.ministeroturismo.gov.it/faq-banca-dati-strutture-ricettive-bdsr/" target="_blank" rel="noreferrer">FAQ ufficiali 2026</a></span></article>
        </div>
        <div className={styles.grid2} style={{marginTop:16}}>
          <article className={styles.card}><h3>Canali di crescita</h3><ol><li>Agenti immobiliari e amministratori di patrimoni</li><li>Commercialisti, avvocati, notai e consulenti expat</li><li>Architetti, interior designer e manutentori premium</li><li>Outbound verso proprietari multi-unità con offerta audit</li><li>Google Search locale e referral proprietario</li></ol></article>
          <article className={styles.card}><h3>Garanzie sostenibili</h3><ul><li>Valutazione gratuita con ipotesi.</li><li>Recesso 30 giorni e handover documentato.</li><li>Report mensile entro data concordata.</li><li>Un interlocutore e una matrice di escalation.</li><li>Nessuna spesa terza sopra soglia senza approvazione.</li></ul></article>
        </div>
      </section>

      <section id="roadmap" className={styles.section}>
        <SectionHeader index="13" title="Roadmap 30 / 90 / 180 giorni">La capacità massima di 50 immobili non è un obiettivo commerciale ragionevole a sei mesi senza un portafoglio apportato. La roadmap usa soglie di qualità prima di autorizzare il volume.</SectionHeader>
        <div className={styles.roadmap}>
          <article><span>0–30 giorni · Quick wins</span><h3>Rendere credibile</h3><ul><li>Tradurre nativamente tutto il funnel in italiano.</li><li>Rimuovere +71%, testimonial provvisori e “nessun immobile”.</li><li>Landing Genova + form breve + WhatsApp/telefono.</li><li>Fac-simile report, Traveler Select, incident playbook.</li><li>Definire offerta, commissione, costi e recesso.</li><li>Consent, analytics e conversion tracking.</li><li>Mappare 30 partner; qualificarne 10.</li></ul><div className={styles.gate}><b>Gate:</b> percorso misurato end-to-end, zero claim non provati, almeno due fornitori candidati per funzione critica.</div></article>
          <article><span>30–90 giorni</span><h3>Provare il sistema</h3><ul><li>Firmare 3–5 immobili faro, non qualsiasi immobile.</li><li>Attivare paid con 1.000 €/mese e due intenti.</li><li>Produrre il primo case log verificato, anche senza uplift.</li><li>Testare 6 ads: controllo, custodia, stima.</li><li>Avviare partner referral con recap mensile.</li><li>Misurare costo e margine per immobile.</li><li>Review operativa settimanale del team.</li></ul><div className={styles.gate}><b>Gate:</b> onboarding ≤21 giorni, reporting puntuale, incidenti tracciati, margine di contribuzione positivo per immobile.</div></article>
          <article><span>90–180 giorni</span><h3>Scalare con densità</h3><ul><li>Target base 12–20 immobili attivi.</li><li>Cercare 2–4 proprietari portafoglio, non 30 lead isolati.</li><li>Formalizzare rete partner e backup.</li><li>Automatizzare Command Center e Passaporto.</li><li>Creare owner review trimestrale e referral.</li><li>Aggiungere coordinamento operativo prima del sovraccarico.</li><li>Passare a 50 solo con contratto portafoglio e gate verdi.</li></ul><div className={styles.gate}><b>Gate 50:</b> 2 backup critici, rating ospiti ≥4,8, issue SLA ≥95%, churn proprietari &lt;2%/mese e margine ≥40% sul perimetro definito.</div></article>
        </div>
        <div className={styles.tableWrap} style={{marginTop:18}}><table className={styles.table}><thead><tr><th>KPI primario</th><th>Definizione</th><th>Driver</th><th>Guardrail</th><th>Cadence</th></tr></thead><tbody>
          <tr><td><b>Immobili attivi profittevoli</b></td><td>Unità live con margine di contribuzione positivo dopo costi variabili.</td><td>Nuove firme, tempo onboarding, GMV/unità.</td><td>Nessun volume che abbassi qualità o SLA.</td><td>Settimanale</td></tr>
          <tr><td><b>Margine di contribuzione</b></td><td>(Ricavi gestione − costi variabili attribuibili) / ricavi gestione.</td><td>Commissione, densità, costo partner, incidenti.</td><td>Costi fissi e compenso founder separati.</td><td>Mensile</td></tr>
          <tr><td><b>Fiducia proprietario</b></td><td>Retention, NPS/CSAT e issue chiuse entro SLA.</td><td>Reporting puntuale, tempo risposta, decisioni tracciate.</td><td>Rating ospite, danni, reclami vicinato.</td><td>Mensile / trimestrale</td></tr>
          <tr><td><b>Pipeline ponderata</b></td><td>Unità potenziali × probabilità di fase, non semplice numero di lead.</td><td>Partner attivi, call qualificate, proposte.</td><td>CAC e fit premium.</td><td>Settimanale</td></tr>
        </tbody></table></div>
      </section>

      <section id="fonti" className={styles.section}>
        <SectionHeader index="14" title="Fonti, convergenze e limiti">A = istituzionale; B = fonte primaria di marca o trasparenza pubblicitaria; C = recensioni auto-selezionate; D = segnale sociale debole. Tutte le fonti sono gratuite e consultate il 5 agosto 2026.</SectionHeader>
        <div className={styles.legend}><span>A · alta affidabilità fattuale</span><span>B · affidabilità sulle dichiarazioni del brand</span><span>C · qualitativo, non rappresentativo</span><span>D · esplorativo / copertura parziale</span></div>
        <div className={styles.sources}>{sources.map(([grade,title,url,note])=><article className={styles.source} key={title}><a href={url} target="_blank" rel="noreferrer"><b>{grade} · {title}</b></a><span>{note}</span></article>)}</div>
        <div className={styles.footerNote}><strong>Metodo e limiti.</strong> NotebookLM utilizza 10 fonti esistenti già pronte; non è stata aggiunta alcuna fonte. La ricerca last30days copre 90 giorni, ma Reddit è parziale (HTTP 429) e YouTube non ha restituito risultati pertinenti: da questa copertura non si deduce l’assenza di discussione. Punteggi, target del funnel, prezzi Aurevia e scenari economici sono raccomandazioni o ipotesi, non fatti di mercato. Gli obblighi normativi richiedono la verifica di commercialista, avvocato e autorità competenti.</div>
      </section>
    </main>
  </div>;
}
