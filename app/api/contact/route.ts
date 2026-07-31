import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { storeLead } from "@/lib/lead-storage";

export async function POST(req: Request) {
  try {
    const parsed = leadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Les informations transmises sont incomplètes." },
        { status: 400 },
      );
    }
    const lead = await storeLead("contact", parsed.data);
    return NextResponse.json({ ok: true, reference: lead.id }, { status: 201 });
  } catch (error) {
    console.error("AUREVIA contact storage failed", error);
    return NextResponse.json(
      { ok: false, error: "La demande n’a pas pu être enregistrée." },
      { status: 500 },
    );
  }
}
