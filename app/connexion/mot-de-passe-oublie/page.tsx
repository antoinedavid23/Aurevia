import Link from "next/link";
import { Mail } from "lucide-react";

export default function Page() {
  const email = process.env.ADMIN_RECOVERY_EMAIL || "info@aurevia.it";
  return (
    <main className="admin-login-page">
      <section className="admin-login-form admin-recovery">
        <div className="admin-login-mark"><Mail size={19} /></div>
        <p className="eyebrow">Récupération</p>
        <h1>Mot de passe oublié</h1>
        <p>
          Pour ce compte administrateur unique, la réinitialisation est traitée
          uniquement depuis l’adresse de récupération autorisée.
        </p>
        <a
          className="button"
          href={`mailto:${email}?subject=Réinitialisation du compte administrateur AUREVIA`}
        >
          Demander la réinitialisation
        </a>
        <Link className="text-link" href="/connexion">Retour à la connexion</Link>
      </section>
    </main>
  );
}
