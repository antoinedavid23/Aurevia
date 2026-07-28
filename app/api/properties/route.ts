import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";
import { z } from "zod";

const propertySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(120),
  location: z.string().trim().min(2).max(120),
  bedrooms: z.coerce.number().int().min(1).max(30),
  guests: z.coerce.number().int().min(1).max(60),
  baths: z.coerce.number().int().min(1).max(30),
  image: z.string().trim().max(500).default("/images/home/hero-concierge.webp"),
  status: z.enum(["draft","published"]).default("draft"),
});

export async function GET() {
  try {
    const rows = await getDb().select().from(managedProperties).where(eq(managedProperties.status,"published")).orderBy(desc(managedProperties.updatedAt));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  if (!await getAdminUser()) return NextResponse.json({error:"Accès refusé"},{status:403});
  const parsed = propertySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error:"Données invalides",details:parsed.error.flatten()},{status:400});
  const [created] = await getDb().insert(managedProperties).values({...parsed.data,updatedAt:new Date()}).returning();
  return NextResponse.json(created,{status:201});
}
