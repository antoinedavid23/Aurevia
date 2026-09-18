import { PageHero } from "@/components/public-site/PageHero";
import { RevenueSimulator } from "@/components/public-site/RevenueSimulator";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata = pageMetadata({ title: "Stimare i ricavi a Genova", description: "Construisez un scénario indicatif de revenu locatif brut à Genova à partir de votre tarif, de la disponibilité et des caractéristiques du bien.", path: "/simulatore" });

export default function Page() {
  return <ItalianContent><><PageHero label="Une estimation transparente" title="Potentiel locatif" text="Construisez un scénario brut à partir de vos chiffres. Chaque hypothèse reste visible et le résultat ne remplace jamais l’analyse du bien." image="/images/public-site/concierge/family-apartment-premium.webp" /><section className="section simulator-page"><div className="container simulator-intro"><div className="simulator-editorial-heading"><div className="watermark-heading simulator-watermark-heading"><p className="section-watermark" aria-hidden="true">SCÉNARIO LOCATIF</p><p className="eyebrow">Une première lecture chiffrée</p><h2>Vos chiffres posent<br /><em>les bonnes questions.</em></h2></div><p>Renseignez votre occupation, votre tarif et les caractéristiques du logement. Le simulateur construit un ordre de grandeur explicable, avant une analyse locale plus précise.</p></div><RevenueSimulator /></div></section></></ItalianContent>;
}
