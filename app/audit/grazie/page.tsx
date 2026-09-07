import type { Metadata } from "next";
import { AuditThankYou } from "@/components/AuditThankYou";

export const metadata: Metadata = { title:"La Sua diagnosi AUREVIA", robots:{index:false,follow:false} };
export default function Page(){ return <AuditThankYou/>; }
