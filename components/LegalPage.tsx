import Link from "next/link";
import { PageHero } from "./PageHero";

const email = process.env.NEXT_PUBLIC_EMAIL || "contact@velyo.pm";

export function LegalLayout({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return <><PageHero label="Informations légales" title={title} text={intro} /><section className="section ivory"><article className="container legal-content"><p className="legal-updated">Version de travail · à valider avant publication commerciale</p>{children}<div className="legal-contact"><strong>Une question concernant ces informations ?</strong><a href={`mailto:${email}`}>{email}</a></div></article></section></>;
}

export function LegalIdentityNotice() {
  return <p className="legal-note"><strong>À compléter avant publication :</strong> dénomination de l’exploitant, forme juridique, siège, immatriculation, Partita IVA et identité du responsable de publication.</p>;
}

export function LegalLinks() {
  return <p className="legal-inline-links"><Link href="/mentions-legales">Mentions légales</Link><Link href="/privacy">Confidentialité</Link><Link href="/cookie-policy">Cookies</Link><Link href="/termini">Conditions d’utilisation</Link></p>;
}
