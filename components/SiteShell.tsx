"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";

const nav = [
  ["Accueil", "/"],
  ["Services", "/servizi"],
  ["Expériences", "/esperienze"],
  ["Accompagnement", "/proprietari"],
  ["Propriétés", "/proprieta"],
  ["Simulateur", "/simulatore"],
  ["À propos", "/chi-siamo"],
  ["Contact", "/contatti"],
] as const;

const primaryNav = nav.filter(([, href]) => href !== "/");

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="logo velyo-logo" aria-label="Accueil Velyo Property Manager">
      <Image
        src={light ? "/images/brand/velyo-logo-light.svg" : "/images/brand/velyo-logo-dark.svg"}
        width={430}
        height={120}
        sizes="190px"
        priority
        alt="Velyo Property Manager"
      />
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivateStrategy = pathname.startsWith("/administration/strategia");
  const [open, setOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [cookies, setCookies] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCookies(!localStorage.getItem("velyo-cookie")));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const updateHeader = () => {
      const currentY = window.scrollY;
      if (open || currentY < 100) setHeaderHidden(false);
      else if (currentY > lastY + 6) setHeaderHidden(true);
      else if (currentY < lastY - 6) setHeaderHidden(false);
      lastY = currentY;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function saveCookieChoice(choice: "accepted" | "refused") {
    localStorage.setItem("velyo-cookie", choice);
    setCookies(false);
  }

  if (isPrivateStrategy) return <main>{children}</main>;

  const email = process.env.NEXT_PUBLIC_EMAIL || "contact@velyo.pm";
  const phone = process.env.NEXT_PUBLIC_PHONE || "+39 010 000 00 00";

  return (
    <>
      <header className={`site-header velyo-header${headerHidden ? " is-hidden" : ""}`}>
        <Logo />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          {primaryNav.map(([name, href]) => (
            <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{name}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-consultation" href="/valutazione">Estimer mon bien <ArrowRight size={14} /></Link>
          <Link className="admin-login" href="/connexion" aria-label="Espace propriétaire" title="Espace propriétaire"><LogIn size={17} /></Link>
        </div>
        <button className="menu-btn" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><span>Menu</span><Menu /></button>
      </header>

      {open && (
        <div className="mobile-menu velyo-mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="mobile-menu-head"><Logo light /><button aria-label="Fermer le menu" onClick={() => setOpen(false)}><span>Fermer</span><X /></button></div>
          <nav aria-label="Navigation mobile">
            {nav.map(([name, href], index) => (
              <Link onClick={() => setOpen(false)} key={href} href={href} aria-current={pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "page" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span>{name}<ArrowRight size={16} />
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <Link className="mobile-consultation" onClick={() => setOpen(false)} href="/valutazione">Estimer mon bien <ArrowRight size={16} /></Link>
            <Link className="mobile-admin-login" onClick={() => setOpen(false)} href="/connexion"><LogIn size={16} /> Espace propriétaire</Link>
          </div>
        </div>
      )}

      <main>{children}</main>

      <footer className="footer-premium velyo-footer">
        <div className="footer-signature">
          <Logo light />
          <div className="footer-statement"><h2><span>Une présence locale à Genova.</span><span>Un quotidien plus simple à gérer.</span></h2></div>
          <Link className="footer-consultation" href="/valutazione">Parler de mon bien <ArrowRight size={17} /></Link>
        </div>
        <div className="footer-grid">
          <div className="footer-brand"><b>VELYO</b><p><span>Votre bien, bien géré.</span><span>Vos voyageurs, bien accueillis.</span></p><small>Property management local à Genova.</small></div>
          <div><b>Explorer</b>{nav.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</div>
          <div><b>Propriétaires</b><Link href="/proprietari">Accompagnement</Link><Link href="/valutazione">Estimation</Link><Link href="/faq">Questions fréquentes</Link><Link href="/connexion">Espace propriétaire</Link></div>
          <div className="footer-contact"><b>Contact</b><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a><span>Genova, Italie</span><p>Chaque demande reçoit une réponse claire et personnalisée.</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Velyo Property Manager</span><Link href="/mentions-legales">Mentions légales</Link><Link href="/privacy">Confidentialité</Link><Link href="/cookie-policy">Cookies</Link><Link href="/termini">Conditions d’utilisation</Link></div>
      </footer>

      <Link className="sticky-cta" href="/valutazione">Estimer mon bien <ArrowRight size={16} /></Link>

      {cookies && (
        <div className="cookie velyo-cookie" role="dialog" aria-label="Information relative aux cookies">
          <div className="cookie-mark">V</div>
          <div className="cookie-copy"><strong>Des cookies utiles, rien de plus.</strong><p>Le site utilise uniquement les mécanismes nécessaires à son fonctionnement. Aucun profilage publicitaire n’est prévu.</p><Link href="/cookie-policy">Consulter la politique cookies</Link></div>
          <div className="cookie-actions"><button className="cookie-secondary" onClick={() => saveCookieChoice("refused")}>Refuser</button><button className="cookie-primary" onClick={() => saveCookieChoice("accepted")}>J’ai compris</button></div>
        </div>
      )}
    </>
  );
}
