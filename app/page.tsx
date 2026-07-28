import Link from "next/link";
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
          <Reveal>
            <p className="eyebrow">Private property management · Genova & Liguria</p>
            <h1>L’arte di prendersi cura di ciò che conta.</h1>
            <p className="hero-copy">Gestione esclusiva di proprietà e ospitalità su misura a Genova e in Liguria.</p>
            <div className="actions">
              <Link className="button" href="/valutazione">Valuta la tua proprietà <ArrowRight size={16}/></Link>
              <Link className="button ghost" href="/servizi">Scopri i nostri servizi</Link>
            </div>
            <small>Valutazione riservata, gratuita e senza impegno.</small>
          </Reveal>
        </div>
        <div className="hero-scroll">SCOPRI <span /></div>
      </section>

      <section className="trust">
        {["Discrezione assoluta","Gestione completa","Valore ottimizzato","Ospitalità d’eccellenza","Assistenza dedicata"].map(x=><span key={x}>{x}</span>)}
      </section>

      <section className="section ivory">
        <div className="container split">
          <Reveal className="editorial-card">
            <div className="image-placeholder image-photo home-owner"><span>Dettagli che fanno la differenza</span></div>
          </Reveal>
          <Reveal className="prose">
            <p className="eyebrow dark">Per i proprietari</p>
            <h2>Un partner di fiducia per la tua proprietà</h2>
            <p>AUREVIA accompagna proprietari esigenti che desiderano valorizzare il proprio immobile senza occuparsi della gestione quotidiana.</p>
            <ul className="feature-list"><li>Un unico referente</li><li>Assistenza dedicata</li><li>Standard elevati</li><li>Gestione su misura</li></ul>
            <Link className="text-link" href="/proprietari">Il nostro approccio <ArrowRight size={15}/></Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><p className="eyebrow">Servizi</p><h2>Eccellenza in ogni dettaglio</h2></Reveal>
          <div className="card-grid three">{services.slice(0,6).map(s=><ServiceCard key={s.slug} service={s}/>)}</div>
        </div>
      </section>

      <section className="section simulator-teaser simulator-photo">
        <div className="container split">
          <Reveal><p className="eyebrow">Simulatore privato</p><h2>Scopri il potenziale della tua proprietà</h2><p>Una prima indicazione costruita sulle caratteristiche del tuo immobile e sulla sua disponibilità.</p><Link className="button" href="/simulatore">Prova il simulatore <ArrowRight size={16}/></Link></Reveal>
          <Reveal className="estimate-card"><span>RICAVI ANNUALI · ESEMPIO</span><strong>€ 48.000 — 64.000</strong><div><small>Tariffa media</small><b>€ 265</b></div><div><small>Occupazione indicativa</small><b>64%</b></div><p>Esempio illustrativo. Nessuna garanzia di rendimento.</p></Reveal>
        </div>
      </section>

      <section className="section home-gallery ivory">
        <div className="container">
          <Reveal><p className="eyebrow dark">Genova & Liguria</p><h2>Un’identità radicata nel territorio.</h2></Reveal>
          <div className="editorial-grid">
            <div className="visual visual-bedroom"><span>Ospitalità privata</span></div>
            <div className="visual visual-coast"><span>Riviera ligure</span></div>
            <div className="visual visual-night"><span>Genova, dopo il tramonto</span></div>
            <div className="visual visual-key"><span>Il segno AUREVIA</span></div>
          </div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container">
          <Reveal><p className="eyebrow dark">Collezione dimostrativa</p><h2>Proprietà selezionate</h2></Reveal>
          <div className="card-grid three">{properties.slice(0,3).map(p=><PropertyCard key={p.slug} property={p}/>)}</div>
          <p className="demo-note">Immagini e proprietà presentate a scopo dimostrativo.</p>
        </div>
      </section>

      <section className="section process">
        <div className="container"><Reveal><p className="eyebrow">Il metodo</p><h2>Un servizio completo, in quattro passaggi</h2></Reveal>
          <div className="steps">{["Conosciamo la proprietà","Definiamo la strategia","Prepariamo e valorizziamo","Gestiamo ogni dettaglio"].map((x,i)=><div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div>
        </div>
      </section>

      <section className="section ivory">
        <div className="container"><Reveal><p className="eyebrow dark">La fiducia, raccontata</p><h2>Una presenza discreta e costante</h2></Reveal>
          <div className="card-grid three">{testimonials.map(t=><blockquote key={t.place}>“{t.quote}”<footer>— Proprietario, {t.place}</footer></blockquote>)}</div>
          <p className="demo-note">Testimonianze dimostrative da sostituire con recensioni verificate.</p>
        </div>
      </section>

      <section className="section final-cta"><ShieldCheck/><h2>La tua proprietà merita una gestione all’altezza.</h2><p>Parliamo del tuo immobile e costruiamo una soluzione su misura.</p><Link className="button" href="/valutazione">Richiedi una valutazione privata</Link></section>
    </>
  );
}
