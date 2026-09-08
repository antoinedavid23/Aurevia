import type { Metadata } from "next";
import { AuditFunnel } from "@/components/AuditFunnel";

export const metadata: Metadata = {
  title: "Audit gratuito del Suo immobile",
  description: "Ottenga l’audit gratuito del Suo immobile o portafoglio: ricavi potenziali, costi e netto stimato, sulla base delle Sue risposte. Senza impegno.",
  alternates: { canonical: "/audit" },
  robots: { index: false, follow: false },
};

export default function Page(){ return <AuditFunnel/>; }
