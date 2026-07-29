import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import { ServiceCard } from "@/components/Cards";
import { services } from "@/data/content";

export const metadata = { title: "Services de gestion de propriété" };

export default function Page() {
  return <>
    <PageHero label="Services" title="Un service complet, conçu sur mesure" text="De la gestion quotidienne à la valorisation du bien, nous coordonnons chaque détail."/>
    <section className="section"><div className="container card-grid three">{services.map(service=><ServiceCard key={service.slug} service={service}/>)}</div></section>
    <section className="section ivory offers-section"><div className="container">
      <p className="eyebrow dark">Nos solutions de gestion</p>
      <h2>Deux cadres, une même exigence</h2>
      <p className="offers-intro">Une gestion optimisée pour chaque propriété, ou un contrat personnalisé lorsque votre projet réunit plusieurs biens et des services intégrés.</p>
      <div className="offers-grid">
        <article className="offer-card">
          <div className="offer-head"><div><span>Solution 01</span><h3>Gestion Sérénité</h3></div><strong>25 % TTC</strong></div>
          <p className="offer-promise">Une gestion entièrement optimisée pour maximiser le rendement de votre location.</p>
          <p className="offer-rate">Sur les revenus locatifs, hors frais de ménage.</p>
          <div className="offer-groups">
            <div><h4>Lancement &amp; Booster inclus</h4><ul><li>Audit du bien et de son positionnement</li><li>Création ou optimisation de l’annonce</li><li>Plan tarifaire de lancement</li><li>Conseils décoration et équipements</li><li>Livret d’accueil numérique personnalisé</li><li>Recommandations pour les photos</li></ul></div>
            <div><h4>Gestion quotidienne incluse</h4><ul><li>Gestion des réservations et du calendrier</li><li>Communication voyageurs 7j/7</li><li>Optimisation régulière des tarifs</li><li>Optimisation du taux d’occupation et des durées de séjour</li><li>Organisation des arrivées et départs</li><li>Gestion des incidents</li><li>Coordination ménage et linge</li><li>Suivi des performances et compte rendu</li></ul></div>
          </div>
          <p className="offer-note">Ménage, linge, consommables et interventions techniques facturés au réel, séparément, sans marge AUREVIA.</p>
          <Link className="button" href="/valutazione">Choisir la solution Sérénité</Link>
        </article>
        <article className="offer-card offer-card-360">
          <div className="offer-head"><div><span>Solution 02</span><h3>Solution 360</h3></div><strong>Sur devis</strong></div>
          <p className="offer-promise">Une formule contractuelle personnalisée pour plusieurs biens ou des services intégrés à la réservation.</p>
          <div className="offer-groups"><div><h4>Cadre multi-biens &amp; services intégrés</h4><ul><li>Tous les services de Sérénité, mise en place comprise</li><li>Contrat et conditions adaptés à plusieurs biens</li><li>Pilotage centralisé du portefeuille</li><li>Services additionnels intégrés à la réservation</li><li>Organisation opérationnelle adaptée</li><li>Reporting consolidé personnalisé</li></ul></div></div>
          <p className="offer-note">Le devis dépend du nombre de biens, des expériences et des services inclus à la réservation.</p>
          <Link className="button ghost" href="/contatti">Recevoir mon devis</Link>
        </article>
      </div>
    </div></section>
    <CTA/>
  </>;
}
