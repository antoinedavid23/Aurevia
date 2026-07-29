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
   <Reveal className="prose"><p className="eyebrow dark">Pour les propriétaires</p><h2>Un partenaire de confiance pour votre propriété</h2><p>AUREVIA accompagne les propriétaires exigeants qui souhaitent valoriser leur bien sans en gérer les contraintes quotidiennes.</p><ul className="feature-list"><li>Une relation privilégiée</li><li>Une prise en charge intégrale</li><li>Des standards d’exception</li><li>Une gestion entièrement sur mesure</li></ul><Link className="text-link" href="/proprietari">Découvrir l’approche AUREVIA <ArrowRight size={15}/></Link></Reveal>
  </div></section>

  <section className="section"><div className="container"><Reveal><p className="eyebrow">Services</p><h2>L’excellence dans chaque détail</h2></Reveal><div className="card-grid three">{services.slice(0,6).map(s=><ServiceCard key={s.slug} service={s}/>)}</div></div></section>

  <section className="section simulator-teaser simulator-photo"><div className="container split">
   <Reveal><p className="eyebrow">Simulateur privé</p><h2>Découvrez le potentiel de votre propriété</h2><p>Obtenez une première projection selon la localisation, le standing, les équipements et la période de disponibilité.</p><Link className="button" href="/simulatore">Essayer le simulateur <ArrowRight size={16}/></Link></Reveal>
   <Reveal className="estimate-card estimate-premium"><div className="estimate-brand"><span className="estimate-logo-crop" aria-hidden="true"><Image src="/images/brand/aurevia-logo-transparent-gold.png" width={160} height={160} alt=""/></span><span>Projection AUREVIA</span></div><p className="estimate-case">Cas illustratif · appartement 2 chambres à Gênes</p><div className="estimate-comparison"><div><small>Situation estimée avant gestion</small><b>29 800 €</b></div><i>→</i><div><small>Potentiel optimisé</small><strong>50 900 €</strong></div></div><div className="estimate-gain"><span>Progression indicative</span><b>+ 71 %</b></div><div><small>Tarif moyen par nuit (tarification dynamique)</small><b>265 € / nuit</b></div><div><small>Occupation projetée</small><b>64 % · 192 nuits</b></div><p>Projection illustrative avant frais, fiscalité et interventions. Une analyse personnalisée reste indispensable.</p></Reveal>
  </div></section>

  <section className="section home-gallery ivory"><div className="container"><Reveal className="identity-heading"><div><p className="eyebrow dark">L’univers AUREVIA</p><h2>Une identité faite de lumière, de matière et de discrétion</h2></div><p>Le bleu profond de la mer, l’or chaud des fins de journée et le calme des intérieurs ligures composent une signature reconnaissable, pensée pour valoriser chaque propriété sans jamais l’effacer.</p></Reveal><div className="editorial-grid identity-grid"><div className="visual visual-bedroom"><span><b>01</b> L’art de recevoir</span></div><div className="visual visual-coast"><span><b>02</b> L’ancrage ligure</span></div><div className="visual visual-night"><span><b>03</b> Une présence discrète</span></div><div className="visual visual-key"><span><b>04</b> La signature AUREVIA</span></div></div></div></section>

  <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">Collection de démonstration</p><h2>Propriétés sélectionnées</h2></Reveal><div className="card-grid three">{properties.slice(0,3).map(p=><PropertyCard key={p.slug} property={p}/>)}</div><p className="demo-note">Images et propriétés présentées à titre démonstratif.</p></div></section>

  <section className="section process"><div className="container"><Reveal><p className="eyebrow">Notre méthode</p><h2 className="method-title"><span>Un accompagnement clair,</span><span>de la première visite au pilotage quotidien</span></h2></Reveal><MethodJourney/></div></section>

  <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">La confiance, racontée</p><h2>Une présence discrète et constante</h2></Reveal><ReviewCards/><p className="demo-note">Les portraits et avis définitifs seront publiés uniquement après accord écrit et vérification de leur provenance.</p></div></section>

  <section className="section final-cta"><ShieldCheck/><h2>Votre propriété mérite une gestion à sa hauteur</h2><p>Échangeons sur votre bien et construisons une solution sur mesure.</p><Link className="button" href="/valutazione">Demander une évaluation privée</Link></section>
 </>;
}
