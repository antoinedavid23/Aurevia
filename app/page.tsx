import Link from "next/link";
import Image from "next/image";
import {ArrowRight,ShieldCheck} from "lucide-react";
import {properties,services} from "@/data/content";
import {Reveal} from "@/components/Reveal";
import {PropertyCard,ServiceCard} from "@/components/Cards";
import {MethodJourney,ReviewCards} from "@/components/InteractiveSections";

const promises=["Discrétion absolue","Gestion complète","Valeur optimisée","Hospitalité d’excellence","Accompagnement dédié"];

export default function Home(){
 return <>
  <section className="hero hero-aurevia">
   <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/images/home/hero-concierge.webp" aria-hidden="true">
    <source src="/videos/genova-hero.mp4" type="video/mp4"/>
   </video>
   <div className="container hero-content"><Reveal className="hero-brand">
    <div className="hero-logo-crop"><Image className="hero-logo" src="/images/brand/aurevia-logo-transparent-gold.png" width={720} height={720} priority alt="AUREVIA"/></div>
    <h1 className="sr-only">AUREVIA</h1>
    <p className="hero-slogan"><span>L’art de prendre soin</span><span>de ce qui compte.</span></p>
    <div className="actions"><Link className="button" href="/valutazione">Évaluer mon bien <ArrowRight size={16}/></Link><Link className="button ghost" href="/servizi">Découvrir nos services</Link></div>
    <small>Évaluation confidentielle, gratuite et sans engagement.</small>
   </Reveal></div>
  </section>

  <section className="trust-marquee" aria-label="Les engagements AUREVIA"><div className="trust-track">{[...promises,...promises].map((x,i)=><span key={`${x}-${i}`}>{x}<i>◆</i></span>)}</div></section>

  <section className="section ivory"><div className="container split">
   <Reveal className="editorial-card"><div className="image-placeholder image-photo home-owner"><span>Le soin jusque dans les détails</span></div></Reveal>
   <Reveal className="prose"><p className="eyebrow dark">Pour les propriétaires</p><h2>Un partenaire de confiance pour votre propriété</h2><p>AUREVIA accompagne les propriétaires exigeants qui souhaitent valoriser leur bien sans en gérer les contraintes quotidiennes.</p><ul className="feature-list"><li>Une relation privilégiée</li><li>Une prise en charge intégrale</li><li>Des standards d’exception</li><li>Une gestion sur mesure</li></ul><Link className="text-link" href="/proprietari">Découvrir l’approche AUREVIA <ArrowRight size={15}/></Link></Reveal>
  </div></section>

  <section className="section"><div className="container"><Reveal><p className="eyebrow">Services</p><h2>L’excellence dans chaque détail</h2></Reveal><div className="card-grid three">{services.slice(0,6).map(s=><ServiceCard key={s.slug} service={s}/>)}</div></div></section>

  <section className="section simulator-teaser simulator-photo"><div className="container split">
   <Reveal><p className="eyebrow">Simulateur privé</p><h2>Découvrez le potentiel de votre propriété</h2><p>Obtenez une première projection selon la localisation, le standing, les équipements et la période de disponibilité.</p><Link className="button" href="/simulatore">Essayer le simulateur <ArrowRight size={16}/></Link></Reveal>
   <Reveal className="estimate-card estimate-premium"><div className="estimate-brand"><span className="estimate-logo-crop" aria-hidden="true"><Image src="/images/brand/aurevia-logo-transparent-gold.png" width={160} height={160} alt=""/></span><span>Projection AUREVIA</span></div><p className="estimate-case">Cas illustratif · appartement 2 chambres à Gênes</p><div className="estimate-comparison"><div><small>Situation estimée avant gestion</small><b>29 800 €</b></div><i>→</i><div><small>Potentiel optimisé</small><strong>50 900 €</strong></div></div><div className="estimate-gain"><span>Progression indicative</span><b>+ 71 %</b></div><div><small>Tarif moyen par nuit (tarification dynamique)</small><b>265 € / nuit</b></div><div><small>Occupation projetée</small><b>64 % · 192 nuits</b></div><p>Projection illustrative avant frais, fiscalité et interventions. Une analyse personnalisée reste indispensable.</p></Reveal>
  </div></section>

  <section className="section home-gallery ivory"><div className="container">
   <Reveal className="experience-intro"><p className="eyebrow dark">L’expérience propriétaire</p><h2>Vous partez.<br /><span>Elle reste entre de bonnes mains.</span></h2></Reveal>
   <div className="experience-mosaic">
    <div className="visual visual-bedroom experience-visual experience-visual-main"><span><b>01</b><i>Comme si vous étiez là<small>Votre bien est connu, préparé et suivi jusque dans ses habitudes.</small></i></span></div>
    <Reveal className="experience-text experience-text-light"><p className="eyebrow dark">Ce que vous ressentez</p><h3>Le calme de ne plus avoir à y penser.</h3><p>Une propriété continue de vivre en votre absence. AUREVIA reste sur place, remarque ce qui change et agit avant que le détail ne devienne une contrainte.</p></Reveal>
    <div className="visual visual-coast experience-visual"><span><b>02</b><i>Présent, sans être envahissant<small>Vous recevez l’information utile, jamais le bruit du quotidien.</small></i></span></div>
    <Reveal className="experience-text experience-text-dark"><p className="eyebrow">Ce qui reste entre vos mains</p><h3>Les décisions importantes. Rien de plus.</h3><p>Vous gardez la maîtrise de votre propriété. Nous portons les réservations, les prestataires et les imprévus, puis nous revenons vers vous lorsqu’un choix mérite réellement votre attention.</p></Reveal>
    <div className="visual visual-night experience-visual"><span><b>03</b><i>Veillé dans la durée<small>Chaque action préserve le caractère, l’état et la valeur du lieu.</small></i></span></div>
    <div className="visual visual-key experience-visual"><span><b>04</b><i>Prêt à vous retrouver<small>À votre retour, la propriété est exactement comme vous souhaitez la retrouver.</small></i></span></div>
   </div>
   <Link className="text-link identity-link" href="/proprietari">Découvrir votre expérience AUREVIA <ArrowRight size={15}/></Link>
  </div></section>

  <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">Collection de démonstration</p><h2>Propriétés sélectionnées</h2></Reveal><div className="card-grid three">{properties.slice(0,3).map(p=><PropertyCard key={p.slug} property={p}/>)}</div><p className="demo-note">Images et propriétés présentées à titre démonstratif.</p></div></section>

  <section className="section process"><div className="container"><Reveal><p className="eyebrow">Notre méthode</p><h2 className="method-title"><span>Votre propriété, orchestrée</span><span>avec précision à chaque étape</span></h2></Reveal><MethodJourney/></div></section>

  <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">La confiance, racontée</p><h2>Une présence discrète et constante</h2></Reveal><ReviewCards/><p className="demo-note">Les portraits et avis définitifs seront publiés uniquement après accord écrit et vérification de leur provenance.</p></div></section>

  <section className="section final-cta"><ShieldCheck/><h2 className="final-cta-title"><span>Votre propriété mérite</span><span>une gestion à sa hauteur</span></h2><p>Parlons de votre propriété et définissons une gestion adaptée à vos besoins.</p><Link className="button" href="/valutazione">Demander une évaluation</Link></section>
 </>;
}
