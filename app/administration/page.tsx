import Link from "next/link";
import { BarChart3, BellRing, Building2, Database, MailCheck, ShieldCheck } from "lucide-react";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { AdminPropertyManager } from "@/components/AdminPropertyManager";
import { AdminLeadInbox } from "@/components/AdminLeadInbox";
import { getDb } from "@/db";
import { leads, managedProperties } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await requireChatGPTUser("/administration");
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(user.email.toLowerCase())) {
    return (
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Administration</p>
          <h1>Accès non autorisé</h1>
          <p>Ce compte ne fait pas partie des administrateurs AUREVIA.</p>
          <Link className="button" href="/">Retour au site</Link>
        </div>
      </section>
    );
  }

  let leadRows: Array<typeof leads.$inferSelect> = [];
  let propertyRows: Array<typeof managedProperties.$inferSelect> = [];
  try {
    const db = await getDb();
    [leadRows, propertyRows] = await Promise.all([
      db.select().from(leads),
      db.select().from(managedProperties),
    ]);
  } catch {
    // L’interface reste accessible si la base est temporairement indisponible.
  }

  const newLeads = leadRows.filter((lead) => lead.status === "new").length;
  const activeLeads = leadRows.filter((lead) => lead.status !== "archived").length;
  const publishedProperties = propertyRows.filter((property) => property.status === "published").length;
  const emailNotificationsReady = Boolean(process.env.RESEND_API_KEY);

  return (
    <>
      <section className="page-hero admin-hero">
        <div className="container">
          <p className="eyebrow">Espace administrateur</p>
          <h1>Centre de pilotage AUREVIA</h1>
          <p>
            Suivez les demandes, pilotez les biens et gardez une vision claire de
            l’activité depuis un espace privé.
          </p>
          <div className="admin-session">
            <span>Connecté avec {user.email}</span>
            <Link className="text-link" href={chatGPTSignOutPath("/")} prefetch={false}>
              Se déconnecter
            </Link>
          </div>
        </div>
      </section>

      <nav className="admin-subnav" aria-label="Navigation de l’administration">
        <div className="container">
          <a href="#vue-ensemble">Vue d’ensemble</a>
          <a href="#demandes">Demandes</a>
          <a href="#biens">Biens</a>
          <a href="#configuration">Configuration</a>
        </div>
      </nav>

      <main className="section admin-dashboard">
        <div className="container">
          <section id="vue-ensemble" className="admin-overview">
            <div className="admin-overview-heading">
              <div>
                <p className="eyebrow">Vue d’ensemble</p>
                <h2>L’essentiel, immédiatement</h2>
              </div>
              <p>Les indicateurs utiles pour prioriser les actions du jour.</p>
            </div>
            <div className="admin-kpis">
              <article>
                <BellRing size={20} />
                <strong>{newLeads}</strong>
                <span>Nouvelles demandes</span>
              </article>
              <article>
                <MailCheck size={20} />
                <strong>{activeLeads}</strong>
                <span>Demandes actives</span>
              </article>
              <article>
                <Building2 size={20} />
                <strong>{propertyRows.length}</strong>
                <span>Biens enregistrés</span>
              </article>
              <article>
                <BarChart3 size={20} />
                <strong>{publishedProperties}</strong>
                <span>Biens visibles en ligne</span>
              </article>
            </div>
          </section>

          <AdminLeadInbox />

          <section className="admin-properties-section">
            <p className="eyebrow">Collection</p>
            <h2>Gestion des biens</h2>
            <p className="admin-section-copy">
              Créez une fiche, préparez-la en brouillon puis publiez-la lorsque
              toutes les informations sont prêtes.
            </p>
            <AdminPropertyManager />
          </section>

          <section id="configuration" className="admin-system">
            <div>
              <p className="eyebrow">Configuration</p>
              <h2>État des services</h2>
              <p>Une lecture simple des fonctions indispensables au fonctionnement de l’espace.</p>
            </div>
            <div className="admin-system-list">
              <article>
                <Database size={19} />
                <div><strong>Base de données</strong><span>Biens et demandes conservés durablement</span></div>
                <b className="is-ready">Active</b>
              </article>
              <article>
                <ShieldCheck size={19} />
                <div><strong>Accès administrateur</strong><span>Réservé aux comptes autorisés</span></div>
                <b className="is-ready">Protégé</b>
              </article>
              <article>
                <MailCheck size={19} />
                <div><strong>Collecte des formulaires</strong><span>Contact et évaluation centralisés ici</span></div>
                <b className="is-ready">Active</b>
              </article>
              <article>
                <MailCheck size={19} />
                <div><strong>Notifications par e-mail</strong><span>Réception instantanée en complément de cette boîte</span></div>
                <b className={emailNotificationsReady ? "is-ready" : "needs-setup"}>
                  {emailNotificationsReady ? "Active" : "À configurer"}
                </b>
              </article>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
