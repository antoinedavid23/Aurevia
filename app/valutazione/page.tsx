import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ValuationForm } from "@/components/ValuationForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Estimation du bien", description: "Présentez votre propriété à Velyo et demandez une première analyse sans engagement.", alternates: { canonical: "/valutazione" } };

export default function Page() {
  return <><PageHero label="Estimation" title="Faisons connaissance avec votre propriété" text="Présentez-nous le bien, sa zone, les périodes disponibles et ce que vous souhaitez déléguer." image="/images/owners/property-care.webp" /><section className="section"><div className="container split"><div><p className="eyebrow">Première analyse</p><h2>Un échange simple, sans engagement.</h2><p className="dark-copy">Les informations permettent de comprendre la propriété, votre organisation actuelle et le niveau de service recherché.</p><p className="demo-note">Toute projection de revenu reste indicative et doit être confirmée après analyse du bien.</p></div><div className="form-card"><ValuationForm /><p className="form-privacy">Consultez notre <Link href="/privacy">politique de confidentialité</Link> pour connaître l’utilisation de vos données et vos droits.</p></div></div></section></>;
}
