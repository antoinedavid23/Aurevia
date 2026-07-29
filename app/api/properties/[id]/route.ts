import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";
import { getAdminUser } from "@/lib/admin";
import { z } from "zod";

const updateSchema=z.object({
  name:z.string().trim().min(2).max(120),
  slug:z.string().trim().regex(/^[a-z0-9-]+$/).max(120),
  location:z.string().trim().min(2).max(120),
  bedrooms:z.coerce.number().int().min(1).max(30),
  guests:z.coerce.number().int().min(1).max(60),
  baths:z.coerce.number().int().min(1).max(30),
  image:z.string().trim().max(500),
  status:z.enum(["draft","published"]),
});

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}) {
  if (!await getAdminUser()) return NextResponse.json({error:"Accès refusé"},{status:403});
  const parsed=updateSchema.safeParse(await request.json());
  if(!parsed.success)return NextResponse.json({error:"Données invalides"},{status:400});
  const {id}=await params;
  const db=await getDb();
  const [updated]=await db.update(managedProperties).set({...parsed.data,updatedAt:new Date()}).where(eq(managedProperties.id,Number(id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}) {
  if (!await getAdminUser()) return NextResponse.json({error:"Accès refusé"},{status:403});
  const {id}=await params;
  const db=await getDb();
  await db.delete(managedProperties).where(eq(managedProperties.id,Number(id)));
  return NextResponse.json({ok:true});
}
