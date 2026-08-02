type LeadKind = "contact" | "valuation";
type LeadPayload = Record<string, unknown> & {
  name: string;
  surname: string;
  email: string;
  message: string;
  website?: string;
};

const labels: Record<string, string> = {
  name: "Prénom", surname: "Nom", email: "E-mail", phone: "Téléphone",
  profile: "Profil", subject: "Objet", city: "Ville", address: "Adresse",
  propertyType: "Type de bien", type: "Type de bien", propertyCount: "Nombre de biens",
  timeline: "Délai", area: "Surface", bedrooms: "Chambres", bathrooms: "Salles de bain",
  capacity: "Capacité", finish: "Finition", amenities: "Équipements",
  services: "Services recherchés", currentlyRented: "Bien déjà loué",
  availability: "Disponibilité", currentOccupancy: "Occupation actuelle",
  currentRevenue: "Revenu actuel", objective: "Objectif", message: "Message",
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendLeadEmail(kind: LeadKind, payload: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT || "contatto@aurevia-genova.com";
  const from = process.env.CONTACT_FROM || "AUREVIA <contact@aurevia-genova.com>";
  if (!apiKey || !recipient || !from) return null;

  const ignored = new Set(["website", "consent"]);
  const rows = Object.entries(payload)
    .filter(([key, value]) => !ignored.has(key) && value !== "" && value != null)
    .map(([key, value]) => {
      const rendered = Array.isArray(value) ? value.join(", ") : value;
      return `<tr><th style="padding:10px;text-align:left;vertical-align:top;border-bottom:1px solid #ddd">${escapeHtml(labels[key] || key)}</th><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(rendered)}</td></tr>`;
    }).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: payload.email,
      subject: `${kind === "valuation" ? "Nouvelle évaluation" : "Nouveau contact"} — ${payload.name} ${payload.surname}`,
      html: `<div style="font-family:Arial,sans-serif;color:#0d1b2a"><h1 style="font-family:Georgia,serif">Nouvelle demande AUREVIA</h1><p>Une demande a été envoyée depuis aurevia-genova.com.</p><table style="width:100%;border-collapse:collapse">${rows}</table></div>`,
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
  const emailId = await sendLeadEmail(kind, payload);
  if (!emailId) throw new Error("RESEND_API_KEY n’est pas configurée sur Vercel.");
  return { reference: emailId, channels: ["email"] };
}
