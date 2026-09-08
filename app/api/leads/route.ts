import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { listLeads, updateLeadStatus } from "@/lib/lead-storage";
import { leadStatuses, type LeadStatus } from "@/lib/lead-crm";

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
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const body = await request.json().catch(() => null) as { id?: number; status?: LeadStatus } | null;
  if (!body || !Number.isSafeInteger(body.id) || body.id! <= 0 || !leadStatuses.includes(body.status!)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  try {
    const lead = await updateLeadStatus(body.id!, body.status!);
    return NextResponse.json(lead || { error: "Dossier introuvable" }, { status: lead ? 200 : 404, headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("AUREVIA inbox update failed", error);
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }
}
