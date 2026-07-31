import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { listLeads, updateLeadStatus } from "@/lib/lead-storage";

export async function GET() {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  try {
    return NextResponse.json(await listLeads(), {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("AUREVIA inbox loading failed", error);
    return NextResponse.json({ error: "Boîte de réception indisponible" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const body = await request.json() as { id?: number; status?: "new" | "read" | "archived" };
  if (!body.id || !["new", "read", "archived"].includes(body.status || "")) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  try {
    return NextResponse.json(await updateLeadStatus(body.id, body.status!));
  } catch (error) {
    console.error("AUREVIA inbox update failed", error);
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }
}
