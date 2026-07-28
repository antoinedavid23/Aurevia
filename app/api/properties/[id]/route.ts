import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}) {
  if (!await getAdminUser()) return NextResponse.json({error:"Accès refusé"},{status:403});
  const {id}=await params;
  await getDb().delete(managedProperties).where(eq(managedProperties.id,Number(id)));
  return NextResponse.json({ok:true});
}
