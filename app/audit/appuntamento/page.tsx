import type { Metadata } from "next";
import { AuditAppointment } from "@/components/AuditAppointment";

export const metadata: Metadata = {
  title: "Un appuntamento con AUREVIA",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AuditAppointment />;
}
