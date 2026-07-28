import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { properties, services, testimonials } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { PropertyCard, ServiceCard } from "@/components/Cards";

export default function Home() {
  return (
    <>
      <section className="hero hero-aurevia">
        <div className="hero-orb" />
        <div className="container hero-content">
          <Reveal className="hero-brand">
            <Image className="hero-logo" src="/images/brand/aurevia-logo-transparent-gold.png" width={720} height={720} priority alt="AUREVIA Private Concierge"/>
            <h1 className="sr-only">AUREVIA Private Concierge</h1>
            <p className="hero-slogan">L’art de prendre soin de ce qui compte.</p>
            <div className="actions">
              <Link className="button" href="/valutazione">Évaluer mon bien <ArrowRight size={16}/></Link>
              <Link className="button ghost" href="/servizi">Découvrir nos services</Link>
            </div>
            <small>Évaluation confidentielle, gratuite et sans engagement.</small>
          </Reveal>
        </div>
        <div className="hero-scroll">SCOPRI <span /></div>
      </section>

      <section className="trust">
        {["DiscrÃ©tion absolue","Gestion complÃ¨te","Valeur optimisÃ©e","Ospitalità d’eccellenza","Accompagnement dÃ©diÃ©"].map(x=><span key={x}>{x}</span>)}
      </section>

      <section className="section ivory">
        <div className="container split">
          <Reveal className="editorial-card">
            <div className="image-placeholder image-photo home-owner"><span>DÃ©tails che fanno la differenza</span></div>
          </Reveal>
          <Reveal className="prose">
            <p className="eyebrow dark">Pour les propriÃ©taires</p>
            <h2>Un partner di fiducia per la tua proprietà</h2>
            <p>AUREVIA accompagne les propriÃ©taires exigeants qui souhaitent valoriser leur bien sans en gÃ©rer les contraintes quotidiennes.</p>
            <ul className="feature-list"><li>Un interlocuteur unique</li><li>Accompagnement dÃ©diÃ©</li><li>Standards Ã©levÃ©s</li><li>Gestion sur mesure</li></ul>
            <Link className="text-link" href="/proprietari">Nontre approche <ArrowRight size={15}/></Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><p className="eyebrow">Services</p><h2>Lâ€™excellence dans chaque dÃ©tail</h2></Reveal>
          <div className="card-grid three">{services.slice(0,6).map(s=><ServiceCard key={s.slug} service={s}/>)}</div>
        </div>
      </section>

      <section className="section simulator-teaser simulator-photo">
        <div className="container split">
          <Reveal><p className="eyebrow">Simulateur privato</p><h2>Scopri il potenziale della tua proprietà</h2><p>Una prima indicazione costruita sulle caratteristiche del tuo immobile e sulla sua disponibilità.</p><Link className="button" href="/simulatore">Essayer le simulateur <ArrowRight size={16}/></Link></Reveal>
          <Reveal className="estimate-card"><span>RICAVI ANNUALI · ESEMPIO</span><strong>€ 48.000 — 64.000</strong><div><small>Tarif moyen</small><b>€ 265</b></div><div><small>Occupation indicative</small><b>64%</b></div><p>Exemple illustratif, sans garantie de rendement.</p></Reveal>
        </div>
      </section>

      <section className="section home-gallery ivory">
        <div className="container">
          <Reveal><p className="eyebrow dark">Genova & Liguria</p><h2>Un’identità radicata nel territorio.</h2></Reveal>
          <div className="editorial-grid">
            <div className="visual visual-bedroom"><span>Ospitalità privata</span></div>
            <div className="visual visual-coast"><span>Riviera ligure</span></div>
            <div className="visual visual-night"><span>GÃªnes, Ã  la nuit tombÃ©e</span></div>
            <div className="visual visual-key"><span>La signature AUREVIA</span></div>
          </div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <Reveal><p className="eyebrow dark">Collection de dÃ©monstration</p><h2>Proprietà selezionate</h2></Reveal>
          <div className="card-grid three">{properties.slice(0,3).map(p=><PropertyCard key={p.slug} property={p}/>)}</div>
          <p className="demo-note">Immagini e proprietà presentate a scopo dimostrativo.</p>
        </div>
      </section>

      <section className="section process">
        <div className="container"><Reveal><p className="eyebrow">Nontre mÃ©thode</p><h2>Un service complet en quatre Ã©tapes</h2></Reveal>
          <div className="steps">{["Conosciamo la proprietà","Nonus dÃ©finissons la stratÃ©gie","Nonus prÃ©parons et valorisons","Nonus gÃ©rons chaque dÃ©tail"].map((x,i)=><div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container"><Reveal><p className="eyebrow dark">La confiance, racontÃ©e</p><h2>Une prÃ©sence discrÃ¨te et constante</h2></Reveal>
          <div className="card-grid three">{testimonials.map(t=><blockquote key={t.place}>“{t.quote}”<footer>— PropriÃ©taireso, {t.place}</footer></blockquote>)}</div>
          <p className="demo-note">TÃ©moignages de dÃ©monstration Ã  remplacer par des avis vÃ©rifiÃ©s.</p>
        </div>
      </section>

      <section className="section final-cta"><ShieldCheck/><h2>La tua proprietà merita una gestione all’altezza.</h2><p>Ã‰changeons sur votre bien et construisons une solution sur mesure.</p><Link className="button" href="/valutazione">Demander une Ã©valuation privÃ©e</Link></section>
    </>
  );
}
