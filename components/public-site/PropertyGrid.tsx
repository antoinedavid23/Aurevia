"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Property } from "@/data/public-site/content";
import { PropertyCard } from "@/components/public-site/Cards";
import { ItalianContent } from "@/components/public-site/ItalianContent";

export function PropertyGrid() {
  const [location, setLocation] = useState("Toutes");
  const [managed, setManaged] = useState<Property[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/properties")
      .then((response) => response.ok ? response.json() : [])
      .then((rows: Property[]) => setManaged(rows.map((row, index) => ({ ...row, tone: (index % 6) + 1 }))))
      .catch(() => setManaged([]))
      .finally(() => setLoaded(true));
  }, []);

  const availableLocations = useMemo(() => ["Toutes", ...Array.from(new Set(managed.map((item) => item.location)))], [managed]);
  const visible = location === "Toutes" ? managed : managed.filter((property) => property.location === location);

  if (!loaded) return <ItalianContent><div className="property-empty-loading" role="status">Vérification des biens disponibles…</div></ItalianContent>;

  if (managed.length === 0) return <ItalianContent><div className="property-empty" role="status">
    <div className="property-empty-copy"><p className="eyebrow dark">Biens publiés</p><h2>Aucun bien présenté pour le moment.</h2><p>Cette page restera vide tant qu’un propriétaire n’aura pas autorisé la publication de son bien.</p><Link className="text-link" href="/valutazione">Confier votre bien à AUREVIA <ArrowRight size={16} /></Link></div>
  </div></ItalianContent>;

  return <ItalianContent>
    <div className="property-filters" aria-label="Filtrer les propriétés par localisation">{availableLocations.map((item) => <button key={item} type="button" className={location === item ? "active" : ""} aria-pressed={location === item} onClick={() => setLocation(item)}>{item}</button>)}</div>
    <div className="card-grid three" aria-live="polite">{visible.map((property) => <PropertyCard key={property.slug} property={property} />)}</div>
  </ItalianContent>;
}
