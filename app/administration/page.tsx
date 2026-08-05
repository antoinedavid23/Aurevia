import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminPropertyManager } from "@/components/AdminPropertyManager";
import { getAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getAdminUser();
  if (!user) redirect("/connexion");

  return <>
    <section className="page-hero admin-hero">
      <div className="container">
        <p className="eyebrow">Espace administrateur</p>
        <h1>Gestion des biens</h1>
        <p>Créez, préparez et publiez les propriétés présentées sur le site AUREVIA.</p>
        <div className="admin-session">
          <span>Connecté avec {user.email}</span>
          <form action="/api/admin/logout" method="post"><button className="text-link" type="submit">Se déconnecter</button></form>
        </div>
      </div>
    </section>
    <main className="section admin-dashboard">
      <div className="container">
        <section id="biens" className="admin-properties-section">
          <p className="eyebrow">Collection</p>
          <h2>Propriétés AUREVIA</h2>
          <p className="admin-section-copy">Ajoutez un bien, préparez sa fiche puis publiez-la lorsque toutes les informations sont prêtes.</p>
          <Link className="button small" href="/administration/strategia">Apri la strategia privata</Link>
          <AdminPropertyManager />
        </section>
      </div>
    </main>
  </>;
}
