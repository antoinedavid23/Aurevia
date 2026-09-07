import type { Metadata } from "next";
import { AuditFunnel } from "@/components/AuditFunnel";

export const metadata: Metadata = {
  title: "Diagnosi gratuita della proprietà",
  description: "Scopra il potenziale del Suo immobile e il percorso di gestione AUREVIA più adatto in pochi minuti.",
  alternates: { canonical: "/audit" },
  robots: { index: false, follow: false },
};

export default function Page(){ return <AuditFunnel/>; }
