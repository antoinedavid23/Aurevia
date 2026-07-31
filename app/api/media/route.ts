import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";

type MediaBucket = {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
};

export async function POST(request: Request) {
  if (!await getAdminUser()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
    return NextResponse.json({ error: "Format non accepté" }, { status: 415 });
  }
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image trop lourde (8 Mo maximum)" }, { status: 413 });
  const { env } = await import(/* webpackIgnore: true */ "cloudflare:workers") as { env: { MEDIA?: MediaBucket } };
  if (!env.MEDIA) return NextResponse.json({ error: "Stockage média indisponible" }, { status: 503 });
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
  const key = `${crypto.randomUUID()}.${extension}`;
  await env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return NextResponse.json({ url: `/api/media/${key}` }, { status: 201 });
}
