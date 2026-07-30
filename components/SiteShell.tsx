"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, LogIn, Menu, X } from "lucide-react";
import { LanguageOptions, useLocale } from "@/components/LocaleController";
import { localeNames } from "@/lib/i18n";

const nav = [
  ["Services", "/servizi"],
  ["Propriétés", "/proprieta"],
  ["Expériences", "/esperienze"],
  ["À propos", "/chi-siamo"],
  ["Simulateur", "/simulatore"],
  ["Contact", "/contatti"],
];

export function Logo() {
  return <Link href="/" className="logo logo-legacy-crop" aria-label="Accueil AUREVIA"><Image src="/images/brand/aurevia-logo-transparent-gold.png" width={420} height={420} priority alt="AUREVIA"/></Link>;
}

function LanguageSelector() {
  const { locale } = useLocale();
  const [languageOpen, setLanguageOpen] = useState(false);
  return <div className={`language-selector${languageOpen ? " is-open" : ""}`}>
    <button
      type="button"
      className="language-selector-trigger"
      aria-label="Choisir la langue"
      aria-expanded={languageOpen}
      onClick={() => setLanguageOpen((current) => !current)}
    >
      {localeNames[locale].short} <ChevronDown size={13}/>
    </button>
    {languageOpen && <div className="language-selector-menu"><LanguageOptions onSelect={() => setLanguageOpen(false)}/></div>}
  </div>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cookies, setCookies] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCookies(!localStorage.getItem("aurevia-cookie")));
    return () => cancelAnimationFrame(frame);
  }, []);
  function saveCookieChoice(choice: "accepted" | "refused") {
    localStorage.setItem("aurevia-cookie", choice);
    setCookies(false);
  }
  return <>
    <header>
      <Logo/>
      <nav>{nav.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}<LanguageSelector/><Link className="button small" href="/valutazione">Évaluer mon bien</Link><Link className="admin-login" href="/connexion" aria-label="Se connecter à l’administration"><LogIn size={14}/><span>Connexion</span></Link></nav>
      <button className="menu-btn" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}><Menu/></button>
    </header>
    {open && <div className="mobile-menu"><button aria-label="Fermer le menu" onClick={() => setOpen(false)}><X/></button><Logo/>{nav.map(([name, href]) => <Link onClick={() => setOpen(false)} key={href} href={href}>{name}</Link>)}<div className="mobile-language-options" aria-label="Choisir la langue"><LanguageOptions onSelect={() => setOpen(false)}/></div><Link className="button" onClick={() => setOpen(false)} href="/valutazione">Évaluer mon bien</Link><Link className="mobile-admin-login" onClick={() => setOpen(false)} href="/connexion"><LogIn size={18}/> Connexion administrateur</Link></div>}
    <main>{children}</main>
    <footer className="footer-premium">
      <div className="footer-signature">
        <Logo/>
        <div className="footer-statement"><h2><span>Une présence locale</span><span>Une exigence sans compromis</span></h2></div>
        <Link className="footer-consultation" href="/valutazione">Confier ma propriété <ArrowRight size={17}/></Link>
      </div>
      <div className="footer-grid">
        <div className="footer-brand"><b>AUREVIA</b><p><span>L’art de prendre soin</span><span>de ce qui compte.</span></p><small>Gestion et valorisation de propriétés d’exception.</small></div>
        <div><b>Explorer</b>{nav.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</div>
        <div><b>Propriétaires</b><Link href="/proprietari">Gestion AUREVIA</Link><Link href="/valutazione">Évaluation privée</Link><Link href="/faq">Questions fréquentes</Link></div>
        <div className="footer-contact"><b>Contact privé</b><a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || "contatto@aurevia-genova.com"}`}>{process.env.NEXT_PUBLIC_EMAIL || "contatto@aurevia-genova.com"}</a><span>Gênes, Italie</span><p>Chaque demande est étudiée personnellement et traitée avec la plus grande discrétion.</p></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AUREVIA</span><Link href="/privacy">Confidentialité</Link><Link href="/cookie-policy">Cookies</Link><Link href="/termini">Conditions</Link></div>
    </footer>
    <Link className="sticky-cta" href="/valutazione">Évaluer mon bien <ArrowRight size={16}/></Link>
    {cookies && <div className="cookie" role="dialog" aria-label="Vos préférences de confidentialité"><div className="cookie-mark">A</div><div className="cookie-copy"><strong>Votre confidentialité, sans compromis</strong><p>Le site utilise uniquement les éléments essentiels à son fonctionnement. Aucun cookie publicitaire n’est déposé sans votre accord.</p><Link href="/cookie-policy">Consulter notre politique de confidentialité</Link></div><div className="cookie-actions"><button className="cookie-primary" onClick={() => saveCookieChoice("accepted")}>Accepter</button><button onClick={() => saveCookieChoice("refused")}>Continuer sans accepter</button></div></div>}
  </>;
}
