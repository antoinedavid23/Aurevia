"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const nav = [
  ["Services", "/servizi"],
  ["Propriétés", "/proprieta"],
  ["Expériences", "/esperienze"],
  ["À propos", "/chi-siamo"],
  ["Simulateur", "/simulatore"],
  ["Contact", "/contatti"],
];

export function Logo() {
  return <Link href="/" className="logo" aria-label="Accueil AUREVIA"><Image src="/images/brand/aurevia-logo-transparent-gold.png" width={420} height={420} priority alt="AUREVIA Private Concierge"/></Link>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [cookies, setCookies] = useState(true);
  return <>
    <header>
      <Logo/>
      <nav>{nav.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}<span className="lang">FR</span><Link className="button small" href="/valutazione">Évaluer mon bien</Link></nav>
      <button className="menu-btn" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}><Menu/></button>
    </header>
    {open && <div className="mobile-menu"><button aria-label="Fermer le menu" onClick={() => setOpen(false)}><X/></button><Logo/>{nav.map(([name, href]) => <Link onClick={() => setOpen(false)} key={href} href={href}>{name}</Link>)}<Link className="button" onClick={() => setOpen(false)} href="/valutazione">Évaluer mon bien</Link></div>}
    <main>{children}</main>
    <footer>
      <div className="footer-grid">
        <div><Logo/><p>L’art de prendre soin de ce qui compte.</p></div>
        <div><b>Explorer</b>{nav.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</div>
        <div><b>Propriétaires</b><Link href="/proprietari">Gestion AUREVIA</Link><Link href="/valutazione">Évaluation privée</Link><Link href="/faq">Questions fréquentes</Link></div>
        <div><b>Contact</b><a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || "info@aurevia.it"}`}>{process.env.NEXT_PUBLIC_EMAIL || "info@aurevia.it"}</a><span>Gênes, Italie</span><div className="social"><span>IG</span><span>IN</span></div></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AUREVIA</span><Link href="/privacy">Confidentialité</Link><Link href="/cookie-policy">Cookies</Link><Link href="/termini">Conditions</Link></div>
    </footer>
    <Link className="sticky-cta" href="/valutazione">Évaluer mon bien <ArrowRight size={16}/></Link>
    {cookies && <div className="cookie"><p>Nous utilisons uniquement des cookies essentiels. Vos préférences restent sur cet appareil.</p><button onClick={() => { localStorage.setItem("aurevia-cookie", "accepted"); setCookies(false); }}>Accepter</button><button onClick={() => setCookies(false)}>Refuser</button></div>}
  </>;
}
