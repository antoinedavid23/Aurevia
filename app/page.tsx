import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import { services, properties } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { PropertyCard, ServiceCard } from "@/components/Cards";
import { MethodJourney, ReviewCards } from "@/components/InteractiveSections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion locative et property management à Genova",
  description: "Gestion des réservations, accueil voyageurs, entretien et suivi propriétaire à Genova.",
  alternates: { canonical: "/" },
};

const promises = [
  "Un interlocuteur local",
  "Des responsabilités claires",
  "Un suivi propriétaire régulier",
  "Des prestataires coordonnés",
  "Une assistance voyageurs 7j/7",
  "Un bien suivi entre les séjours",
];

const essentialServices = services.filter(({ slug }) => ["gestione-proprieta", "accoglienza-voyageurs", "pulizie-biancheria"].includes(slug));

export default function Home() {
  return (
    <>
      <section className="hero hero-aurevia home-velyo-hero">
        <Image className="velyo-hero-image" src="/images/home/genova-night.webp" fill priority sizes="100vw" alt="Vue d’ambiance de Genova au coucher du soleil" />
        <div className="velyo-hero-overlay" />
        <div className="container hero-content">
          <Reveal className="hero-brand velyo-hero-brand" eager>
            <p className="eyebrow">Property Manager à Genova</p>
            <h1>Votre bien, <span>bien géré.</span><br />Vos voyageurs, bien accueillis.</h1>
            <p className="hero-slogan">Réservations, accueil, entretien et suivi : Velyo simplifie la gestion quotidienne de votre location.</p>
            <div className="actions">
              <Link className="button" href="/valutazione">Estimer mon bien <ArrowRight size={16} /></Link>
              <Link className="button ghost" href="/servizi">Découvrir les services</Link>
            </div>
            <div className="velyo-hero-reassurance">
              <span><CheckCircle2 size={16} /> Présence locale</span>
              <span><CheckCircle2 size={16} /> Suivi transparent</span>
              <span><CheckCircle2 size={16} /> Sans engagement au premier échange</span>
            </div>
          </Reveal>
          <div className="velyo-location"><MapPin size={15} /> Genova, Italie</div>
        </div>
      </section>

      <section className="trust-marquee" aria-label="Les engagements Velyo">
        <div className="trust-track">{[...promises, ...promises].map((item, index) => <span key={`${item}-${index}`}>{item}<i>•</i></span>)}</div>
      </section>

      <section className="section ivory"><div className="container split">
        <Reveal className="editorial-card velyo-owner-visual"><Image src="/images/about/genova-architecture.webp" fill sizes="(max-width: 800px) 100vw, 50vw" alt="Architecture de Genova" /><div><span>Présence locale</span><strong>Quelqu’un sur place quand vous ne l’êtes pas.</strong></div></Reveal>
        <Reveal className="prose"><p className="eyebrow dark">Pour les propriétaires</p><h2>La gestion locative sans les complications inutiles.</h2><p>Velyo accompagne les propriétaires qui souhaitent louer sereinement sans perdre la visibilité sur leur bien. Nous portons le quotidien ; vous gardez les décisions importantes.</p><ul className="feature-list"><li>Un interlocuteur unique</li><li>Un périmètre défini au départ</li><li>Des interventions documentées</li><li>Une communication au bon niveau</li></ul><Link className="text-link" href="/proprietari">Découvrir l’accompagnement Velyo <ArrowRight size={15} /></Link></Reveal>
      </div></section>

      <section className="section home-services"><div className="container">
        <Reveal><p className="eyebrow">Services</p><h2>Tout ce qu’il faut pour gérer le bien au quotidien.</h2><p className="section-intro">Une structure complète, avec une expérience plus directe, plus claire et moins cérémonielle.</p></Reveal>
        <div className="card-grid three mobile-two-grid">{essentialServices.map((service) => <ServiceCard key={service.slug} service={service} />)}</div>
        <Link className="text-link mobile-services-link" href="/servizi">Voir tous les services <ArrowRight size={15} /></Link>
      </div></section>

      <section className="section simulator-teaser simulator-photo velyo-simulator-teaser"><div className="container split">
        <Reveal><p className="eyebrow">Estimation indicative</p><h2>Quel potentiel pour votre location à Genova ?</h2><p>Surface, zone, capacité et disponibilité : obtenez une première projection, puis faites-la confirmer par une analyse du bien.</p><Link className="button" href="/simulatore">Essayer le simulateur <ArrowRight size={16} /></Link></Reveal>
        <Reveal className="estimate-card estimate-premium velyo-estimate-card"><div className="estimate-brand"><Image src="/images/brand/velyo-mark.svg" width={58} height={58} alt="" /><span>Projection Velyo</span></div><p className="estimate-case">Exemple illustratif · appartement 2 chambres à Genova</p><div className="estimate-comparison"><div><small>Situation renseignée</small><b>29 800 €</b></div><i>→</i><div><small>Scénario optimisé</small><strong>42 600 €</strong></div></div><div className="estimate-gain"><span>Progression indicative</span><b>+ 43 %</b></div><p>Projection non contractuelle avant frais, fiscalité et analyse du bien.</p></Reveal>
      </div></section>

      <section className="section home-gallery ivory"><div className="container">
        <Reveal className="experience-intro"><p className="eyebrow dark">L’expérience voyageur</p><h2>Genova, avec les bons repères.<br /><span>Pas avec une liste interminable.</span></h2></Reveal>
        <div className="experience-mosaic velyo-experience-mosaic">
          <div className="visual experience-visual experience-visual-main" style={{ backgroundImage: "linear-gradient(180deg,rgba(17,19,24,.04),rgba(17,19,24,.65)),url(/images/home/hero-concierge.webp)" }}><span><b>01</b><i>Porto Antico en famille<small>Un parcours simple pour les premières heures dans la ville.</small></i></span></div>
          <Reveal className="experience-text experience-text-light"><p className="eyebrow dark">Ce que Velyo apporte</p><h3>Des recommandations qui tiennent compte du vrai séjour.</h3><p>Quartier, âge des voyageurs, mobilité, météo et temps disponible : les conseils restent pratiques et faciles à suivre.</p></Reveal>
          <div className="visual experience-visual" style={{ backgroundImage: "linear-gradient(180deg,rgba(17,19,24,.04),rgba(17,19,24,.65)),url(/images/about/genova-architecture.webp)" }}><span><b>02</b><i>Centre historique<small>Ruelles, palais et pauses locales sans perdre le fil.</small></i></span></div>
          <Reveal className="experience-text experience-text-dark"><p className="eyebrow">Simple à réserver</p><h3>Les informations utiles au bon moment.</h3><p>Velyo peut préparer les horaires, les accès, quelques options et un plan de repli réaliste lorsque la météo change.</p></Reveal>
          <div className="visual experience-visual" style={{ backgroundImage: "linear-gradient(180deg,rgba(17,19,24,.04),rgba(17,19,24,.65)),url(/images/home/liguria-coast.webp)" }}><span><b>03</b><i>Nervi & la côte<small>Une respiration facile à organiser depuis Genova.</small></i></span></div>
          <div className="visual experience-visual" style={{ backgroundImage: "linear-gradient(180deg,rgba(17,19,24,.04),rgba(17,19,24,.65)),url(/images/home/genova-night.webp)" }}><span><b>04</b><i>Saveurs génoises<small>Quelques bonnes adresses selon le quartier et le budget.</small></i></span></div>
        </div>
        <Link className="text-link identity-link" href="/esperienze">Découvrir les expériences à Genova <ArrowRight size={15} /></Link>
      </div></section>

      <section className="section ivory"><div className="container">
        <Reveal><p className="eyebrow dark">Collection de démonstration</p><h2>Une structure prête à accueillir vos propriétés.</h2><p className="property-disclaimer">Les fiches affichées sont des exemples de présentation et non des annonces actuellement disponibles.</p></Reveal>
        <div className="card-grid three velyo-property-preview">{properties.slice(0, 3).map((property) => <PropertyCard key={property.slug} property={property} />)}</div>
        <Link className="text-link mobile-services-link" href="/proprieta">Voir la collection exemple <ArrowRight size={15} /></Link>
      </div></section>

      <section className="section process"><div className="container"><Reveal><p className="eyebrow">Notre méthode</p><h2 className="method-title"><span>Un démarrage structuré.</span><span>Un suivi régulier ensuite.</span></h2></Reveal><MethodJourney /></div></section>

      <section className="section ivory"><div className="container"><Reveal><p className="eyebrow dark">La confiance, racontée</p><h2>Des propriétaires informés sans être sollicités pour tout.</h2></Reveal><ReviewCards /><p className="demo-note">Les avis présentés sont des textes de démonstration. Ils seront remplacés uniquement par des témoignages vérifiés et autorisés.</p></div></section>

      <section className="section final-cta"><ShieldCheck /><h2 className="final-cta-title"><span>Votre bien mérite</span><span>une gestion simple à suivre.</span></h2><p>Présentez-nous la propriété et le niveau de délégation que vous recherchez.</p><Link className="button" href="/valutazione">Demander une estimation</Link></section>
    </>
  );
}
