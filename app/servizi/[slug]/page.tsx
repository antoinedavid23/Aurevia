import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, CircleDot, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/ServiceJourney";
import { services } from "@/data/content";

const specifics: Record<string,{challenge:string;included:string[];owner:string[];notIncluded:string[]}> = {
  "gestione-proprieta":{challenge:"Coordonner seul les voyageurs, le calendrier, les prestataires et les imprévus exige une disponibilité constante.",included:["Audit opérationnel du bien","Paramétrage du calendrier et des règles","Coordination des réservations","Suivi des arrivées et départs","Contrôle des prestations","Gestion des incidents","Compte rendu propriétaire","Interlocuteur unique"],owner:["Vision claire de l’activité","Décisions documentées","Disponibilité préservée"],notIncluded:["Ménage et linge facturés selon utilisation","Travaux et pièces sur validation préalable"]},
  "concierge":{challenge:"Les demandes particulières peuvent rapidement mobiliser plusieurs interlocuteurs et fragiliser l’expérience.",included:["Qualification de la demande","Recherche de solutions adaptées","Sélection des partenaires","Présentation des options et tarifs","Réservation après validation","Coordination des horaires","Suivi de la prestation","Assistance en cas d’ajustement"],owner:["Une réponse centralisée","Des coûts annoncés avant engagement","Un suivi jusqu’à la réalisation"],notIncluded:["Prestations tierces facturées séparément","Services soumis à disponibilité"]},
  "accoglienza-voyageurs":{challenge:"La première impression se joue avant même l’ouverture de la porte.",included:["Collecte des informations d’arrivée","Instructions personnalisées","Préparation des accès","Contrôle préalable du logement","Accueil ou arrivée autonome encadrée","Présentation des équipements","Disponibilité pendant l’installation","Suivi après l’arrivée"],owner:["Un parcours cohérent","Moins de sollicitations directes","Une image de marque maîtrisée"],notIncluded:["Transferts et bagagerie sur devis","Accueil tardif selon conditions convenues"]},
  "pulizie-biancheria":{challenge:"La régularité du ménage et du linge conditionne directement la satisfaction des voyageurs.",included:["Planning des rotations","Brief de préparation par pièce","Coordination des équipes","Contrôle visuel","Suivi du linge","Signalement des dégradations","Réassort selon inventaire","Correction des écarts identifiés"],owner:["Standards constants","Traçabilité des anomalies","Bien prêt à chaque arrivée"],notIncluded:["Ménage, blanchisserie et consommables facturés séparément","Nettoyages techniques sur devis"]},
  "manutenzione":{challenge:"Une petite anomalie non suivie peut devenir une intervention urgente et coûteuse.",included:["Registre des équipements","Contrôles préventifs convenus","Qualification des incidents","Recherche d’un intervenant","Présentation du devis","Planification après accord","Suivi de l’intervention","Compte rendu et justificatifs"],owner:["Décisions prises en connaissance de cause","Historique des interventions","Réseau local coordonné"],notIncluded:["Main-d’œuvre, pièces et matériaux facturés séparément","Urgences traitées selon disponibilité des artisans"]},
  "revenue-management":{challenge:"Un tarif fixe ne reflète ni la saison, ni la demande, ni les caractéristiques réelles du séjour.",included:["Analyse du positionnement","Segmentation des périodes","Tarifs par saison et événements","Règles de durée de séjour","Ajustements selon la demande","Suivi du rythme des réservations","Tests de présentation","Bilan périodique"],owner:["Stratégie compréhensible","Arbitrages expliqués","Potentiel suivi dans le temps"],notIncluded:["Aucun revenu n’est garanti","Les projections restent indicatives"]},
  "sicurezza":{challenge:"La protection du bien repose sur des procédures simples, connues et répétées.",included:["Inventaire initial","Gestion des accès","Consignes aux voyageurs","Contrôles après séjour","Signalement documenté","Coordination en cas d’incident","Suivi des équipements sensibles","Mise à jour des procédures"],owner:["Accès mieux maîtrisés","Incidents documentés","Cadre d’intervention clair"],notIncluded:["Assurance et télésurveillance non incluses","Équipements de sécurité sur devis"]},
  "amministrazione":{challenge:"Sans reporting structuré, le propriétaire manque de visibilité sur l’activité et les décisions prises.",included:["Centralisation des réservations","Suivi des prestations","Classement des justificatifs","Synthèse de l’activité","Historique des incidents","Relevé des décisions","Reporting consolidé","Préparation des éléments utiles au propriétaire"],owner:["Information accessible","Suivi régulier","Un historique exploitable"],notIncluded:["Conseil comptable, fiscal ou juridique non inclus","Documents à valider avec vos professionnels"]},
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
    promise: "Vous conservez la maîtrise des décisions. AUREVIA porte la coordination, le suivi et la continuité opérationnelle.",
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
    promise: "Une demande privée devient un parcours simple : options qualifiées, coûts annoncés et coordination jusqu’à la réalisation.",
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
    promise: "Chaque arrivée suit un parcours préparé, rassurant et cohérent avec le caractère de votre propriété.",
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
    promise: "Nous ne nous contentons pas de planifier l’entretien : nous définissons le standard attendu et contrôlons son application.",
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
    promise: "Chaque anomalie est qualifiée, chaque dépense est encadrée et chaque intervention reste traçable.",
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
    promise: "Une stratégie lisible ajuste tarifs, calendrier et durées de séjour sans dénaturer le positionnement du bien.",
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
    promise: "Des accès maîtrisés, des contrôles documentés et une procédure connue lorsque quelque chose sort du cadre.",
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
    promise: "L’activité du bien devient lisible : réservations, prestations, incidents, décisions et justificatifs sont réunis au même endroit.",
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

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const service=services.find(item=>item.slug===slug);
  const detail=specifics[slug];
  const experience=experiences[slug];
  if(!service||!detail||!experience)notFound();
  return <>
    <PageHero label="Services" title={service.title} text={service.short} image={service.image}/>
    <section className="content-section ivory"><div className="container service-detail-intro">
      <div><p className="eyebrow dark">Pourquoi ce service compte</p><h2>{experience.promise}</h2></div>
      <div><p className="service-lead">{detail.challenge}</p><p>AUREVIA définit avec vous le périmètre, les validations nécessaires et le niveau de compte rendu. Vous savez ce que nous faisons, quand nous intervenons et quels frais peuvent rester séparés.</p></div>
    </div></section>
    <section className="content-section"><div className="container">
      <p className="eyebrow">Prise en charge</p><h2>Ce que nous orchestrons pour vous</h2>
      <div className="detail-list-grid">{detail.included.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div>
    </div></section>
    <section className="content-section service-journey-section"><div className="container">
      <div className="service-section-heading"><p className="eyebrow">Votre parcours</p><h2>Vous savez toujours ce qui se passe ensuite.</h2><p>Explorez les quatre étapes du service pour comprendre précisément notre méthode.</p></div>
      <ServiceJourney steps={experience.steps}/>
    </div></section>
    <section className="content-section ivory"><div className="container">
      <div className="service-section-heading dark-heading"><p className="eyebrow dark">Responsabilités</p><h2>Un rôle clair pour chaque interlocuteur</h2></div>
      <div className="responsibility-grid">
        <article><ShieldCheck/><span>01</span><h3>AUREVIA coordonne</h3><ul>{detail.included.slice(0,3).map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul></article>
        <article><CircleDot/><span>02</span><h3>Vous validez</h3><ul>{experience.ownerValidates.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul></article>
        <article><FileText/><span>03</span><h3>Les partenaires réalisent</h3><ul>{experience.partners.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul></article>
      </div>
    </div></section>
    <section className="content-section service-proof-section"><div className="container service-proof-grid">
      <div><p className="eyebrow">Ce que vous recevez</p><h2>Des éléments concrets, pas seulement une promesse.</h2><ul className="service-deliverables">{detail.owner.map(item=><li key={item}><Check size={17}/>{item}</li>)}</ul></div>
      <article className="service-scenario"><span>Cas d’usage</span><h3>{experience.scenario.title}</h3><p>{experience.scenario.text}</p><strong>{experience.scenario.result}</strong></article>
    </div></section>
    <section className="content-section ivory"><div className="container transparency-grid">
      <div><p className="eyebrow dark">Transparence</p><h2>Ce qui reste séparé est annoncé dès le départ.</h2><p>Le périmètre, les délais de réponse et les règles de validation figurent dans votre proposition personnalisée.</p></div>
      <div className="transparency-card"><p className="eyebrow dark">À savoir</p><h3>Un cadre sans ambiguïté</h3><ul>{detail.notIncluded.map(item=><li key={item}>{item}</li>)}</ul></div>
    </div></section>
    <section className="section final-cta service-final-cta"><p className="eyebrow">Étude confidentielle</p><h2>{experience.cta}</h2><p>Présentez-nous votre propriété. Nous vous répondrons avec un périmètre clair, adapté à votre situation.</p><Link className="button" href="/valutazione">{experience.cta} <ArrowRight size={16}/></Link></section>
  </>;
}
