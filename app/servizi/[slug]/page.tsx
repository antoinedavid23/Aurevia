import { notFound } from "next/navigation";
import { Check, CircleDot, FileText, ShieldCheck } from "lucide-react";
import { CTA, PageHero } from "@/components/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/ServiceJourney";
import { services } from "@/data/content";
import type { Metadata } from "next";
import { translate } from "@/lib/i18n";

const specifics: Record<string,{challenge:string;included:string[];owner:string[];notIncluded:string[]}> = {
  "gestione-proprieta":{challenge:"À distance, votre bien ne devrait pas devenir une succession de messages, de relances et d’imprévus à résoudre.",included:["Découverte complète de votre bien","Mise en place du calendrier et des règles","Suivi des réservations","Organisation des arrivées et des départs","Coordination des intervenants","Prise en charge des imprévus","Compte rendu régulier","Un seul interlocuteur pour tout"],owner:["Une vision claire, sans surcharge","Des décisions prises au bon moment","Le temps de profiter de votre bien"],notIncluded:["Ménage et linge facturés au réel, sans marge","Travaux et pièces engagés après votre accord"]},
  "concierge":{challenge:"Une attention particulière n’a de valeur que si elle paraît simple, naturelle et parfaitement organisée.",included:["Écoute précise de la demande","Recherche d’options réellement adaptées","Choix de partenaires de confiance","Présentation claire des possibilités et des tarifs","Réservation après votre accord","Organisation des horaires et des accès","Suivi jusqu’au dernier détail","Présence en cas de changement"],owner:["Une demande, un interlocuteur","Des tarifs connus avant de décider","Une expérience suivie jusqu’au bout"],notIncluded:["Prestations des partenaires facturées séparément","Services proposés selon les disponibilités"]},
  "accoglienza-voyageurs":{challenge:"L’expérience commence avant la porte : dans la fluidité des échanges, la justesse des attentions et le sentiment d’être attendu.",included:["Préparation personnalisée de l’arrivée","Instructions simples et précises","Organisation des accès","Dernier contrôle du bien","Accueil sur place ou arrivée autonome accompagnée","Présentation des essentiels","Disponibilité pendant l’installation","Attention portée aux premières heures"],owner:["Des voyageurs attendus, jamais livrés à eux-mêmes","Moins de sollicitations pour vous","Une qualité d’accueil fidèle à votre bien"],notIncluded:["Transferts et bagagerie proposés sur devis","Arrivées tardives organisées selon les conditions convenues"]},
  "pulizie-biancheria":{challenge:"Le soin se remarque immédiatement : un linge impeccable, une pièce parfaitement remise en place, rien qui rompe l’harmonie du lieu.",included:["Organisation de chaque rotation","Consignes propres à chaque pièce","Coordination des équipes","Contrôle après intervention","Suivi précis du linge","Repérage des dégradations","Réassort selon l’inventaire","Correction avant la prochaine arrivée"],owner:["Le même niveau de soin à chaque séjour","Les anomalies repérées sans attendre","Un bien toujours prêt à recevoir"],notIncluded:["Ménage, linge et consommables facturés au réel, sans marge","Nettoyages spécifiques proposés sur devis"]},
  "manutenzione":{challenge:"Un détail remarqué à temps reste un détail. Ignoré, il finit souvent par troubler un séjour ou abîmer le bien.",included:["Suivi des équipements essentiels","Contrôles préventifs convenus","Évaluation rapide de chaque anomalie","Recherche de l’artisan adapté","Devis présenté avant intervention","Organisation après votre accord","Présence pendant l’intervention","Compte rendu avec justificatifs"],owner:["Les bonnes informations pour décider","Une mémoire claire de chaque intervention","Des artisans coordonnés sur place"],notIncluded:["Main-d’œuvre, pièces et matériaux facturés au réel, sans marge","Urgences prises en charge selon la disponibilité des artisans"]},
  "revenue-management":{challenge:"Le juste prix évolue avec la saison, la demande et la manière dont votre bien est présenté — jamais au détriment de son positionnement.",included:["Lecture du positionnement actuel","Identification des temps forts et des périodes calmes","Tarifs adaptés aux saisons et aux événements","Durées de séjour pensées avec cohérence","Ajustements selon la demande réelle","Suivi du rythme des réservations","Amélioration continue de la présentation","Bilan régulier et lisible"],owner:["Une stratégie que vous comprenez","Chaque ajustement expliqué","Un potentiel suivi dans la durée"],notIncluded:["Aucune promesse de revenu garanti","Toutes les projections restent indicatives"]},
  "sicurezza":{challenge:"Protéger un bien, c’est d’abord savoir qui y accède, ce qui a changé et quoi faire lorsqu’un détail sort du cadre.",included:["Inventaire de départ","Suivi des clés, badges et accès","Consignes claires aux voyageurs","Vérification après chaque séjour","Signalement précis des écarts","Coordination en cas d’incident","Surveillance des équipements sensibles","Procédures tenues à jour"],owner:["Des accès suivis avec rigueur","Une information rapide en cas d’écart","Une réponse connue à l’avance"],notIncluded:["Assurance et télésurveillance non comprises","Équipements de sécurité proposés sur devis"]},
  "amministrazione":{challenge:"Vous devez pouvoir comprendre la vie de votre bien sans rechercher une information dans des dizaines de messages.",included:["Réservations réunies au même endroit","Prestations suivies et rapprochées","Justificatifs classés","Synthèse claire de l’activité","Mémoire des incidents","Décisions conservées","Compte rendu consolidé","Éléments utiles préparés pour vous"],owner:["L’essentiel accessible immédiatement","Un point régulier, sans bruit inutile","L’historique de votre bien préservé"],notIncluded:["Conseil comptable, fiscal ou juridique non compris","Documents spécialisés à valider avec vos conseils"]},
};

const quickHeadlines: Record<string,string> = {
  "gestione-proprieta":"Votre bien suivi, sans avoir à tout suivre.",
  "concierge":"Une demande particulière, simplement orchestrée.",
  "accoglienza-voyageurs":"Une arrivée qui donne immédiatement le ton.",
  "pulizie-biancheria":"Le même niveau d’exigence, à chaque séjour.",
  "manutenzione":"Agir avant que le détail ne devienne un problème.",
  "revenue-management":"Le juste prix, au bon moment.",
  "sicurezza":"Savoir que tout est en ordre.",
  "amministrazione":"Une gestion lisible, sans documents dispersés.",
};

type ServiceExperience = {
  promise: string;
  steps: ServiceJourneyStep[];
  ownerValidates: string[];
  partners: string[];
  scenario: { title: string; text: string; result: string };
  cta: string;
};

const experiences: Record<string, ServiceExperience> = {
  "gestione-proprieta": {
    promise: "Vous gardez la main sur les décisions qui comptent. Nous prenons en charge le quotidien, les échanges et les imprévus, avec la même attention que si vous étiez sur place.",
    steps: [
      {title:"Comprendre le bien",timing:"Visite initiale",text:"Nous étudions les usages, les accès, les équipements et vos périodes d’occupation avant de définir le moindre processus.",points:["Inventaire des besoins","Contraintes et priorités","Niveau de délégation"]},
      {title:"Définir le cadre",timing:"Proposition dédiée",text:"Les responsabilités, validations, délais de réponse et frais séparés sont formalisés dans une proposition lisible.",points:["Périmètre documenté","Règles de validation","Rythme des comptes rendus"]},
      {title:"Installer les standards",timing:"Mise en place",text:"Calendrier, partenaires, accès et procédures sont réunis pour que chaque intervention suive le même niveau d’exigence.",points:["Calendrier centralisé","Procédures partagées","Interlocuteur unique"]},
      {title:"Piloter au quotidien",timing:"En continu",text:"Nous coordonnons l’activité, documentons les décisions et vous informons sans multiplier les sollicitations.",points:["Suivi opérationnel","Gestion des incidents","Synthèse propriétaire"]},
    ],
    ownerValidates:["Le périmètre et les règles de délégation","Les dépenses et travaux soumis à accord"],
    partners:["Les prestations planifiées","Les interventions selon les standards convenus"],
    scenario:{title:"Un imprévu, un seul interlocuteur",text:"Une anomalie est signalée entre deux séjours. AUREVIA qualifie la situation, organise la réponse, sollicite votre validation si nécessaire et suit sa résolution.",result:"Vous recevez une information claire et le bien reste prêt, sans avoir à coordonner plusieurs personnes."},
    cta:"Faire analyser la gestion de mon bien",
  },
  "concierge": {
    promise: "Vous nous confiez une envie ou un besoin. Nous trouvons la réponse juste, vous la présentons clairement et veillons à sa réalisation.",
    steps: [
      {title:"Qualifier la demande",timing:"Dès réception",text:"Nous précisons le besoin, les préférences, le calendrier et le niveau de service attendu.",points:["Attentes clarifiées","Contraintes identifiées","Budget indicatif"]},
      {title:"Sélectionner les options",timing:"Recherche ciblée",text:"Nous consultons des partenaires adaptés et vérifions la disponibilité avant de vous présenter une sélection courte.",points:["Partenaires qualifiés","Options comparables","Tarifs annoncés"]},
      {title:"Valider et réserver",timing:"Après votre accord",text:"Aucun engagement n’est pris sans validation. Une fois l’option choisie, nous confirmons chaque détail.",points:["Choix propriétaire","Conditions confirmées","Planning verrouillé"]},
      {title:"Coordonner l’expérience",timing:"Jusqu’à la réalisation",text:"Horaires, accès et ajustements sont suivis par AUREVIA, avec un point de contrôle après la prestation.",points:["Interlocuteur central","Suivi des horaires","Retour de réalisation"]},
    ],
    ownerValidates:["L’option et le tarif présentés","Toute modification substantielle"],
    partners:["La réalisation de la prestation","Le respect des conditions confirmées"],
    scenario:{title:"Une demande particulière, sans dispersion",text:"Un voyageur souhaite un dîner privé avec peu de préavis. Nous qualifions le besoin, présentons une option disponible et coordonnons l’accès au bien après validation.",result:"La demande est traitée dans un cadre maîtrisé, sans solliciter directement le propriétaire."},
    cta:"Définir mon service de conciergerie",
  },
  "accoglienza-voyageurs": {
    promise: "Chaque voyageur doit sentir qu’il était attendu. Nous préparons une arrivée fluide, attentive et fidèle au caractère de votre bien.",
    steps: [
      {title:"Préparer l’arrivée",timing:"Avant le séjour",text:"Les horaires, profils et besoins utiles sont recueillis afin d’anticiper l’accès et la préparation du logement.",points:["Informations centralisées","Mode d’arrivée défini","Consignes personnalisées"]},
      {title:"Contrôler le bien",timing:"Avant ouverture",text:"Les accès et équipements essentiels sont vérifiés avant que le voyageur ne franchisse la porte.",points:["Contrôle visuel","Accès testés","Équipements prioritaires vérifiés"]},
      {title:"Accueillir",timing:"Jour d’arrivée",text:"L’arrivée est accompagnée sur place ou à distance selon le cadre choisi, avec des instructions claires.",points:["Remise des accès","Présentation du bien","Réponse aux premières questions"]},
      {title:"Confirmer l’installation",timing:"Après l’arrivée",text:"Un suivi discret permet de vérifier que tout est compris et de traiter rapidement un éventuel besoin.",points:["Message de suivi","Assistance initiale","Information propriétaire si nécessaire"]},
    ],
    ownerValidates:["Le mode d’accueil retenu","Les règles particulières de la propriété"],
    partners:["La préparation conforme du logement","Les services complémentaires validés"],
    scenario:{title:"Une arrivée tardive, sans improvisation",text:"Le voyageur annonce un retard. Les accès sont adaptés, les instructions mises à jour et l’installation suivie à distance selon le protocole convenu.",result:"Le voyageur est attendu et le propriétaire n’a pas à gérer le changement d’horaire."},
    cta:"Concevoir mon parcours d’accueil",
  },
  "pulizie-biancheria": {
    promise: "Nous connaissons la place de chaque chose et le niveau de soin attendu. Après chaque séjour, votre bien retrouve son équilibre.",
    steps: [
      {title:"Définir le standard",timing:"Au démarrage",text:"Chaque pièce, équipement et attention particulière est intégré à une fiche de préparation propre au bien.",points:["Checklist par zone","Inventaire du linge","Niveau de présentation attendu"]},
      {title:"Planifier la rotation",timing:"Selon le calendrier",text:"Les équipes, créneaux et besoins en linge sont coordonnés entre les départs et les prochaines arrivées.",points:["Planning synchronisé","Consignes transmises","Réassort anticipé"]},
      {title:"Contrôler le résultat",timing:"Après préparation",text:"Les points essentiels sont vérifiés et les anomalies ou dégradations sont signalées.",points:["Contrôle visuel","Écarts documentés","Inventaire actualisé"]},
      {title:"Corriger et suivre",timing:"Avant l’arrivée",text:"Lorsqu’un écart est identifié, une action corrective est organisée avant la remise à disposition du bien.",points:["Correction coordonnée","Bien prêt à recevoir","Historique conservé"]},
    ],
    ownerValidates:["Le standard de préparation","Les consommables et prestations spécifiques"],
    partners:["Le ménage et la blanchisserie","La remise en conformité signalée"],
    scenario:{title:"Un contrôle qui évite une mauvaise première impression",text:"Après une rotation, un élément de linge manque et une anomalie est relevée dans une chambre. L’équipe intervient avant l’arrivée suivante.",result:"Le bien retrouve le niveau convenu et l’incident reste documenté."},
    cta:"Définir le standard de mon bien",
  },
  "manutenzione": {
    promise: "Nous remarquons ce qui change, trouvons la bonne personne et suivons l’intervention. Vous décidez avec une information claire, jamais dans l’urgence.",
    steps: [
      {title:"Qualifier l’anomalie",timing:"Dès le signalement",text:"Nous distinguons l’urgence, l’inconfort et l’entretien planifiable afin d’engager la réponse adaptée.",points:["Niveau de priorité","Premières vérifications","Information structurée"]},
      {title:"Présenter la solution",timing:"Avant engagement",text:"Un intervenant adapté est recherché et le devis vous est présenté lorsque la situation le permet.",points:["Prestataire sélectionné","Coût annoncé","Accord documenté"]},
      {title:"Suivre l’intervention",timing:"Après validation",text:"Accès, horaires et réalisation sont coordonnés pour limiter l’impact sur le bien et les séjours.",points:["Accès organisé","Intervention suivie","Échanges centralisés"]},
      {title:"Contrôler et archiver",timing:"À la clôture",text:"Le résultat, les justificatifs et les recommandations utiles rejoignent l’historique de la propriété.",points:["Compte rendu","Justificatifs classés","Suivi préventif"]},
    ],
    ownerValidates:["Le devis et les travaux non urgents","Les recommandations de remplacement"],
    partners:["Le diagnostic technique","La main-d’œuvre et les pièces"],
    scenario:{title:"Une fuite détectée avant qu’elle ne s’aggrave",text:"Une trace d’humidité est repérée pendant un contrôle. AUREVIA documente l’anomalie, contacte un professionnel et soumet la solution proposée.",result:"La décision est prise avec les bonnes informations et l’intervention reste entièrement suivie."},
    cta:"Évaluer mes besoins de maintenance",
  },
  "revenue-management": {
    promise: "Nous faisons évoluer les tarifs et les conditions de séjour avec mesure, pour mieux valoriser votre bien sans banaliser son image.",
    steps: [
      {title:"Établir la situation",timing:"Analyse initiale",text:"Nous observons le bien, ses disponibilités, son historique et son environnement concurrentiel.",points:["Positionnement actuel","Périodes disponibles","Contraintes d’exploitation"]},
      {title:"Construire la stratégie",timing:"Plan tarifaire",text:"Saisons, événements, durées minimales et règles de réservation sont organisés dans un cadre compréhensible.",points:["Tarifs par période","Règles de séjour","Objectifs suivis"]},
      {title:"Ajuster la demande",timing:"Suivi régulier",text:"Le rythme des réservations et les disponibilités restantes guident les ajustements de tarif et de calendrier.",points:["Tarification dynamique","Occupation surveillée","Arbitrages expliqués"]},
      {title:"Mesurer et décider",timing:"Bilan périodique",text:"Les résultats sont rapprochés de la situation initiale afin d’identifier les actions réellement utiles.",points:["Revenus et occupation","Tarif moyen","Décisions documentées"]},
    ],
    ownerValidates:["Les périodes d’usage personnel","Le positionnement et les règles sensibles"],
    partners:["La diffusion des annonces","Les services externes éventuellement retenus"],
    scenario:{title:"Mieux valoriser une période encore disponible",text:"Le rythme de réservation ralentit sur une période donnée. Les règles de séjour et le tarif sont réexaminés dans la limite du positionnement convenu.",result:"L’ajustement est explicable, mesurable et ne repose jamais sur une promesse de revenu garanti."},
    cta:"Étudier le potentiel de mon bien",
  },
  "sicurezza": {
    promise: "Les accès sont suivis, les écarts remarqués et les actions connues à l’avance. Vous savez que votre bien reste entre de bonnes mains.",
    steps: [
      {title:"Cartographier les accès",timing:"Inventaire initial",text:"Clés, badges, équipements sensibles et personnes autorisées sont recensés dans un cadre confidentiel.",points:["Accès identifiés","Détenteurs connus","Consignes centralisées"]},
      {title:"Définir les procédures",timing:"Avant exploitation",text:"Les règles d’entrée, de sortie et de signalement sont adaptées aux caractéristiques du bien.",points:["Consignes voyageurs","Contrôles attendus","Chaîne d’alerte"]},
      {title:"Contrôler les mouvements",timing:"À chaque rotation",text:"Les accès et points sensibles convenus sont vérifiés, avec documentation des écarts éventuels.",points:["Retour des accès","Contrôle ciblé","Écart signalé"]},
      {title:"Réagir et documenter",timing:"En cas d’incident",text:"La situation est sécurisée dans notre périmètre, les interlocuteurs utiles sont mobilisés et le propriétaire informé.",points:["Information rapide","Actions tracées","Procédure mise à jour"]},
    ],
    ownerValidates:["Les personnes autorisées","Les équipements ou services complémentaires"],
    partners:["Les équipements spécialisés","La télésurveillance ou l’assurance si souscrites"],
    scenario:{title:"Un accès manquant, traité sans approximation",text:"À la fin d’un séjour, un accès n’est pas restitué. Le protocole convenu est déclenché et les actions nécessaires sont documentées.",result:"Le propriétaire sait immédiatement ce qui s’est passé et quelles mesures ont été prises."},
    cta:"Sécuriser le fonctionnement de mon bien",
  },
  "amministrazione": {
    promise: "Vous retrouvez l’essentiel de la vie de votre bien dans une lecture simple : ce qui a été fait, ce qui mérite votre attention et ce qui vient ensuite.",
    steps: [
      {title:"Centraliser l’activité",timing:"En continu",text:"Les informations utiles sont regroupées afin d’éviter les documents dispersés et les décisions sans contexte.",points:["Réservations suivies","Prestations rapprochées","Incidents historisés"]},
      {title:"Classer les éléments",timing:"Après chaque opération",text:"Justificatifs, validations et comptes rendus sont associés à l’action correspondante.",points:["Documents structurés","Décisions tracées","Historique exploitable"]},
      {title:"Produire la synthèse",timing:"Selon la fréquence convenue",text:"Le propriétaire reçoit une lecture condensée de l’activité et des sujets nécessitant son attention.",points:["Activité de la période","Dépenses et interventions","Points à décider"]},
      {title:"Préparer la suite",timing:"À chaque bilan",text:"Les actions à venir sont identifiées sans empiéter sur le rôle de vos conseils comptables, fiscaux ou juridiques.",points:["Priorités suivantes","Documents disponibles","Périmètre respecté"]},
    ],
    ownerValidates:["Les décisions et dépenses présentées","Le partage avec ses conseils professionnels"],
    partners:["La transmission de leurs justificatifs","Les documents relevant de leur responsabilité"],
    scenario:{title:"Un mois d’activité résumé sans zone d’ombre",text:"Réservations, entretien et intervention technique ont généré plusieurs échanges. AUREVIA les rassemble dans une synthèse structurée.",result:"Le propriétaire retrouve les décisions, justificatifs et points de suivi sans reconstituer lui-même l’historique."},
    cta:"Organiser le suivi de ma propriété",
  },
};

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const service=services.find(item=>item.slug===slug);
  if(!service)return {};
  return {title:translate(service.title,"it"),description:translate(service.short,"it"),alternates:{canonical:`/servizi/${slug}`}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const service=services.find(item=>item.slug===slug);
  const detail=specifics[slug];
  const experience=experiences[slug];
  if(!service||!detail||!experience)notFound();
  return <>
    <PageHero label="Services" title={service.title} text={service.short} image={service.image}/>
    <section className="content-section ivory"><div className="container service-detail-intro">
      <div><p className="eyebrow dark">L’essentiel</p><h2>{quickHeadlines[slug]}</h2></div>
      <div><p className="service-lead">{experience.promise}</p><p>{detail.challenge}</p></div>
      <div className="service-at-glance">{detail.owner.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></article>)}</div>
    </div></section>
    <section className="content-section"><div className="container">
      <p className="eyebrow">Dans le détail</p><h2>Ce que nous prenons en charge</h2>
      <div className="detail-list-grid">{detail.included.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div>
    </div></section>
    <section className="content-section service-journey-section"><div className="container">
      <div className="service-section-heading"><p className="eyebrow">Notre manière de faire</p><h2>Un déroulement simple, du premier échange au suivi quotidien.</h2><p>Parcourez chaque étape pour voir concrètement comment nous intervenons.</p></div>
      <ServiceJourney steps={experience.steps}/>
    </div></section>
    <section className="content-section ivory"><div className="container">
      <div className="service-section-heading dark-heading"><p className="eyebrow dark">Qui fait quoi</p><h2>Vous décidez. Nous coordonnons.</h2></div>
      <div className="responsibility-grid">
        <article><ShieldCheck/><span>01</span><h3>Nous prenons en charge</h3><ul>{detail.included.slice(0,3).map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul></article>
        <article><CircleDot/><span>02</span><h3>Vous validez</h3><ul>{experience.ownerValidates.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul></article>
        <article><FileText/><span>03</span><h3>Les partenaires réalisent</h3><ul>{experience.partners.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul></article>
      </div>
    </div></section>
    <section className="content-section service-proof-section"><div className="container service-proof-grid">
      <div><p className="eyebrow">Pour vous, concrètement</p><h2>Plus de visibilité. Moins de charge au quotidien.</h2><ul className="service-deliverables">{detail.owner.map(item=><li key={item}><Check size={17}/>{item}</li>)}</ul></div>
      <article className="service-scenario"><span>Cas d’usage</span><h3>{experience.scenario.title}</h3><p>{experience.scenario.text}</p><strong>{experience.scenario.result}</strong></article>
    </div></section>
    <section className="content-section ivory"><div className="container transparency-grid">
      <div><p className="eyebrow dark">En toute clarté</p><h2>Vous savez dès le départ ce qui est compris.</h2><p>Votre proposition précise notre intervention, les délais convenus et les décisions qui nécessitent votre accord.</p></div>
      <div className="transparency-card"><p className="eyebrow dark">À prévoir séparément</p><h3>Aucune surprise en cours de route</h3><ul>{detail.notIncluded.map(item=><li key={item}>{item}</li>)}</ul></div>
    </div></section>
    <CTA/>
  </>;
}
