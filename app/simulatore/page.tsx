import { PageHero } from "@/components/PageHero";
import { RevenueSimulator } from "@/components/RevenueSimulator";

export const metadata = { title: "Simulateur de revenus locatifs", description: "Obtenez une première projection indicative selon la zone, la capacité, les équipements et la disponibilité du bien.", alternates: { canonical: "/simulatore" } };

export default function Page() {
  return <><PageHero label="Simulateur" title="Une première lecture du potentiel de votre bien" text="La projection reste indicative. La localisation précise, l’état, les équipements et le calendrier réel doivent être analysés avant toute décision." image="/images/home/genova-night.webp" /><section className="section"><div className="container simulator-intro"><div className="simulator-brand-image velyo-simulator-brand" aria-hidden="true" /><RevenueSimulator /></div></section></>;
}
