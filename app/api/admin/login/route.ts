import { NextResponse } from "next/server";
import {
  adminSession,
  createAdminSessionValue,
  verifyAdminPassword,
} from "@/lib/internal-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const expectedUsername = process.env.ADMIN_USERNAME || "Aurevia";
  const usernameMatches =
    body.username?.trim().toLowerCase() === expectedUsername.toLowerCase();
  const passwordMatches =
    typeof body.password === "string" && (await verifyAdminPassword(body.password));

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json(
      { error: "Identifiant ou mot de passe incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: adminSession.cookieName,
    value: await createAdminSessionValue(expectedUsername),
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: adminSession.maxAge,
  });
  return response;
}
