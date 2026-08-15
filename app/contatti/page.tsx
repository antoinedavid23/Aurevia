import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { ArrowUpRight, Clock3, Mail, MapPin, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: "Présentez votre propriété et votre besoin de gestion à Velyo.", alternates: { canonical: "/contatti" } };

export default function Page() {
  const email = process.env.NEXT_PUBLIC_EMAIL || "contact@velyo.pm";
  return <><PageHero label="Contact" title="Parlons de votre bien et de ce que vous souhaitez déléguer" text="Une première conversation permet de comprendre la propriété, la zone et le niveau d’accompagnement recherché." image="/images/contact/contact-still-life.webp" /><section className="section"><div className="container split contact-layout"><div className="contact-intro"><p className="eyebrow">Premier échange</p><h2 className="contact-heading"><span>Une réponse claire,</span><span>personnelle</span><span>et locale.</span></h2><p>Décrivez-nous le logement, sa situation et votre organisation actuelle. Nous reviendrons vers vous pour préparer un premier diagnostic.</p><div className="contact-panel"><div className="contact-panel-head"><div><small>Coordonnées directes</small><strong>VELYO · Genova</strong></div><ShieldCheck size={22} /></div><div className="contact-details"><a className="contact-primary" href={`mailto:${email}`}><span className="contact-icon"><Mail size={18} /></span><span><small>E-mail</small>{email}</span><ArrowUpRight size={17} /></a><div><span className="contact-icon"><MapPin size={18} /></span><span><small>Zone d’intervention</small>Genova et zones proches après étude</span></div><div><span className="contact-icon"><Clock3 size={18} /></span><span><small>Délai indicatif de réponse</small>Sous 1 jour ouvré</span></div></div><p className="contact-reassurance">Les informations sont utilisées uniquement pour traiter votre demande.</p></div><div className="contact-feature-image" role="img" aria-label="Dossier Velyo préparé pour un propriétaire" /></div><div className="form-card"><p className="eyebrow">Votre demande</p><LeadForm /><p className="form-privacy">Consultez notre <Link href="/privacy">politique de confidentialité</Link> pour connaître l’utilisation de vos données et vos droits.</p></div></div></section></>;
}
