import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";
import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(120),
  location: z.string().trim().min(2).max(120),
  address: z.string().trim().max(180).optional().default(""),
  propertyType: z.string().trim().min(2).max(80).default("Appartement"),
  bedrooms: z.coerce.number().int().min(0).max(30),
  guests: z.coerce.number().int().min(1).max(60),
  baths: z.coerce.number().int().min(0).max(30),
  surface: z.preprocess((value) => value === "" || value == null ? null : value, z.coerce.number().int().min(1).max(10000).nullable()),
  shortDescription: z.string().trim().max(240).default(""),
  description: z.string().trim().max(6000).default(""),
  amenities: z.array(z.string().trim().min(1).max(80)).max(40).default([]),
  image: z.string().trim().max(1000).default("/images/home/hero-concierge.webp"),
  gallery: z.array(z.string().trim().max(1000)).max(20).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  featured: z.coerce.boolean().default(false),
  seoTitle: z.string().trim().max(70).optional().default(""),
  seoDescription: z.string().trim().max(170).optional().default(""),
});

export async function GET() {
  try {
    const admin = await getAdminUser();
    const db = await getDb();
    const rows = admin
      ? await db.select().from(managedProperties).orderBy(desc(managedProperties.updatedAt))
      : await db.select().from(managedProperties).where(eq(managedProperties.status, "published")).orderBy(desc(managedProperties.updatedAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const parsed = propertySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  try {
    const db = await getDb();
    const [created] = await db.insert(managedProperties).values({ ...parsed.data, updatedAt: new Date() }).returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const duplicate = String(error).toLowerCase().includes("unique");
    return NextResponse.json({ error: duplicate ? "Cette adresse web existe déjà." : "Enregistrement impossible." }, { status: duplicate ? 409 : 500 });
  }
}
