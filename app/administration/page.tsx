import Link from "next/link";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { AdminPropertyManager } from "@/components/AdminPropertyManager";
import { AdminLeadInbox } from "@/components/AdminLeadInbox";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await requireChatGPTUser("/administration");
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) return <section className="page-hero"><div className="container"><p className="eyebrow">Administration</p><h1>Accès non autorisé</h1><p>Ce compte ne fait pas partie des administrateurs AUREVIA.</p><Link className="button" href="/">Retour au site</Link></div></section>;
  return <>
    <section className="page-hero admin-hero"><div className="container"><p className="eyebrow">Espace administrateur</p><h1>Pilotage AUREVIA</h1><p>Connecté en tant que {user.email}. Gérez les biens publiés et centralisez toutes les demandes reçues.</p><Link className="text-link" href={chatGPTSignOutPath("/")} prefetch={false}>Se déconnecter</Link></div></section>
    <section className="section admin-dashboard"><div className="container"><AdminLeadInbox/><div className="admin-properties-section"><p className="eyebrow">Collection</p><h2>Gestion des biens</h2><AdminPropertyManager/></div></div></section>
  </>;
}
