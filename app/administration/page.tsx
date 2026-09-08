import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminPropertyManager } from "@/components/AdminPropertyManager";
import { AdminLeadInbox } from "@/components/AdminLeadInbox";
import { getAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contacts et dossiers | AUREVIA", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ demande?: string }> }) {
  const user = await getAdminUser();
  if (!user) redirect("/connexion");
  const { demande } = await searchParams;
  const selectedLeadId = demande && /^\d+$/.test(demande) ? Number(demande) : undefined;

  return <>
    <section className="page-hero admin-hero">
      <div className="container">
        <p className="eyebrow">Espace administrateur</p>
        <h1>Contacts & dossiers</h1>
        <nav className="admin-crm-nav" aria-label="Administration">
          <a href="#demandes">Contacts et audits</a>
          <a href="#biens">Gestion des biens</a>
          <Link href="/administration/strategia">Stratégie privée</Link>
        </nav>
        <div className="admin-session">
          <span>Connecté avec {user.email}</span>
          <form action="/api/admin/logout" method="post"><button className="text-link" type="submit">Se déconnecter</button></form>
        </div>
      </div>
    </section>
    <main className="section admin-dashboard" data-no-translate>
      <div className="container">
        <AdminLeadInbox initialSelectedId={selectedLeadId}/>
        <section id="biens" className="admin-properties-section">
          <p className="eyebrow">Collection</p>
          <h2>Propriétés AUREVIA</h2>
          <p className="admin-section-copy">Ajoutez un bien, préparez sa fiche puis publiez-la lorsque toutes les informations sont prêtes.</p>
          <AdminPropertyManager />
        </section>
      </div>
    </main>
  </>;
}
