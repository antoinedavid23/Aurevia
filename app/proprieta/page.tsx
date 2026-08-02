import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proprietà esclusive in Liguria",
  description: "Scopra le proprietà affidate alla gestione AUREVIA a Genova e nelle località più prestigiose della Riviera Ligure.",
  alternates: { canonical: "/proprieta" },
};
import { PropertyGrid } from "@/components/PropertyGrid";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getChatGPTUser();
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  const isAdmin = !!user && allowed.includes(user.email.toLowerCase());
  return <>
    <PageHero label="Propriétés" title="Des demeures au caractère affirmé" text="Chaque propriété confiée à AUREVIA est veillée, préservée et entourée de la même attention que si elle était la nôtre." image="/images/home/liguria-coast.webp"/>
    <section className="section ivory"><div className="container">
      {isAdmin && <div className="admin-entry"><div><span>Espace privé</span><b>Gérer la collection de biens</b></div><Link className="button" href="/administration">Ouvrir l’administration</Link></div>}
      <PropertyGrid/>
    </div></section>
    <CTA/>
  </>;
}
