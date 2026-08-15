import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import type { Metadata } from "next";
import { PropertyGrid } from "@/components/PropertyGrid";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export const metadata: Metadata = { title: "Propriétés", description: "Découvrez la structure de présentation des propriétés suivies par Velyo à Genova.", alternates: { canonical: "/proprieta" } };
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getChatGPTUser();
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  const isAdmin = !!user && allowed.includes(user.email.toLowerCase());
  return <><PageHero label="Propriétés" title="Une collection prête à accueillir les biens Velyo" text="Cette version présente des fiches de démonstration afin de valider le catalogue, les filtres et les pages détaillées." image="/images/home/genova-night.webp" /><section className="section ivory"><div className="container">{isAdmin && <div className="admin-entry"><div><span>Espace privé</span><b>Gérer la collection de biens</b></div><Link className="button" href="/administration">Ouvrir l’administration</Link></div>}<PropertyGrid /></div></section><CTA /></>;
}
