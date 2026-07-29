import { getDb } from "@/db";
import { leads } from "@/db/schema";

type LeadKind = "contact" | "valuation";
type LeadPayload = Record<string, unknown> & {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  city?: string;
  propertyType?: string;
  type?: string;
  subject?: string;
  message: string;
};

export async function storeLead(kind: LeadKind, payload: LeadPayload) {
  const db = await getDb();
  const [lead] = await db.insert(leads).values({
    kind,
    name: payload.name,
    surname: payload.surname,
    email: payload.email,
    phone: payload.phone || null,
    city: payload.city || null,
    propertyType: payload.propertyType || payload.type || null,
    subject: payload.subject || null,
    message: payload.message,
    details: payload,
    updatedAt: new Date(),
  }).returning();

  await notifyByEmail(kind, payload, lead.id).catch((error) => {
    console.error("AUREVIA email notification failed", { leadId: lead.id, error: String(error) });
  });

  return lead;
}

async function notifyByEmail(kind: LeadKind, payload: LeadPayload, leadId: number) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT;
  if (!apiKey || !recipient) return;

  const subject = kind === "valuation"
    ? `Nouvelle demande d’évaluation — ${payload.name} ${payload.surname}`
    : `Nouveau contact AUREVIA — ${payload.name} ${payload.surname}`;

  const lines = [
    `Référence : #${leadId}`,
    `Nom : ${payload.name} ${payload.surname}`,
    `E-mail : ${payload.email}`,
    `Téléphone : ${payload.phone || "Non renseigné"}`,
    `Localisation : ${payload.city || "Non renseignée"}`,
    `Type de bien : ${payload.propertyType || payload.type || "Non renseigné"}`,
    "",
    payload.message,
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "AUREVIA <onboarding@resend.dev>",
      to: [recipient],
      reply_to: payload.email,
      subject,
      text: lines.join("\n"),
    }),
  });
  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
}
