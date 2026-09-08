type LeadKind = "contact" | "valuation";
import { storeLead } from "@/lib/lead-storage";
type LeadPayload = Record<string, unknown> & {
  name: string;
  surname: string;
  email: string;
  message: string;
  website?: string;
};

// Audit dossiers must reach the team's dedicated mailbox, independently of
// the recipient configured for the site's other contact forms.
const AUDIT_RECIPIENT = "contatto@aurevia-genova.com";

const labels: Record<string, string> = {
  name: "Prénom", surname: "Nom", email: "E-mail", phone: "Téléphone",
  profile: "Profil", subject: "Objet", city: "Ville", address: "Adresse",
  propertyType: "Type de bien", type: "Type de bien", propertyCount: "Nombre de biens",
  timeline: "Délai", bedrooms: "Chambres", bathrooms: "Salles de bain",
  capacity: "Capacité", finish: "Finition", amenities: "Équipements",
  services: "Services recherchés", currentlyRented: "Bien déjà loué",
  availability: "Disponibilité", currentOccupancy: "Occupation actuelle",
  currentRevenue: "Revenu actuel", objective: "Objectif", message: "Message",
  portfolio: "Taille du portefeuille", status: "Situation actuelle", area: "Zone",
  timing: "Délai souhaité", distribution: "Canaux de distribution",
  compliance: "Conformité", ownerConstraint: "Contrainte principale",
  zone: "Zone / commune", neighborhood: "Quartier", localityName: "Localité précisée", neighborhoodName: "Quartier précisé",
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function humanize(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function renderInternalValue(value: unknown): string {
  if (value == null) return "Non renseigné / à confirmer";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) {
    if (value.every((item) => !isRecord(item) && !Array.isArray(item))) return value.map(renderInternalValue).join(", ");
    return value.map((item) => isRecord(item)
      ? `<div style="margin:8px 0;padding:10px 12px;background:#f6f3eb;border-left:3px solid #c8a15a">${Object.entries(item).map(([key, nested]) => `<div><b>${escapeHtml(humanize(key))} :</b> ${renderInternalValue(nested)}</div>`).join("")}</div>`
      : renderInternalValue(item)).join("");
  }
  if (isRecord(value)) {
    return `<div style="display:grid;gap:4px">${Object.entries(value).map(([key, nested]) => `<div><b>${escapeHtml(humanize(key))} :</b> ${renderInternalValue(nested)}</div>`).join("")}</div>`;
  }
  return escapeHtml(value);
}

function renderInternalText(value: unknown, depth = 0): string {
  if (value == null) return "Non renseigné / à confirmer";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) {
    return value.map((item, index) => `${"  ".repeat(depth)}${index + 1}. ${renderInternalText(item, depth + 1)}`).join("\n");
  }
  if (isRecord(value)) {
    return Object.entries(value).map(([key, nested]) => {
      const heading = `${"  ".repeat(depth)}${labels[key] || humanize(key)} :`;
      return `${heading}${isRecord(nested) || Array.isArray(nested) ? "\n" : " "}${renderInternalText(nested, depth + 1)}`;
    }).join("\n");
  }
  return String(value);
}

function renderAuditReport(value: unknown) {
  if (!isRecord(value)) return "";
  const sectionLabels: Record<string, string> = {
    portfolioProjection: "Projection du portefeuille — nombre exact et hypothèses",
    perProperty: "Résultats par logement représentatif",
    qualification: "Qualification du prospect",
    locationModel: "Localisation et hypothèses tarifaires — non calibrées sur le marché",
    evidenceAndLimits: "Hypothèses et limites de l’analyse",
    distributionModel: "Canaux de réservation et commissions",
    declaredProperty: "Bien déclaré",
    declaredPerformance: "Performance déclarée",
    aureviaCentralModel: "Modèle financier AUREVIA",
    internalScores: "Scores internes",
    confidentialMonthlyPlan: "Plan mensuel confidentiel",
    callPreparation: "Préparation de l’appel",
  };
  const meta = ["reportVersion", "generatedAt", "language"];
  const metadata = meta
    .filter((key) => value[key] !== undefined)
    .map((key) => `<span style="margin-right:18px"><b>${escapeHtml(humanize(key))} :</b> ${escapeHtml(value[key])}</span>`)
    .join("");
  const sections = Object.entries(value)
    .filter(([key]) => !meta.includes(key))
    .map(([key, section]) => `<section style="margin-top:24px"><h2 style="margin:0;padding:11px 14px;background:#0d1b2a;color:#e2c782;font:20px Georgia,serif">${escapeHtml(sectionLabels[key] || humanize(key))}</h2><div style="padding:14px;border:1px solid #d9d3c7;border-top:0;line-height:1.55">${renderInternalValue(section)}</div></section>`)
    .join("");
  return `<div style="margin-top:30px;padding-top:24px;border-top:3px solid #c8a15a"><h1 style="margin:0 0 8px;font:28px Georgia,serif;color:#0d1b2a">Dossier interne complet AUREVIA</h1><p style="margin:0;color:#677176">Strictement interne — contient les données masquées au prospect et les points à vérifier pendant l’appel.</p><p style="font-size:12px;color:#7b8386">${metadata}</p>${sections}</div>`;
}

async function sendLeadEmail(kind: LeadKind, payload: LeadPayload) {
  const isAudit = kind === "valuation" && isRecord(payload.auditReport);
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = isAudit ? AUDIT_RECIPIENT : process.env.CONTACT_RECIPIENT || AUDIT_RECIPIENT;
  const from = process.env.CONTACT_FROM || "AUREVIA <contact@aurevia-genova.com>";
  if (!apiKey?.trim()) {
    if (isAudit) console.error("AUREVIA audit email not configured: RESEND_API_KEY is missing. Inbox storage is not email delivery.");
    return null;
  }

  const ignored = new Set(["website", "consent"]);
  const auditReport = payload.auditReport;
  // Contact details always come first, even if the submitted object's order changes.
  const contactKeys = ["name", "surname", "email", "phone"];
  const entries = [...contactKeys.map(key => [key, payload[key]] as const),
    ...Object.entries(payload).filter(([key]) => !contactKeys.includes(key))]
    .filter(([key, value]) => !ignored.has(key) && key !== "auditReport" && value !== "" && value != null);
  const rows = entries
    .map(([key, value]) => {
      return `<tr><th style="padding:10px;text-align:left;vertical-align:top;border-bottom:1px solid #ddd">${escapeHtml(labels[key] || humanize(key))}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-line">${renderInternalValue(value)}</td></tr>`;
    }).join("");
  const title = isAudit ? "Nouvel audit AUREVIA" : "Nouvelle demande AUREVIA";
  const introduction = isAudit
    ? "Coordonnées du client, réponses et audit intégral ci-dessous, y compris les parties réservées à AUREVIA. Répondez à ce mail pour contacter le client. Aucun mail ne lui a été envoyé."
    : "Une demande a été envoyée depuis aurevia-genova.com.";
  const subject = `${isAudit ? "Audit complet AUREVIA" : kind === "valuation" ? "Nouvelle évaluation" : "Nouveau contact"} — ${payload.name} ${payload.surname}`.replace(/[\r\n]+/g, " ");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: payload.email,
      subject,
      html: `<div style="font-family:Arial,sans-serif;color:#0d1b2a;max-width:920px;margin:auto"><h1 style="font-family:Georgia,serif">${title}</h1><p>${introduction}</p><table style="width:100%;border-collapse:collapse">${rows}</table>${renderAuditReport(auditReport)}</div>`,
      text: `${title}\n\n${introduction}\n\n${renderInternalText(Object.fromEntries(entries))}${isRecord(auditReport) ? `\n\nDOSSIER INTERNE COMPLET — CONFIDENTIEL\n\n${renderInternalText(auditReport)}` : ""}`,
    }),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend a refusé l’envoi (${response.status}) : ${details.slice(0, 500)}`);
  }
  const result = await response.json() as { id?: string };
  if (!result.id) throw new Error("Resend n’a pas confirmé l’envoi.");
  return result.id;
}

export async function deliverLead(kind: LeadKind, payload: LeadPayload) {
  if (payload.website) return { reference: "filtered", channels: ["spam-filter"] };
  if (kind === "valuation" && isRecord(payload.auditReport)) {
    // Internal inbox and team email are independent delivery channels.
    // The visitor never receives an email, and success requires a real receipt.
    const [inbox, email] = await Promise.allSettled([storeLead(kind, payload), sendLeadEmail(kind, payload)]);
    const storedId = inbox.status === "fulfilled" ? inbox.value.id : null;
    const emailId = email.status === "fulfilled" ? email.value : null;
    if (inbox.status === "rejected") console.error("AUREVIA audit inbox unavailable", inbox.reason);
    if (email.status === "rejected") console.error("AUREVIA audit notification unavailable", email.reason);
    if (!storedId && !emailId) throw new Error("Aucun canal de réception AUREVIA n’a confirmé le dossier.");
    return {
      reference: emailId || `audit-${storedId}`,
      leadId: storedId,
      channels: [...(storedId ? ["inbox"] : []), ...(emailId ? ["email"] : [])],
    };
  }
  const emailId = await sendLeadEmail(kind, payload);
  if (!emailId) throw new Error("RESEND_API_KEY n’est pas configurée dans l’environnement du site.");
  let storedId: number | null = null;
  try {
    storedId = (await storeLead(kind, payload)).id;
  } catch (error) {
    console.error("AUREVIA lead storage unavailable", error);
  }
  return { reference: emailId, leadId: storedId, channels: storedId ? ["email", "inbox"] : ["email"] };
}
