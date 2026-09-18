import Link from "next/link";
import { ItalianContent } from "@/components/public-site/ItalianContent";

export const metadata = { title: "Demande reçue", robots: { index: false, follow: false } };

export default function Page(){
  return <ItalianContent><section className="hero grazie-hero">
    <div className="container hero-content">
      <p className="eyebrow">Demande reçue</p>
      <h1>Votre demande est bien arrivée.</h1>
      <p className="hero-copy">Une personne va lire les informations transmises et revenir vers vous pour la suite.</p>
      <div className="actions">
        <Link className="button" href="/">Retour à l’accueil</Link>
        <Link className="button ghost" href="/servizi">Découvrir les services</Link>
      </div>
    </div>
  </section></ItalianContent>;
}
