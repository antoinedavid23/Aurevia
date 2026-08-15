import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import { ServiceCard } from "@/components/Cards";
import { services } from "@/data/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services de property management à Genova",
  description: "Gestion locative, accueil, ménage, maintenance, optimisation et suivi propriétaire à Genova.",
  alternates: { canonical: "/servizi" },
};

export default function Page() {
  return <>
    <PageHero label="Services" title="Une gestion complète, sans fonctionnement opaque" text="Chaque service est défini, coordonné et suivi par Velyo. Vous choisissez le niveau de délégation et gardez la main sur les décisions importantes." image="/images/home/genova-night.webp" />
    <section className="section"><div className="container card-grid three mobile-two-grid">{services.map((service) => <ServiceCard key={service.slug} service={service} />)}</div></section>
    <section className="section ivory offers-section"><div className="container">
      <p className="eyebrow dark">Nos cadres de gestion</p>
      <h2>Deux niveaux de délégation, un même interlocuteur.</h2>
      <p className="offers-intro">Le périmètre définitif dépend du bien, de son calendrier, de la zone et des opérations réellement nécessaires.</p>
      <div className="offers-grid">
        <article className="offer-card">
          <div className="offer-head"><div><span>Solution 01</span><h3>Gestion essentielle</h3></div><strong>Sur proposition</strong></div>
          <p className="offer-promise">Pour déléguer les opérations clés tout en conservant un suivi simple du logement.</p>
          <div className="offer-groups"><div><h4>Mise en place</h4><ul><li>Visite et cadrage du bien</li><li>Calendrier et règles de séjour</li><li>Préparation des accès</li><li>Support d’accueil voyageurs</li></ul></div><div><h4>Gestion courante</h4><ul><li>Réservations et messages</li><li>Organisation des arrivées</li><li>Coordination ménage et linge</li><li>Point propriétaire régulier</li></ul></div></div>
          <p className="offer-note">Les frais de ménage, linge, consommables et interventions restent séparés et sont présentés clairement.</p>
          <Link className="button" href="/valutazione">Étudier cette solution</Link>
        </article>
        <article className="offer-card offer-card-360">
          <div className="offer-head"><div><span>Solution 02</span><h3>Gestion complète</h3></div><strong>Sur proposition</strong></div>
          <p className="offer-promise">Pour confier le quotidien, la maintenance, le suivi et l’optimisation à une même équipe locale.</p>
          <div className="offer-groups"><div><h4>Cadre étendu</h4><ul><li>Tous les services essentiels</li><li>Maintenance et contrôles préventifs</li><li>Optimisation du calendrier</li><li>Suivi consolidé des opérations</li><li>Organisation multi-biens possible</li></ul></div></div>
          <p className="offer-note">La proposition précise les responsabilités, validations, frais séparés et délais de réponse.</p>
          <Link className="button ghost" href="/contatti">Présenter mon besoin</Link>
        </article>
      </div>
    </div></section>
    <CTA />
  </>;
}
