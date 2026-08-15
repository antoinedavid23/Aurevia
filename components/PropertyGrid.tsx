"use client";

import { useEffect, useMemo, useState } from "react";
import type { Property } from "@/data/content";
import { properties as examples } from "@/data/content";
import { PropertyCard } from "@/components/Cards";

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

  const collection = managed.length > 0 ? managed : examples;
  const availableLocations = useMemo(() => ["Toutes", ...Array.from(new Set(collection.map((item) => item.location)))], [collection]);
  const visible = location === "Toutes" ? collection : collection.filter((property) => property.location === location);

  return <>
    {managed.length === 0 && loaded && <p className="demo-note">Collection de démonstration : les fiches doivent être remplacées par des biens réels et autorisés avant publication.</p>}
    <div className="property-filters" aria-label="Filtrer les propriétés par localisation">{availableLocations.map((item) => <button key={item} type="button" className={location === item ? "active" : ""} aria-pressed={location === item} onClick={() => setLocation(item)}>{item}</button>)}</div>
    <div className="card-grid three" aria-live="polite">{visible.map((property) => <PropertyCard key={property.slug} property={property} />)}</div>
  </>;
}
