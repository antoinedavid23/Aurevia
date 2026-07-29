import Link from "next/link";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { AdminPropertyManager } from "@/components/AdminPropertyManager";
import { chatGPTSignOutPath } from "@/app/chatgpt-auth";

export const dynamic="force-dynamic";

export default async function Page(){
  const user=await requireChatGPTUser("/administration");
  const allowed=(process.env.ADMIN_EMAILS||"").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean);
  if(!allowed.includes(user.email.toLowerCase())) return <section className="page-hero"><div className="container"><p className="eyebrow">Administration</p><h1>Accès non autorisé</h1><p>Ajoutez votre adresse à la variable sécurisée ADMIN_EMAILS pour activer cet espace.</p><Link className="button" href="/">Retour au site</Link></div></section>;
  return <><section className="page-hero admin-hero"><div className="container"><p className="eyebrow">Espace administrateur</p><h1>Gestion des biens</h1><p>Connecté en tant que {user.email}. Les changements publiés alimentent la collection visible sur le site.</p><Link className="text-link" href={chatGPTSignOutPath("/")} prefetch={false}>Se déconnecter</Link></div></section><section className="section"><div className="container"><AdminPropertyManager/></div></section></>;
}
