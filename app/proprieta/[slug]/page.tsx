import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { PageHero, CTA } from "@/components/PageHero";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";

async function getProperty(slug: string) {
  try {
    const db = await getDb();
    const [property] = await db.select().from(managedProperties).where(eq(managedProperties.slug, slug)).limit(1);
    return property?.status === "published" ? property : null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return {};
  return {
    title: property.seoTitle || property.name,
    description: property.seoDescription || property.shortDescription || undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();
  const gallery = Array.isArray(property.gallery) ? property.gallery : [];
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  return <>
    <PageHero label={property.location} title={property.name} text={property.shortDescription || "Un bien confié à l’attention AUREVIA."} image={property.image} />
    <section className="section ivory">
      <div className="container property-public-detail">
        <div className="property-public-intro">
          <div><p className="eyebrow dark">{property.propertyType}</p><h2>{property.name}</h2></div>
          <div className="property-public-facts"><span>{property.bedrooms} chambres</span><span>{property.guests} voyageurs</span><span>{property.baths} salles de bain</span>{property.surface && <span>{property.surface} m²</span>}</div>
        </div>
        {property.description && <p className="property-public-description">{property.description}</p>}
        {gallery.length > 0 && <div className="property-public-gallery">{gallery.map((image, index) => <div key={`${image}-${index}`} style={{ backgroundImage: `url("${image}")` }} />)}</div>}
        {amenities.length > 0 && <div className="property-public-amenities"><p className="eyebrow dark">Équipements et attentions</p><ul>{amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul></div>}
      </div>
    </section>
    <CTA />
  </>;
}
