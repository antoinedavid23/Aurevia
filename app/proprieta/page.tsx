import Link from "next/link";
import { PageHero } from "@/components/public-site/PageHero";
import type { Metadata } from "next";
import { PropertyGrid } from "@/components/public-site/PropertyGrid";
import { getAdminUser } from "@/lib/admin";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({ title: "Biens gérés par AUREVIA", description: "Découvrez les biens gérés par AUREVIA à Genova, publiés uniquement avec l’accord explicite de leurs propriétaires.", path: "/proprieta" });
export const dynamic = "force-dynamic";

export default async function Page() {
  const isAdmin = Boolean(await getAdminUser());
  return <ItalianContent><><PageHero label="Biens confiés à AUREVIA" title="Nos biens" text="Les biens apparaissent ici seulement après leur mise en gestion et l’accord du propriétaire." image="/images/public-site/concierge/family-apartment-premium.webp" /><section className="section ivory properties-empty-section"><div className="container">{isAdmin && <div className="admin-entry"><div><span>Espace privé</span><b>Gérer les biens</b></div><Link className="button" href="/administration">Ouvrir l’administration</Link></div>}<PropertyGrid /></div></section></></ItalianContent>;
}
