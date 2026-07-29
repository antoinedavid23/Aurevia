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
  const [lead] = await db
    .insert(leads)
    .values({
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
    })
    .returning();

  return lead;
}
