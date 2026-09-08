"use client";

import { AuditReport } from "./AuditThankYou";
import { auditEmailLabels, frenchAuditEmailPayload } from "@/lib/audit-email-fr";
import { readAuditSnapshot } from "@/lib/audit-snapshot";
import { isRecord, type CrmLead } from "@/lib/lead-crm";

const labels: Record<string, string> = { ...auditEmailLabels, consent: "Consentement au contact", name: "Prénom", surname: "Nom", phone: "Téléphone", email: "E-mail", message: "Message", subject: "Objet", area: "Territoire", zone: "Zone", neighborhood: "Quartier", address: "Adresse", constraint: "Contraintes", portfolio: "Portefeuille", status: "Situation", timing: "Échéance", objective: "Priorités", auditReport: "Audit complet", callPreparation: "Préparation de l’appel", confidentialMonthlyPlan: "Plan mensuel", declaredProperty: "Bien déclaré", declaredPerformance: "Situation actuelle" };
function label(key: string) { return labels[key] || key.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " "); }

export function DossierValues({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (depth > 10) return <span>Information trop imbriquée pour l’affichage.</span>;
  if (Array.isArray(value)) return <ul className="crm-value-list">{value.map((item, index) => <li key={index}><DossierValues value={item} depth={depth + 1}/></li>)}</ul>;
  if (isRecord(value)) return <dl className="crm-values">{Object.entries(value).map(([key, nested]) => <div key={key}><dt>{label(key)}</dt><dd><DossierValues value={nested} depth={depth + 1}/></dd></div>)}</dl>;
  return <span>{value == null || value === "" ? "Non renseigné / à vérifier" : typeof value === "boolean" ? value ? "Oui" : "Non" : typeof value === "number" ? value.toLocaleString("fr-FR", { maximumFractionDigits: 4 }) : String(value)}</span>;
}

export function AdminAuditDossier({ lead }: { lead: CrmLead }) {
  const stored = readAuditSnapshot(lead.details.auditSnapshot, lead.name, lead.id);
  const translated = frenchAuditEmailPayload({ ...lead.details, auditReport: lead.details.auditReport, name: lead.name, surname: lead.surname, email: lead.email, message: lead.message });
  const report = isRecord(translated.auditReport) ? translated.auditReport : null;
  const answers = Object.fromEntries(Object.entries(translated).filter(([key]) => !["auditSnapshot", "auditReport", "website", "name", "surname", "email", "phone", "message"].includes(key)));
  return <div className="crm-dossier-body">
    <section className="crm-contact-record"><h3>Demande & opt-in</h3>
      <p>Reçu le {new Date(lead.createdAt).toLocaleString("fr-FR")}. {lead.details.consent === true || lead.details.consent === "on" ? "Consentement au contact enregistré." : "Consentement non renseigné dans ce dossier historique."}</p>
      <p className="crm-original-message">{translated.message}</p>
      <details><summary>Réponses et informations du bien</summary><DossierValues value={answers}/></details>
    </section>
    {stored && <AuditReport stored={stored} locale="fr" internal/>}
    {!stored && report && <p className="crm-legacy-note">Dossier historique : les informations enregistrées sont restituées ci-dessous sans nouveau calcul. La copie de présentation du bilan client n’était pas encore conservée.</p>}
    {report && <section className="crm-private-record"><h3>Informations internes · non floutées</h3>
      <p>Réponses libres conservées dans leur langue d’origine. Les données de marché non vérifiées restent à confirmer lors de l’appel.</p>
      {Object.entries(report).map(([key, value]) => <details key={key} open={["callPreparation", "declaredProperty", "declaredPerformance"].includes(key) || !stored}>
        <summary>{label(key)}</summary><DossierValues value={value}/>
      </details>)}
    </section>}
  </div>;
}
