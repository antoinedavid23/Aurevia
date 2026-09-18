import Image from "@/components/public-site/SiteImage";
import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { ArrowRight, Clock3, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { services } from "@/data/public-site/content";
import { ServiceCard } from "@/components/public-site/Cards";
import { MethodJourney } from "@/components/public-site/InteractiveSections";
import { Reveal } from "@/components/public-site/Reveal";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Gestion des locations courte durée à Genova",
  description: "AUREVIA gère votre location courte durée à Genova : annonce, tarifs, voyageurs, ménage, maintenance et suivi propriétaire. Demandez une première évaluation.",
  path: "/",
});

const essentialServices = services.filter(({ slug }) =>
  ["gestione-proprieta", "accoglienza-voyageurs", "pulizie-biancheria"].includes(slug),
);

export default function Home() {
  return (
    <ItalianContent>
  <section className="hero hero-aurevia" data-aurevia-original-hero>
   <HeroVideo/>
   <div className="container hero-content"><Reveal className="hero-brand" eager>
    <div className="hero-logo-crop"><Image className="hero-logo" src="/images/brand/aurevia-logo-no-tagline.png" width={720} height={720} sizes="(max-width: 767px) 310px, 480px" priority alt="AUREVIA"/></div>
    <h1 className="sr-only">AUREVIA</h1>
    <p className="hero-slogan"><span>L’art de prendre soin</span><span>de ce qui compte.</span></p>
    <div className="actions"><Link className="button" href="/valutazione">Évaluer mon bien <ArrowRight size={16}/></Link><Link className="button ghost" href="/servizi">Découvrir nos services</Link></div>
    <small>Évaluation confidentielle, gratuite et sans engagement.</small>
   </Reveal></div>
  </section>


      <section className="aurevia-trust-strip" aria-label="Les engagements AUREVIA">
        <div className="container trust-cards">
          <article data-index="01"><ShieldCheck /><div><strong>Une stratégie adaptée au bien</strong><span>Positionnement, tarifs et calendrier sont relus avec méthode.</span></div></article>
          <article data-index="02"><Clock3 /><div><strong>Une présence réellement locale</strong><span>Arrivées, prestataires et imprévus sont suivis à Genova.</span></div></article>
          <article data-index="03"><Headphones /><div><strong>Un bien protégé à chaque séjour</strong><span>Les contrôles et les écarts importants sont documentés.</span></div></article>
          <article data-index="04"><Sparkles /><div><strong>Des décisions mieux éclairées</strong><span>Activité, dépenses et prochaines actions restent lisibles.</span></div></article>
        </div>
      </section>

      <section className="section ivory owner-welcome">
        <div className="container split">
          <Reveal className="editorial-card aurevia-owner-visual">
            <Image src="/images/public-site/concierge/owner-conversation-premium.webp" fill sizes="(max-width: 800px) 100vw, 44vw" alt="Une propriétaire échange simplement avec son interlocutrice AUREVIA" />
          </Reveal>
          <Reveal className="prose aurevia-owner-copy watermark-heading watermark-heading--image-side">
            <p className="eyebrow dark section-watermark" aria-hidden="true">Gestion</p>
            <p className="eyebrow dark">Sur place, pour votre bien</p>
            <h2>Vous déléguez l’exploitation.<br /><em>Vous gardez la vision.</em></h2>
            <p>Un interlocuteur dédié connaît le bien, pilote les réservations et coordonne les intervenants. Vous gardez la visibilité, vos périodes personnelles et le dernier mot sur les décisions importantes.</p>
            <div className="owner-attention-grid" aria-label="Ce que AUREVIA prend en charge">
              <article><span>01</span><strong>Un interlocuteur responsable</strong><p>Les demandes ne se dispersent plus entre plusieurs prestataires.</p></article>
              <article><span>02</span><strong>Un standard à chaque séjour</strong><p>Préparation, accès, linge et informations suivent le même cadre.</p></article>
              <article><span>03</span><strong>Des imprévus qui avancent</strong><p>La situation est qualifiée, attribuée puis suivie jusqu’au résultat.</p></article>
              <article><span>04</span><strong>Un reporting qui aide à décider</strong><p>Vous recevez les faits, les justificatifs et la prochaine action.</p></article>
            </div>
            <Link className="text-link" href="/proprietari">Voir le parcours de gestion <ArrowRight size={15} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section home-services">
        <div className="container">
          <Reveal className="watermark-heading watermark-heading--offset-right">
            <p className="eyebrow section-watermark" aria-hidden="true">Gestion complète</p>
            <p className="eyebrow">L’expertise AUREVIA</p>
            <h2>Tout le cycle locatif.<br /><em>Un seul interlocuteur.</em></h2>
            <p className="section-intro">Commercialisation, voyageurs, préparation du bien, maintenance et reporting avancent dans un même cadre.</p>
          </Reveal>
          <div className="card-grid three mobile-two-grid">{essentialServices.map((service) => <ServiceCard key={service.slug} service={service} variant="home" />)}</div>
          <Link className="button services-all-button" href="/servizi">Explorer la gestion complète <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="section ivory aurevia-simulator-teaser">
        <div className="container simulator-editorial-layout">
          <Reveal className="prose simulator-scan-copy watermark-heading watermark-heading--compact">
            <p className="eyebrow dark section-watermark" aria-hidden="true">Estimation</p>
            <p className="eyebrow dark">Une première lecture chiffrée</p>
            <h2 className="simulator-teaser-title"><span>Quel potentiel pour</span><span>votre bien&nbsp;?</span></h2>
            <p>Construisez un scénario brut à partir de votre prix, de votre disponibilité et de quelques caractéristiques du logement. Les hypothèses restent visibles et ajustables.</p>
            <Link className="button simulator-scan-button" href="/simulatore">Construire mon scénario <ArrowRight size={15} /></Link>
          </Reveal>
          <Reveal className="simulator-editorial-card"><Image src="/images/public-site/concierge/family-apartment-premium.webp" fill sizes="(max-width: 800px) 100vw, 48vw" alt="Appartement lumineux prêt à recevoir des voyageurs" /><div><span>Une estimation adaptée à votre bien.</span><small>Simple, indicative et sans engagement.</small></div></Reveal>
        </div>
      </section>

      <section className="section home-gallery">
        <div className="container">
          <Reveal className="experience-intro watermark-heading watermark-heading--split"><p className="eyebrow section-watermark" aria-hidden="true">Avant le séjour</p><div><p className="eyebrow">Tout commence avant l’arrivée</p><h2>Chaque séjour prépare<br /><em>déjà le suivant.</em></h2></div><p className="experience-intro-note">Le bien est préparé, les voyageurs accompagnés, puis tout est contrôlé et remis en état pour la réservation suivante.</p></Reveal>
          <div className="experience-mosaic aurevia-experience-mosaic">
            <div className="visual experience-visual experience-visual-main journey-preparation" style={{ backgroundImage: "linear-gradient(180deg,rgba(13,31,53,.02),rgba(13,31,53,.66)),url(/images/public-site/concierge/home-preparation-premium.webp)" }}><span><b>01</b><i>Le bien est prêt avant l’arrivée<small>Ménage vérifié, linge installé et essentiels réassortis.</small></i></span></div>
            <Reveal className="experience-text experience-text-light"><p className="eyebrow dark">Votre relais à Genova</p><h3>Une personne connaît le bien.</h3><p>Elle connaît les accès, vos consignes et les habitudes du lieu.</p></Reveal>
            <Reveal className="experience-text experience-text-dark"><p className="eyebrow">Pendant le séjour</p><h3>Les voyageurs savent qui appeler.</h3><p>Pour une question ou un imprévu, ils contactent AUREVIA directement.</p></Reveal>
            <div className="visual experience-visual journey-maintenance" style={{ backgroundImage: "linear-gradient(180deg,rgba(13,31,53,.02),rgba(13,31,53,.66)),url(/images/public-site/concierge/maintenance-premium.webp)" }}><span><b>02</b><i>Chaque problème trouve un responsable<small>Besoin identifié, intervenant contacté et réparation suivie.</small></i></span></div>
            <div className="visual experience-visual journey-welcome" style={{ backgroundImage: "linear-gradient(180deg,rgba(13,31,53,.02),rgba(13,31,53,.66)),url(/images/public-site/concierge/welcome-family-premium.webp)" }}><span><b>03</b><i>Les voyageurs arrivent sans hésiter<small>Accès, clés et fonctionnement expliqués avant leur installation.</small></i></span></div>
            <div className="visual experience-visual journey-owner" style={{ backgroundImage: "linear-gradient(180deg,rgba(13,31,53,.02),rgba(13,31,53,.66)),url(/images/public-site/concierge/owner-conversation-premium.webp)" }}><span><b>04</b><i>Vous savez ce qui se passe<small>Nous vous informons lorsqu’une décision ou un point important l’exige.</small></i></span></div>
          </div>
        </div>
      </section>

      <section className="section process"><div className="container"><Reveal className="watermark-heading watermark-heading--center"><p className="eyebrow section-watermark" aria-hidden="true">Notre méthode</p><p className="eyebrow">Sept étapes, un même cadre</p><h2 className="method-title"><span>Sept étapes.</span><span>Une gestion maîtrisée.</span></h2></Reveal><MethodJourney /></div></section>

      <section className="section ivory concierge-voices expertise-evidence"><div className="container"><Reveal className="watermark-heading watermark-heading--offset-right"><p className="eyebrow dark section-watermark" aria-hidden="true">Preuves de méthode</p><p className="eyebrow dark">Avant de nous confier le bien</p><h2>Des preuves concrètes,<br/><em>avant les promesses.</em></h2><p className="section-intro">AUREVIA préfère montrer son cadre de travail plutôt que promettre un résultat sans connaître le bien.</p></Reveal><div className="owner-evidence-grid"><article><span>01</span><strong>Audit initial du bien</strong><p>Accès, équipements, contraintes, potentiel locatif et priorités sont relevés avant la proposition.</p><small>Diagnostic documenté</small></article><article><span>02</span><strong>Plan de gestion détaillé</strong><p>Services inclus, dépenses séparées, seuils de validation et responsabilités sont posés noir sur blanc.</p><small>Périmètre lisible</small></article><article><span>03</span><strong>Suivi propriétaire structuré</strong><p>Réservations, interventions, dépenses et décisions restent regroupées dans une lecture utile.</p><small>Reporting exploitable</small></article><article><span>04</span><strong>Amélioration continue</strong><p>Les données de séjour et les incidents servent à ajuster tarifs, organisation et qualité d’accueil.</p><small>Actions justifiées</small></article></div><Link className="button evidence-cta" href="/valutazione">Confier mon bien <ArrowRight size={16}/></Link></div></section>

    </ItalianContent>
  );
}
