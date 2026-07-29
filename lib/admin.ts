import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function getAdminUser() {
  const user = await getChatGPTUser();
  if (!user) return null;
  const allowed = (process.env.ADMIN_EMAILS || "").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean);
  if (!allowed.includes(user.email.toLowerCase())) return null;
  return user;
}
