import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { deliverLead } from "@/lib/lead-delivery";

export async function POST(req: Request) {
  try {
    const parsed = leadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Les informations transmises sont incomplètes." },
        { status: 400 },
      );
    }
    const delivery = await deliverLead("valuation", parsed.data);
    return NextResponse.json({ ok: true, ...delivery }, { status: 201 });
  } catch (error) {
    console.error("AUREVIA valuation delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "L’envoi n’a pas abouti. Réessayez dans un instant." },
      { status: 500 },
    );
  }
}
