import { NextResponse } from "next/server";

type MediaObject = {
  body: BodyInit;
  httpMetadata?: { contentType?: string };
};
type MediaBucket = { get(key: string): Promise<MediaObject | null> };

export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^[a-z0-9-]+\.(jpg|jpeg|png|webp|avif)$/i.test(key)) return new NextResponse(null, { status: 404 });
  const { env } = await import(/* webpackIgnore: true */ "cloudflare:workers") as { env: { MEDIA?: MediaBucket } };
  const object = await env.MEDIA?.get(key);
  if (!object) return new NextResponse(null, { status: 404 });
  return new NextResponse(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
