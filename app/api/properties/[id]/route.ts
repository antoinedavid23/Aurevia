import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";
import { propertySchema } from "../route";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const parsed = propertySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  const { id } = await params;
  try {
    const db = await getDb();
    const [updated] = await db.update(managedProperties).set({ ...parsed.data, updatedAt: new Date() }).where(eq(managedProperties.id, Number(id))).returning();
    if (!updated) return NextResponse.json({ error: "Bien introuvable" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    const duplicate = String(error).toLowerCase().includes("unique");
    return NextResponse.json({ error: duplicate ? "Cette adresse web existe déjà." : "Modification impossible." }, { status: duplicate ? 409 : 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const { id } = await params;
  const db = await getDb();
  await db.delete(managedProperties).where(eq(managedProperties.id, Number(id)));
  return NextResponse.json({ ok: true });
}
