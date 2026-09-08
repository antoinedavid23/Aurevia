import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getInternalAdminUser } from "@/lib/internal-auth";

export async function getAdminUser() {
  const internalUser = await getInternalAdminUser();
  if (internalUser) return internalUser;
  // Only the legacy Sites dispatcher authenticates these headers. On Vercel
  // they are ordinary, client-controlled request headers, not proof of identity.
  if (process.env.VERCEL) return null;
  const user = await getChatGPTUser();
  if (!user) return null;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) return null;
  return user;
}
