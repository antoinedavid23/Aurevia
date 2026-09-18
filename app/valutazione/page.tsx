import Link from "next/link";
import Image from "@/components/public-site/SiteImage";
import { PageHero } from "@/components/public-site/PageHero";
import { ValuationForm } from "@/components/public-site/ValuationForm";
import type { Metadata } from "next";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Affidare un immobile a Genova",
  description: "Présentez votre appartement ou maison à AUREVIA. Nous étudions le bien, vos objectifs et le niveau de gestion souhaité avant une visite à Genova.",
  path: "/valutazione",
});

const points = [
  ["01", "Le bien", "Son adresse, sa capacité, son état et ses contraintes pratiques."],
  ["02", "La location actuelle", "Votre prix, votre disponibilité et la façon dont elle est gérée aujourd’hui."],
  ["03", "Ce que vous voulez déléguer", "Les tâches que AUREVIA devra reprendre et les décisions que vous souhaitez garder."],
];

const nextSteps = [
  ["01", "Nous étudions le bien", "Une personne vérifie les informations transmises et prépare les premières questions utiles."],
  ["02", "Nous vous appelons", "Nous précisons ce que vous louez, ce que vous gérez encore et ce que vous attendez de AUREVIA."],
  ["03", "Nous visitons sur place", "La visite permet de confirmer le fonctionnement, les services nécessaires et la proposition de gestion."],
];

export default function Page() {
  const contactEmail = process.env.NEXT_PUBLIC_EMAIL || "contatto@aurevia-genova.com";

  return (
    <ItalianContent>
      <PageHero
        label="Une première évaluation confidentielle"
        title="Confier mon bien"
        text="Présentez le bien, vos objectifs et ce que vous souhaitez déléguer. Nous préparons un premier échange utile avant toute visite."
        image="/images/public-site/concierge/owner-conversation-premium.webp"
      />

      <div className="valuation-page">
        <section className="valuation-opening">
          <div className="container valuation-opening-grid section-heading-art section-heading-art--valuation">
            <span className="section-heading-watermark" aria-hidden="true">VOTRE PROJET</span>
            <div>
              <p className="eyebrow">Votre situation, sans détour</p>
              <h2>Parlons du bien, du projet et du relais attendu.</h2>
            </div>
            <p className="valuation-opening-copy">Quelques informations suffisent pour préparer les bonnes questions, vérifier l’adéquation avec AUREVIA et organiser la suite sans vous faire perdre de temps.</p>
          </div>
        </section>

        <section className="valuation-workspace">
          <div className="container valuation-experience">
            <aside className="valuation-aside" aria-label="Ce que AUREVIA cherche à comprendre">
              <div className="valuation-aside-image">
                <Image src="/images/public-site/concierge/home-preparation-premium.webp" alt="Préparation attentive d’un bien à Genova" fill sizes="(max-width: 960px) 100vw, 38vw" />
                <p>Bien connu.<br /><em>Bien suivi.</em></p>
              </div>
              <div className="valuation-aside-content">
                <p className="eyebrow">Ce que nous regardons</p>
                <ol>{points.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
                <p className="valuation-reassurance"><span>Réponse personnelle</span><span>Échange confidentiel</span><span>Aucun engagement</span></p>
              </div>
            </aside>

            <div className="valuation-form-shell">
              <ValuationForm />
              <p className="valuation-direct-contact">Une question avant de commencer&nbsp;? <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
              <p className="form-privacy">Vos informations restent confidentielles. Consultez notre <Link href="/privacy">politique de confidentialité</Link>.</p>
            </div>
          </div>
        </section>

        <section className="valuation-next" id="apres-envoi">
          <div className="container">
            <div className="valuation-next-heading">
              <span className="valuation-next-watermark" aria-hidden="true">ÉCHANGE</span>
              <p className="eyebrow">Après votre envoi</p>
              <h2><span>Un premier échange</span>{" "}<em>prépare la visite du bien.</em></h2>
              <p>Nous revenons vers vous avec les bonnes questions, puis nous visitons le bien avant toute proposition.</p>
            </div>
            <ol className="valuation-next-steps">{nextSteps.map(([number, title, text]) => <li key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
          </div>
        </section>
      </div>
    </ItalianContent>
  );
}
