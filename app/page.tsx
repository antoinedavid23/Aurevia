import Link from "next/link";
import Image from "next/image";
import {ArrowRight,ShieldCheck} from "lucide-react";
import {properties,services,testimonials} from "@/data/content";
import {Reveal} from "@/components/Reveal";
import {PropertyCard,ServiceCard} from "@/components/Cards";

const promises=["Discrétion absolue","Gestion complète","Valeur optimisée","Hospitalité d’excellence","Accompagnement dédié"];

export default function Home(){
 return <>
  <section className="hero hero-aurevia">
   <div className="container hero-content"><Reveal className="hero-brand">
    <div className="hero-logo-crop"><Image className="hero-logo" src="/images/brand/aurevia-logo-transparent-gold.png" width={720} height={720} priority alt="AUREVIA"/></div>
    <h1 className="sr-only">AUREVIA</h1>
    <p className="hero-slogan">L’art de prendre soin de ce qui compte.</p>
    <div className="actions"><Link className="button" href="/valutazione">Évaluer mon bien <ArrowRight size={16}/></Link><Link className="button ghost" href="/servizi">Découvrir nos services</Link></div>
    <small>Évaluation confidentielle, gratuite et sans engagement.</small>
   </Reveal></div>
  </section>

  <section className="trust-marquee" aria-label="Les engagements AUREVIA"><div className="trust-track">{[...promises,...promises].map((x,i)=><span key={`${x}-${i}`}>{x}<i>◆</i></span>)}</div></section>

  <section className="section ivory"><div className="container split">
   <Reveal className="editorial-card"><div className="image-placeholder image-photo home-owner"><span>Le soin jusque dans les détails</span></div></Reveal>
   <Reveal className="prose"><p className="eyebrow dark">Pour les propriétaires</p><h2>Un partenaire de confiance pour votre propriété</h2><p>AUREVIA accompagne les propriétaires exigeants qui souhaitent valoriser leur bien sans en gérer les contraintes quotidiennes.</p><ul className="feature-list"><li>Un interlocuteur unique</li><li>Accompagnement dédié</li><li>Standards élevés</li><li>Gestion sur mesure</li></ul><Link className="text-link" href="/proprietari">Notre approche <ArrowRight size={15}/></Link></Reveal>
  </div></section>

  <section className="section"><div className="container"><Reveal><p className="eyebrow">Services</p><h2>L’excellence dans chaque détail</h2></Reveal><div className="card-grid three">{services.slice(0,6).map(s=><ServiceCard key={s.slug} service={s}/>)}</div></div></section>

  <section className="section simulator-teaser simulator-photo"><div className="container split">
   <Reveal><p className="eyebrow">Simulateur privé</p><h2>Découvrez le potentiel de votre propriété</h2><p>Obtenez une première projection selon la localisation, le standing, les équipements et la période de disponibilité.</p><Link className="button" href="/simulatore">Essayer le simulateur <ArrowRight size={16}/></Link></Reveal>
   <Reveal className="estimate-card"><span>Projection annuelle illustrative</span><strong>48 000 € — 64 000 €</strong><div><small>Tarif moyen par nuit</small><b>265 €</b></div><div><small>Taux d’occupation indicatif</small><b>64 %</b></div><div><small>Nuits réservées estimées</small><b>192</b></div><div><small>Moyenne mensuelle</small><b>4 650 €</b></div><p>Projection indicative, sans garantie de revenus.</p></Reveal>
  </div></section>

  <section className="section home-gallery ivory"><div className="container"><Reveal><p className="eyebrow dark">Gênes & Ligurie</p><h2>Une identité profondément ancrée dans le territoire</h2></Reveal><div className="editorial-grid"><div className="visual visual-bedroom"><span>Hospitalité privée</span></div><div className="visual visual-coast"><span>Riviera ligure</span></div><div className="visual visual-night"><span>Gênes à la nuit tombée</span></div><div className="visual visual-key"><span>La signature AUREVIA</span></div></div></div></section>

  <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">Collection de démonstration</p><h2>Propriétés sélectionnées</h2></Reveal><div className="card-grid three">{properties.slice(0,3).map(p=><PropertyCard key={p.slug} property={p}/>)}</div><p className="demo-note">Images et propriétés présentées à titre démonstratif.</p></div></section>

  <section className="section process"><div className="container"><Reveal><p className="eyebrow">Notre méthode</p><h2>Un service complet en quatre étapes</h2></Reveal><div className="steps">{["Découverte de la propriété","Définition de la stratégie","Préparation et valorisation","Gestion de chaque détail"].map((x,i)=><div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></div></section>

  <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">La confiance, racontée</p><h2>Une présence discrète et constante</h2></Reveal><div className="card-grid three">{testimonials.map(t=><blockquote key={t.place}>“{t.quote}”<footer>— Propriétaire, {t.place}</footer></blockquote>)}</div><p className="demo-note">Témoignages de démonstration à remplacer par des avis vérifiés.</p></div></section>

  <section className="section final-cta"><ShieldCheck/><h2>Votre propriété mérite une gestion à sa hauteur</h2><p>Échangeons sur votre bien et construisons une solution sur mesure.</p><Link className="button" href="/valutazione">Demander une évaluation privée</Link></section>
 </>;
}
