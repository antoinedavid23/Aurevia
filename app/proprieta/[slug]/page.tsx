import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { PageHero } from "@/components/public-site/PageHero";
import { getDb } from "@/db";
import { managedProperties } from "@/db/schema";
import { pageMetadata } from "@/lib/public-site/site-metadata";
import { ItalianContent } from "@/components/public-site/ItalianContent";

async function getProperty(slug: string) {
  try {
    const db = await getDb();
    const [property] = await db.select().from(managedProperties).where(eq(managedProperties.slug, slug)).limit(1);
    if (property?.status === "published") return property;
  } catch {}
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return {};
  return pageMetadata({
    title: "seoTitle" in property && property.seoTitle ? property.seoTitle : property.name,
    description: "seoDescription" in property && property.seoDescription ? property.seoDescription : property.shortDescription || "Un bien présenté par AUREVIA à Genova.",
    path: `/proprieta/${slug}`,
    image: property.image || "/images/home/hero-concierge.webp",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();
  const gallery = Array.isArray(property.gallery) ? property.gallery : [];
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const images = [property.image, ...gallery].filter((image, index, collection) => image && collection.indexOf(image) === index);
  const facts = [
    ["Type de bien", property.propertyType || "Bien"],
    ["Capacité", `${property.guests} voyageurs`],
    ["Nuit", `${property.bedrooms} ${property.bedrooms > 1 ? "chambres" : "chambre"}`],
    ["Eau", `${property.baths} ${property.baths > 1 ? "salles de bain" : "salle de bain"}`],
    ...(property.surface ? [["Surface", `${property.surface} m²`]] : []),
  ];

  return <ItalianContent><><PageHero label={property.location} title={property.name} text={property.shortDescription || "Un bien présenté avec soin par AUREVIA."} image={property.image} />
    <section className="section property-detail-overview"><div className="container">
      <div className="property-detail-opening"><div><p className="eyebrow dark">Le lieu</p><h2>{property.shortDescription || `${property.name}, à ${property.location}.`}</h2></div><div className="property-detail-address"><span>À Genova</span><strong>{property.location}</strong>{property.address && <p>{property.address}</p>}</div></div>
      <div className="property-detail-facts">{facts.map(([label, value], index) => <div key={label}><span>0{index + 1}</span><small>{label}</small><strong>{value}</strong></div>)}</div>
      {property.description && <div className="property-detail-story"><p className="eyebrow dark">L’esprit du bien</p><p>{property.description}</p></div>}
    </div></section>
    {images.length > 0 && <section className="property-detail-gallery-section" aria-label={`Galerie de ${property.name}`}><div className="container"><div className={`property-detail-gallery count-${Math.min(images.length, 4)}`}>{images.slice(0, 4).map((image, index) => <figure key={`${image}-${index}`}><div style={{ backgroundImage: `url("${image}")` }} role="img" aria-label={`${property.name}, vue ${index + 1}`} /><figcaption><span>0{index + 1}</span>{index === 0 ? "Le bien" : "Un détail du lieu"}</figcaption></figure>)}</div></div></section>}
    {amenities.length > 0 && <section className="section property-detail-amenities"><div className="container"><div className="property-detail-amenities-heading"><div><p className="eyebrow">Les attentions du lieu</p><h2>Les voyageurs trouvent immédiatement leurs repères.</h2></div><p>Les équipements et particularités sont présentés tels qu’ils sont, pour que les voyageurs sachent exactement ce qu’ils trouveront.</p></div><ol>{amenities.map((amenity, index) => <li key={amenity}><span>{String(index + 1).padStart(2, "0")}</span><strong>{amenity}</strong></li>)}</ol></div></section>}
    <section className="property-detail-signature"><div className="container"><p>Un bien suivi par AUREVIA</p><h2>Connaître chaque détail permet de mieux préparer le bien.</h2><span>Une présence locale à Genova accompagne chaque séjour.</span></div></section>
  </></ItalianContent>;
}
