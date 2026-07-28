"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const nav = [["Servizi","/servizi"],["Proprietà","/proprieta"],["Esperienze","/esperienze"],["Chi siamo","/chi-siamo"],["Simulatore","/simulatore"],["Contatti","/contatti"]];

export function Logo() {
  return <Link href="/" className="logo" aria-label="AUREVIA home"><Image src="/images/brand/aurevia-logo-gold.svg" width={280} height={75} priority alt="AUREVIA Private Concierge"/></Link>;
}

export function SiteShell({children}:{children:React.ReactNode}) {
  const [open,setOpen]=useState(false);
  const [cookies,setCookies]=useState(true);
  return <>
    <header><Logo/><nav>{nav.map(([name,href])=><Link key={href} href={href}>{name}</Link>)}<span className="lang">IT</span><Link className="button small" href="/valutazione">Valuta la tua proprietà</Link></nav><button className="menu-btn" aria-label="Apri menu" onClick={()=>setOpen(true)}><Menu/></button></header>
    {open&&<div className="mobile-menu"><button aria-label="Chiudi menu" onClick={()=>setOpen(false)}><X/></button><Logo/>{nav.map(([name,href])=><Link onClick={()=>setOpen(false)} key={href} href={href}>{name}</Link>)}<Link className="button" onClick={()=>setOpen(false)} href="/valutazione">Valuta la tua proprietà</Link></div>}
    <main>{children}</main>
    <footer><div className="footer-grid"><div><Logo/><p>L’arte di prendersi cura di ciò che conta.</p></div><div><b>Esplora</b>{nav.map(([name,href])=><Link key={href} href={href}>{name}</Link>)}</div><div><b>Proprietari</b><Link href="/proprietari">Gestione AUREVIA</Link><Link href="/valutazione">Valutazione privata</Link><Link href="/faq">Domande frequenti</Link></div><div><b>Contatti</b><a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL||"info@aurevia.it"}`}>{process.env.NEXT_PUBLIC_EMAIL||"info@aurevia.it"}</a><span>Genova, Italia</span><div className="social"><span>IG</span><span>IN</span></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} AUREVIA</span><Link href="/privacy">Privacy</Link><Link href="/cookie-policy">Cookie</Link><Link href="/termini">Termini</Link></div></footer>
    <Link className="sticky-cta" href="/valutazione">Valuta la tua proprietà <ArrowRight size={16}/></Link>
    {cookies&&<div className="cookie"><p>Usiamo solo cookie essenziali. Le preferenze restano su questo dispositivo.</p><button onClick={()=>{localStorage.setItem("aurevia-cookie","accepted");setCookies(false)}}>Accetta</button><button onClick={()=>setCookies(false)}>Rifiuta</button></div>}
  </>;
}
