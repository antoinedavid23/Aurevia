import Link from "next/link";
import {PageHero} from "./PageHero";

const email = process.env.NEXT_PUBLIC_EMAIL || "contatto@aurevia-genova.com";

export function LegalLayout({title, intro, children}:{title:string;intro:string;children:React.ReactNode}){
  return <><PageHero label="Informations légales" title={title} text={intro}/><section className="section ivory"><article className="container legal-content"><p className="legal-updated">Dernière mise à jour : 2 août 2026</p>{children}<div className="legal-contact"><strong>Une question concernant ces informations ?</strong><a href={`mailto:${email}`}>{email}</a></div></article></section></>;
}

export function LegalIdentityNotice(){return <p className="legal-note"><strong>Informations administratives à compléter avant l’ouverture commerciale :</strong> dénomination ou nom de l’exploitant, forme juridique, adresse du siège, numéro d’immatriculation, Partita IVA et identité du directeur de publication. Ces données doivent correspondre exactement aux documents officiels de l’entreprise.</p>}

export function LegalLinks(){return <p className="legal-inline-links"><Link href="/mentions-legales">Mentions légales</Link><Link href="/privacy">Confidentialité</Link><Link href="/cookie-policy">Cookies</Link><Link href="/termini">Conditions d’utilisation</Link></p>}
