import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { getLead, listLeads, updateLeadStatus } from "@/lib/lead-storage";
import { leadStatuses, parseLeadFilters, type LeadStatus } from "@/lib/lead-crm";

export async function GET(request: Request) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const params = new URL(request.url).searchParams;
  const id = params.get("id");
  const filters = parseLeadFilters(params);
  if ((id !== null && (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0)) || !filters)
    return NextResponse.json({ error: "Recherche invalide" }, { status: 400 });
  try {
    const result = id ? await getLead(Number(id)) : await listLeads(filters);
    return NextResponse.json(result || { error: "Dossier introuvable" }, {
      status: result ? 200 : 404,
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch {
    console.error("AUREVIA inbox loading failed");
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
  } catch {
    console.error("AUREVIA inbox update failed");
    return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
  }
}
