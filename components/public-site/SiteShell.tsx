"use client";

import Image from "@/components/public-site/SiteImage";
import Link from "next/link";
import { contactPhone, contactPhoneHref } from "@/lib/contact-details";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import { CTA } from "@/components/public-site/PageHero";
import { LanguageOptions } from "./LanguageOptions";
import { instagramProfile } from "@/lib/social-links";
import { ScrollRevealController } from "@/components/public-site/ScrollRevealController";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { PublicLocaleController } from "./PublicLocaleController";

const nav = [
  ["Accueil", "/"],
  ["Nos services", "/servizi"],
  ["Options voyageurs", "/esperienze"],
  ["Comment nous gérons", "/proprietari"],
  ["Nos biens", "/proprieta"],
  ["Estimer mon bien", "/simulatore"],
  ["À propos de AUREVIA", "/chi-siamo"],
  ["Nous contacter", "/contatti"],
] as const;

const primaryNav = [
  ["Services", "/servizi"],
  ["Expériences", "/esperienze"],
  ["Propriétaires", "/proprietari"],
  ["Estimation", "/simulatore"],
  ["Biens", "/proprieta"],
  ["À propos", "/chi-siamo"],
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo aurevia-logo${light ? " aurevia-logo-light" : ""}`} aria-label="Accueil AUREVIA">
      <Image
        src="/images/brand/aurevia-logo-no-tagline.png"
        width={1280}
        height={1280}
        sizes="160px"
        priority
        alt="AUREVIA"
      />
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdministration = pathname.startsWith("/administration");
  const showSiteCTA = !pathname.startsWith("/administration") && !pathname.startsWith("/connexion") && pathname !== "/valutazione" && pathname !== "/grazie";
  const [open, setOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [stickyHidden, setStickyHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setOpen(false);
      setHeaderHidden(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

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

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".site-footer-cta, .aurevia-footer"));
    if (!targets.length || !("IntersectionObserver" in window)) return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      setStickyHidden(visible.size > 0);
    }, { rootMargin: "0px 0px 48px 0px", threshold: 0 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname, showSiteCTA]);

  if (isAdministration) return <main>{children}</main>;

  const email = process.env.NEXT_PUBLIC_EMAIL || "contatto@aurevia-genova.com";


  return (
    <div data-aurevia-site data-no-translate><ItalianContent>
      <PublicLocaleController />
      <ScrollRevealController />
      <header className={`site-header aurevia-header${headerHidden ? " is-hidden" : ""}`}>
        <Logo />
        <nav className="desktop-navigation" aria-label="Navigation principale">
          {primaryNav.map(([name, href]) => (
            <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{name}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageOptions dropdown />
          <Link className="header-consultation" href="/valutazione">Confier un bien <ArrowRight size={14} /></Link>
          <Link className="admin-login" href="/connexion" aria-label="Espace propriétaire" title="Espace propriétaire"><LogIn size={17} /></Link>
        </div>
        <button className="menu-btn" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><span>Menu</span><Menu /></button>
      </header>

      {open && (
        <div className="mobile-menu aurevia-mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="mobile-menu-head"><Logo light /><button aria-label="Fermer le menu" onClick={() => setOpen(false)}><span>Fermer</span><X /></button></div>
          <nav aria-label="Navigation mobile">
            {nav.map(([name, href], index) => (
              <Link onClick={() => setOpen(false)} key={href} href={href} aria-current={pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "page" : undefined}>
                <span>{String(index + 1).padStart(2, "0")}</span>{name}<ArrowRight size={16} />
              </Link>
            ))}
          </nav>
          <div className="mobile-menu-footer">
            <LanguageOptions />
          <Link className="mobile-consultation" onClick={() => setOpen(false)} href="/valutazione">Confier mon bien <ArrowRight size={16} /></Link>
            <Link className="mobile-admin-login" onClick={() => setOpen(false)} href="/connexion"><LogIn size={16} /> Espace propriétaire</Link>
          </div>
        </div>
      )}

      <main>{children}</main>

      {showSiteCTA && <CTA />}

      <footer className="footer-main aurevia-footer">
        <div className="container footer-shell">
          <div className="footer-masthead">
            <div className="footer-identity"><Logo light /><span>Conciergerie locale à Genova.</span></div>
            <p className="footer-promise"><span>Votre bien, bien entouré.</span><em>Vos voyageurs, bien accueillis.</em></p>
            <div className="footer-direct-contact">
              <small>Contact direct</small>
              <a className="footer-direct-contact-link" href={`mailto:${email}`}><strong>{email}</strong><ArrowRight size={17} aria-hidden="true" /></a>
              <a className="footer-direct-contact-link" href={contactPhoneHref} data-no-translate><strong>{contactPhone}</strong><ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>

          <div className="footer-directory">
            <nav className="footer-column" aria-label="Explorer AUREVIA"><b>Explorer</b><Link href="/servizi">Nos services</Link><Link href="/esperienze">Options voyageurs</Link><Link href="/proprieta">Nos biens</Link><Link href="/chi-siamo">À propos de AUREVIA</Link></nav>
            <nav className="footer-column" aria-label="Solutions pour les propriétaires"><b>Propriétaires</b><Link href="/proprietari">Comment nous gérons</Link><Link href="/simulatore">Estimer mon bien</Link><Link href="/valutazione">Confier un bien</Link><Link href="/faq">Questions fréquentes</Link></nav>
            <div className="footer-column footer-contact"><b>Contact</b><a href={`mailto:${email}`}>{email}</a><a href={contactPhoneHref} data-no-translate>{contactPhone}</a><a href={instagramProfile.url} target="_blank" rel="noopener noreferrer" data-no-translate>Instagram</a><span>Genova, Italie</span><p>Chaque demande reçoit une réponse claire et personnalisée.</p></div>
          </div>

          <div className="footer-bottom"><span>{`© ${new Date().getFullYear()} AUREVIA`}</span><nav aria-label="Informations légales"><Link href="/mentions-legales">Mentions légales</Link><Link href="/privacy">Confidentialité</Link><Link href="/cookie-policy">Cookies</Link><Link href="/termini">Conditions d’utilisation</Link></nav></div>
        </div>
      </footer>

      <Link className={`sticky-cta${stickyHidden ? " is-hidden" : ""}`} href="/valutazione">Confier mon bien <ArrowRight size={16} /></Link>

    </ItalianContent></div>
  );
}
