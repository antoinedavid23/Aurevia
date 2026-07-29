import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";

export async function GET() {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const db = await getDb();
  return NextResponse.json(await db.select().from(leads).orderBy(desc(leads.createdAt)));
}

export async function PATCH(request: Request) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const body = await request.json() as { id?: number; status?: "new" | "read" | "archived" };
  if (!body.id || !["new", "read", "archived"].includes(body.status || "")) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const db = await getDb();
  const [updated] = await db.update(leads).set({ status: body.status, updatedAt: new Date() }).where(eq(leads.id, body.id)).returning();
  return NextResponse.json(updated);
}
