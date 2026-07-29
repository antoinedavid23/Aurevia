import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getInternalAdminUser } from "@/lib/internal-auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (await getInternalAdminUser()) redirect("/administration");
  return (
    <main className="admin-login-page">
      <AdminLoginForm />
    </main>
  );
}
